package com.nordiclights.app

import android.app.Activity;
import android.content.*;
import android.os.Bundle;
import android.content.ComponentName
import android.content.ServiceConnection
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.mbientlab.metawear.MetaWearBoard
import com.mbientlab.metawear.android.BtleService

class ServiceBinderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ServiceConnection {

    private var metawear: MetaWearBoard? = null
    private lateinit var serviceBinder: BtleService.LocalBinder
    private var bluetoothDevice: BluetoothDevice? = null

    // Connection to the Bluetooth service
    private val bluetoothAdapter: BluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
    private val bluetoothLeScanner = bluetoothAdapter.bluetoothLeScanner
    private var scanning = false
    private val handler = Handler(Looper.getMainLooper())

    private val SCAN_PERIOD: Long = 10000

    private fun scanLeDevice() {
        if (!scanning) {
            handler.postDelayed({
                scanning = false
                bluetoothLeScanner.stopScan(leScanCallback)
            }, SCAN_PERIOD)
            scanning = true
            bluetoothLeScanner.startScan(leScanCallback)
        } else {
            scanning = false
            bluetoothLeScanner.stopScan(leScanCallback)
        }
    }

    private val leScanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            super.onScanResult(callbackType, result)
            bluetoothDevice = result.device
            // Stop scanning once the device is found
            bluetoothLeScanner.stopScan(this)
            scanning = false
        }
    }

    override fun getName(): String {
        return "ServiceBinderModule"
    }

    override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
        serviceBinder = service as BtleService.LocalBinder
        scanLeDevice()
        metawear = serviceBinder.getMetaWearBoard(bluetoothDevice)
    }

    override fun onServiceDisconnected(name: ComponentName?) {
        metawear = null
    }

    @ReactMethod
    fun getServiceBinderStatus(promise: Promise) {
        if (metawear != null) {
            promise.resolve("Service Binder is available")
        } else {
            promise.reject("Service Binder is not available")
        }
    }

    @ReactMethod
    fun getBluetoothDevice(promise: Promise) {
        if (bluetoothDevice != null) {
            promise.resolve(bluetoothDevice!!.address)
        } else {
            promise.reject("Bluetooth Device is not available")
        }
    }

}