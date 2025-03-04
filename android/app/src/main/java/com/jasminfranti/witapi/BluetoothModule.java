package com.jasminfranti.witapi;

import android.util.Log;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import android.app.Activity;

import java.util.*;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;

import com.wit.witsdk.modular.sensor.device.exceptions.OpenDeviceException;
import com.wit.witsdk.modular.sensor.example.ble5.Bwt901ble;
import com.wit.witsdk.modular.sensor.example.ble5.interfaces.IBwt901bleRecordObserver;
import com.wit.witsdk.modular.sensor.modular.connector.modular.bluetooth.BluetoothBLE;
import com.wit.witsdk.modular.sensor.modular.connector.modular.bluetooth.BluetoothSPP;
import com.wit.witsdk.modular.sensor.modular.connector.modular.bluetooth.WitBluetoothManager;
import com.wit.witsdk.modular.sensor.modular.connector.modular.bluetooth.exceptions.BluetoothBLEException;
import com.wit.witsdk.modular.sensor.modular.connector.modular.bluetooth.interfaces.IBluetoothFoundObserver;
import com.wit.witsdk.modular.sensor.modular.processor.constant.WitSensorKey;

public class BluetoothModule extends ReactContextBaseJavaModule implements IBluetoothFoundObserver, IBwt901bleRecordObserver {

    private static final String TAG = "BluetoothModule";
    private List<Bwt901ble> bwt901bleList = new ArrayList<>();
    private boolean destroyed = true;
    private String deviceName = "";
    private String angleX = "";
    private String angleY = "";
    private String angleZ = ""; 
    private String errorMessage = "default";

    public BluetoothModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "BluetoothModule";
    }

    @Override
    public void onFoundSPP(BluetoothSPP bluetoothSPP) {
        // This override is needed to avoid build error
    }

    @Override
    public void onRecord(Bwt901ble bwt901ble) {
        angleX = getAngleXData(bwt901ble);
        angleY = getAngleYData(bwt901ble);
        angleZ = getAngleZData(bwt901ble);
    }

    @Override
    public void onFoundBle(BluetoothBLE bluetoothBLE) {
        // Create a Bluetooth 5.0 sensor connection object
        Bwt901ble bwt901ble = new Bwt901ble(bluetoothBLE);
        for (int i = 0; i < bwt901bleList.size(); i++) {
            if (Objects.equals(bwt901bleList.get(i).getDeviceName(), bwt901ble.getDeviceName())) {
                return;
            }
        }

        // add to device list
        bwt901bleList.add(bwt901ble);
        deviceName = bwt901ble.getDeviceName();

        // Registration data record
        bwt901ble.registerRecordObserver(this);

        // Turn on the device
        try {
            bwt901ble.open();
            errorMessage = "I'm in try block";
        } catch (OpenDeviceException e) {
            // Failed to open device
            errorMessage = "I'm in catch";
            e.printStackTrace();
        }
    }

    private String getAngleXData(Bwt901ble bwt901ble) {
        String angleX = bwt901ble.getDeviceData(WitSensorKey.AngleX);
        return angleX;
    }

    private String getAngleYData(Bwt901ble bwt901ble) {
        String angleY = bwt901ble.getDeviceData(WitSensorKey.AngleY);
        return angleY;
    }

    private String getAngleZData(Bwt901ble bwt901ble) {
        String angleZ = bwt901ble.getDeviceData(WitSensorKey.AngleZ);
        return angleZ;
    }

    public void startDiscovery() {
        // Get the current Activity from ReactApplicationContext
        Activity currentActivity = getCurrentActivity();
    
        // Check if currentActivity is not null
        if (currentActivity != null) {
            WitBluetoothManager.initInstance(currentActivity);
        }

        // Turn off all device
        for (int i = 0; i < bwt901bleList.size(); i++) {
            Bwt901ble bwt901ble = bwt901bleList.get(i);
            bwt901ble.removeRecordObserver(this);
            bwt901ble.close();
        }

        // Erase all devices
        bwt901bleList.clear();

        // Start searching for bluetooth
        try {
            // get bluetooth manager
            WitBluetoothManager bluetoothManager = WitBluetoothManager.getInstance();
            // Monitor communication signals
            bluetoothManager.registerObserver(this);
            // start search
            bluetoothManager.startDiscovery();
        } catch (BluetoothBLEException e) {
            e.printStackTrace();
            errorMessage = e.getMessage();
        }
    }

    public void stopDiscovery() {
        // stop searching for bluetooth
        try {
            // acquire Bluetooth manager
            WitBluetoothManager bluetoothManager = WitBluetoothManager.getInstance();
            // Cancel monitor communication signals
            bluetoothManager.removeObserver(this);
            // stop searching
            bluetoothManager.stopDiscovery();
        } catch (BluetoothBLEException e) {
            e.printStackTrace();
        }
    }

    // React methods are the ones that can be used from react components
    @ReactMethod
    public void startDiscoveryR() {
        startDiscovery();
    }

    @ReactMethod
    public void stopDiscoveryR() {
        stopDiscovery();
    }

    @ReactMethod
    public void getDeviceName(Promise promise) {
        try {
            String data = deviceName;
            promise.resolve(data);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getAngleX(Promise promise) {
        try {
            String x = angleX;
            promise.resolve(x);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getAngleY(Promise promise) {
        try {
            String y = angleY;
            promise.resolve(y);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getAngleZ(Promise promise) {
        try {
            String z = angleZ;
            promise.resolve(z);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    // This is just my clumsy debugging method, likely not needed in the future
    @ReactMethod
    public void getError(Promise promise) {
        String error = errorMessage;
        promise.resolve(error);
    }
}
