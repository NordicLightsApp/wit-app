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

import java.util.UUID;

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
import com.mbientlab.metawear.module.*;
import com.mbientlab.metawear.DeviceInformation;
import com.mbientlab.metawear.data.Acceleration;

import bolts.Continuation;
import bolts.Task;

public class MetawearModule extends ReactContextBaseJavaModule implements ServiceConnection {

    private BtleService.LocalBinder serviceBinder;
    private static final String LOG_TAG = "MetawearModule";
    private static final String MW_MAC_ADDRESS = "CD:80:DA:BF:54:66"; // Replace with your board's MAC address
    private MetaWearBoard mwBoard;
    private Accelerometer accelerometer;
    private DeviceInformation deviceInfo;
    private Debug debug;
    private Logging logging;

    private float latestXAxis = 0.0f;
    private float latestYAxis = 0.0f;
    private float latestZAxis = 0.0f;   

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
        String mwMacAddress = MW_MAC_ADDRESS;
        BluetoothManager btManager = (BluetoothManager) getReactApplicationContext().getSystemService(Context.BLUETOOTH_SERVICE);
        BluetoothDevice btDevice = btManager.getAdapter().getRemoteDevice(mwMacAddress);

        mwBoard = serviceBinder.getMetaWearBoard(btDevice);
        mwBoard.connectAsync().continueWithTask(task -> task.isCancelled() || !task.isFaulted() ? task : reconnect(mwBoard));
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
    public void refreshAxis() {
        if (mwBoard != null) {
            try {
                // Retrieve the accelerometer module
                Accelerometer accelerometer = mwBoard.getModule(Accelerometer.class);
                if (accelerometer == null) {
                    Log.e(LOG_TAG, "Accelerometer module is not available");
                    return; // Return an error value
                }
    
                // Configure the accelerometer
                accelerometer.configure()
                    .odr(50f) // Set output data rate to 50Hz
                    .commit();
    
                // Start the accelerometer and set up a route to stream data
                accelerometer.acceleration().addRouteAsync(new RouteBuilder() {
                    @Override
                    public void configure(RouteComponent source) {
                        source.stream(new Subscriber() {
                            @Override
                            public void apply(Data data, Object... env) {
                                // Handle the acceleration data here
                                Acceleration acceleration = data.value(Acceleration.class);
                                latestXAxis = acceleration.x(); // Store the latest X-axis value
                                latestYAxis = acceleration.y(); // Store the latest Y-axis value
                                latestZAxis = acceleration.z(); // Store the latest Z-axis value
                                Log.d(LOG_TAG, "Acceleration X: " + latestXAxis);
                                Log.d(LOG_TAG, "Acceleration Y: " + latestYAxis);
                                Log.d(LOG_TAG, "Acceleration Z: " + latestZAxis);
                            }
                        });
                    }
                }).continueWith(task -> {
                    if (task.isFaulted()) {
                        Log.e(LOG_TAG, "Failed to set up accelerometer route", task.getError());
                    } else {
                        Log.i(LOG_TAG, "Accelerometer route set up successfully");
                    }
                    return null;
                });
    
                accelerometer.start();
                accelerometer.acceleration().start();
    
            } catch (Exception e) {
                Log.e(LOG_TAG, "Failed to start accelerometer", e);
            }
        } else {
            Log.e(LOG_TAG, "MetaWearBoard is not initialized");
        }
    }

    @ReactMethod
    public float getX(){
        return latestXAxis;
    }

    @ReactMethod
    public float getY(){
        return latestYAxis;
    }

    @ReactMethod
    public float getZ(){
        return latestZAxis;
    }

    public static Task<Void> reconnect(final MetaWearBoard board) {
        return board.connectAsync().continueWithTask(task -> task.isFaulted() ? reconnect(board) : task);
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

    @ReactMethod
    public void getManufacturer(Promise promise) {
        if (mwBoard != null) {
            mwBoard.readDeviceInformationAsync().continueWith(task -> {
                if (task.isFaulted()) {
                    Log.e(LOG_TAG, "Failed to read device information", task.getError());
                    promise.reject("READ_DEVICE_INFO_ERROR", "Failed to read device information");
                } else {
                    DeviceInformation deviceInfo = task.getResult();
                    Log.i(LOG_TAG, "Manufacturer: " + deviceInfo.manufacturer);
                    promise.resolve(deviceInfo.manufacturer);
                }
                return null;
            });
        } else {
            Log.e(LOG_TAG, "MetaWearBoard is not initialized");
            promise.reject("BOARD_NOT_INITIALIZED", "MetaWearBoard is not initialized");
        }
    }

    @ReactMethod
    public void connectAsync(Promise promise){
        if (mwBoard != null) {
            reconnect(mwBoard).continueWith(task -> {
                if (task.isFaulted()) {
                    Log.e(LOG_TAG, "Failed to reconnect to the device", task.getError());
                    promise.reject("RECONNECT_ERROR", "Failed to reconnect to the device");
                } else {
                    Log.i(LOG_TAG, "Reconnected to the device successfully");
                    promise.resolve("Reconnected to the device successfully");
                }
                return null;
            });
        } else {
            Log.e(LOG_TAG, "MetaWearBoard is not initialized");
            promise.reject("BOARD_NOT_INITIALIZED", "MetaWearBoard is not initialized");
        }
    }

  


}