package com.jasminfranti.witapi;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class BluetoothPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        // Return a list of modules that will be available in JavaScript
        return Arrays.<NativeModule>asList(new BluetoothModule(reactContext));
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        // Return an empty list as we are not creating custom views
        return Collections.emptyList();
    }
}
