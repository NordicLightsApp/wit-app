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
  const [manufacturer, setManufacturer] = useState("");

  const [x, setX] = useState(0.0);
  const [y, setY] = useState(0.0);
  const [z, setZ] = useState(0.0);


  var colors = {
    background: "#FFF",
    foreground: "#000",
    primary: "#FF8200",
    gray: "#D9D9D6",
    secondary: "#32C8BE",
    complementary: "#A9D52D",
  }

  const getBoardName = async () => {
    const result = await MetawearModule.getManufacturer();
    setManufacturer(result);
  }

  const refreshAccelerometer = async () => {
    MetawearModule.refreshAxis();
  }

  const refreshData = () => {
    const latestX = MetawearModule.getX();
    const latestY = MetawearModule.getY();
    const latestZ = MetawearModule.getZ();

    setX(latestX);
    setY(latestY);
    setZ(latestZ);
  };

  useEffect(() => {
    // Set up an interval to fetch data every 500ms
    const interval = setInterval(() => {
      refreshData();
    }, 500);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);


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

  const reconnectToDevice = async () => {
    const message = await MetawearModule.connectAsync()
      .then((message) => {
        setStatus(message);
      })
      .catch((error) => {
        setStatus(error.message);
      });
  };

Appearance.addChangeListener(changeTheme);

useEffect(() => {
  changeTheme({ colorScheme: Appearance.getColorScheme() });
}, []);


  return (

  <View style={[styles.container, { backgroundColor: colors.background }]}>
    <Button 
      title="Connect to device"
      color={colors.primary}
      onPress={reconnectToDevice}  
    />
    
    <Text style={{ color: colors.foreground }}>
      Click to start discovering devices
    </Text>
    <Button
      title = "Fetch Board Name"
      color={colors.primary}
      onPress={getBoardName}  

  />
    <Text style={{ color: colors.foreground }}>
      {manufacturer}
    </Text>
    <Button 
      title="Start Accelerometer"
      color={colors.primary}
      onPress={refreshAccelerometer}  
    />
    <Button 
      title="Refresh data"
      color={colors.primary}
      onPress={refreshData}  
    />
    <Text style={{ color: colors.foreground }}>
        X: {x.toFixed(2)} {/* Format float to 2 decimal places */}
      </Text>
      <Text style={{ color: colors.foreground }}>
        Y: {y.toFixed(2)} {/* Format float to 2 decimal places */}
      </Text>
      <Text style={{ color: colors.foreground }}>
        Z: {z.toFixed(2)} {/* Format float to 2 decimal places */}
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















