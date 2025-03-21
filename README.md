# Getting started
## Prerequisites
Before getting started install:
- Android SDK
- Java Development Kit

Make sure both are in Environment variables

## Running the app
After cloning this repository run  
`npm install`  
in project root directory. You only need to do this once after cloning, not everytime you want to run the app.  
Connect your mobile phone via USB.  
Allow USB-Debugging in your phone's settings.  
Run `npx expo run:android` in terminal.  
It can take some time for the app to build and after it shows that build was successful, the app should automatically open in your phone.  

## Release procedure
open the AndroidManifest.xml file in android/app/src/main and replace the following line:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```
by
```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```
Go to the Android folder and open a terminal there.
Make sure that node is accessible from that terminal.
have an adb phone connected to the PC
if you are on windows then run `gradlew.bat installRelease`
if you are on linux run `chmod +x ./gradlew` and `./gradlew installRelease`
then the app should now be on your phone.
i don't remember yet where the APK is stored
