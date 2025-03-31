import { React, useEffect, useState} from 'react';
import {
    Appearance,
    Button,
    NativeModules,
    Pressable,
    StyleSheet,
    Text,
    View,
  } from "react-native";


export const MwAngles = () => {

  const { MetawearModule } = NativeModules;


  // Var for the sensor
  var bluethoothDevice = null;
  var metawearBoard = null;
  var serviceBinder = null;


  const [accelerometer, setaccelerometer] = useState(false);

  var colors = {
    background: "#FFF",
    foreground: "#000",
    primary: "#FF8200",
    gray: "#D9D9D6",
    secondary: "#32C8BE",
    complementary: "#A9D52D",
  }

  const toggleAccelerometer = () => {
    if (accelerometer == false) {
      MetawearModule.startAccelerometer();
      setaccelerometer(true);
    } else {
      MetawearModule.stopAccelerometer();
      setaccelerometer(false);
    }
  }

  const getBoardName = () => {
    return MetawearModule.getManufacturer();
  }

  const changeTheme = (preferences) => {
    switch (preferences.colorScheme){
      case "dark":
        colors.background = "#000";
        colors.foreground = "#FFF";
        break;
      case "light":
      default:
          colors.background = "#FFF";
          colors.foreground = "#000";
          break;
    }
  };

Appearance.addChangeListener(changeTheme);

changeTheme({colorScheme: Appearance.getColorScheme()});


  return (

  <View style={[styles.container, { backgroundColor: colors.background }]}>
    <Text style={{ color: colors.foreground }}>
      Click to start discovering devices
    </Text>
    <Text style={{ color: colors.foreground }}>
      {getBoardName()}
    </Text> 
    <Button
        color={colors.primary}
        title="Start search"
        onPress={toggleAccelerometer}
      />
      <Text style={{ color: colors.foreground }}>
      {accelerometer==true ? "Accelerometer started" : "Accelerometer stopped"}
    </Text>
  </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  angleText: {
    fontSize: 25,
  },
});















