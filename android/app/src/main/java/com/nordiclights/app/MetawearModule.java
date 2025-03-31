package com.nordiclights.app;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;

import android.app.Activity;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import com.mbientlab.metawear.Data;
import com.mbientlab.metawear.MetaWearBoard;
import com.mbientlab.metawear.Route;
import com.mbientlab.metawear.Subscriber;
import com.mbientlab.metawear.android.BtleService;
import com.mbientlab.metawear.builder.RouteBuilder;
import com.mbientlab.metawear.builder.RouteComponent;
import com.mbientlab.metawear.builder.filter.Comparison;
import com.mbientlab.metawear.builder.filter.ThresholdOutput;
import com.mbientlab.metawear.builder.function.Function1;
import com.mbientlab.metawear.module.Accelerometer;
import com.mbientlab.metawear.module.Debug;
import com.mbientlab.metawear.module.Logging;

import bolts.Continuation;
import bolts.Task;

public class MetawearModule extends ReactContextBaseJavaModule implements ServiceConnection {

    private BtleService.LocalBinder serviceBinder;
    private static final String LOG_TAG = "freefall";
    private MetaWearBoard mwBoard;
    private Accelerometer accelerometer;
    private Debug debug;
    private Logging logging;


    public MetawearModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Intent intent = new Intent(reactContext, BtleService.class);
        reactContext.bindService(intent, this, Context.BIND_AUTO_CREATE);
    }

    @Override
    public String getName() {
        return "MetawearModule";
    }

    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {
        serviceBinder = (BtleService.LocalBinder) service;

        // Replace with your board's MAC address
        String mwMacAddress = "F2:10:8A:6B:6F:5D";
        BluetoothManager btManager = (BluetoothManager) getReactApplicationContext().getSystemService(Context.BLUETOOTH_SERVICE);
        BluetoothDevice btDevice = btManager.getAdapter().getRemoteDevice(mwMacAddress);

        mwBoard = serviceBinder.getMetaWearBoard(btDevice);
        mwBoard.connectAsync().onSuccessTask(task -> {
            accelerometer = mwBoard.getModule(Accelerometer.class);
            accelerometer.configure()
                    .odr(50f) // Set output data rate to 50Hz
                    .commit();
            return accelerometer.acceleration().addRouteAsync(source ->
                source.map(Function1.RSS).lowpass((byte) 4).filter(ThresholdOutput.BINARY, 0.5f)
                    .multicast()
                        .to().filter(Comparison.EQ, -1).log((data, env) -> Log.i(LOG_TAG, data.formattedTimestamp() + ": Entered Free Fall"))
                        .to().filter(Comparison.EQ, 1).log((data, env) -> Log.i(LOG_TAG, data.formattedTimestamp() + ": Left Free Fall"))
                    .end());
        }).continueWith((Continuation<Route, Void>) task -> {
            if (task.isFaulted()) {
                Log.e(LOG_TAG, mwBoard.isConnected() ? "Error setting up route" : "Error connecting", task.getError());
            } else {
                Log.i(LOG_TAG, "Connected");
                debug = mwBoard.getModule(Debug.class);
                logging = mwBoard.getModule(Logging.class);
            }
            return null;
        });
    }

    @Override
    public void onServiceDisconnected(ComponentName componentName) {
        serviceBinder = null;
    }

    public BtleService.LocalBinder getServiceBinder() {
        MainApplication app = (MainApplication) getReactApplicationContext().getApplicationContext();
        
        serviceBinder = app.getServiceBinder();
        return app.getServiceBinder();
    }

    @ReactMethod
    public void startAccelerometer() {
        if (accelerometer != null && logging != null) {
            logging.start(false);
            accelerometer.acceleration().start();
            accelerometer.start();
            Log.i(LOG_TAG, "Accelerometer started");
        } else {
            Log.e(LOG_TAG, "Accelerometer or Logging module is not initialized");
        }
    }

    @ReactMethod
    public void stopAccelerometer() {
        if (accelerometer != null && logging != null) {
            accelerometer.stop();
            accelerometer.acceleration().stop();
            logging.stop();
            logging.downloadAsync().continueWith(task -> {
                Log.i(LOG_TAG, "Log download complete");
                return null;
            });
            Log.i(LOG_TAG, "Accelerometer stopped");
        } else {
            Log.e(LOG_TAG, "Accelerometer or Logging module is not initialized");
        }
    }

    @ReactMethod
    public void resetBoard() {
        if (debug != null) {
            debug.resetAsync();
            Log.i(LOG_TAG, "Board reset");
        } else {
            Log.e(LOG_TAG, "Debug module is not initialized");
        }
    }




    


  


}