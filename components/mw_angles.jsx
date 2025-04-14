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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


export const MwAngles = () => {

  const { MetawearModule } = NativeModules;
  const [manufacturer, setManufacturer] = useState("");

  const [x, setX] = useState(0.0);
  const [y, setY] = useState(0.0);
  const [z, setZ] = useState(0.0);

  const [latestX, setLatestX] = useState(0.0);
  const [latestY, setLatestY] = useState(0.0);
  const [latestZ, setLatestZ] = useState(0.0);

  const [status, setStatus] = useState(false);

  const [pitch, setPitch] = useState(0.0);
  const [roll, setRoll] = useState(0.0);
  const [yaw, setYaw] = useState(0.0);


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
    MetawearModule.getInclination();
  }

  const refreshData = () => {

    setX(MetawearModule.getX());
    setY(MetawearModule.getY());
    setZ(MetawearModule.getZ());
  };

  const setDefault = () => {
    setLatestX(x);
    setLatestY(y);
    setLatestZ(z);
  }
  
  const getInclinaison = async () => {
    try {
      const pitchValue = await MetawearModule.getPitch();
      const rollValue = await MetawearModule.getRoll();
      const yawValue = await MetawearModule.getYaw();
  
      console.log("Pitch:", pitchValue, "Roll:", rollValue, "Yaw:", yawValue);
  
      setPitch(pitchValue);
      setRoll(rollValue);
      setYaw(yawValue);
    } catch (error) {
      console.error("Error fetching inclination data:", error);
    }
  };


  useEffect(() => {
    // Set up an interval to fetch data every 500ms
    const interval = setInterval(() => {
      refreshData();
      getInclinaison();
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
        setStatus(true);
      })
      .catch((error) => {
        setStatus(error.message);
        setStatus(false);
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
      Click to start discovering devices{status.toString()}
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
      title="Set Default"
      color={colors.primary}
      onPress={setDefault}  
    />
    <Text style={{ color: colors.foreground }}>
        X: {(x - latestX).toFixed(2)} {/* Format float to 2 decimal places */}
      </Text>
      <Text style={{ color: colors.foreground }}>
        Y: {(y - latestY).toFixed(2)} {/* Format float to 2 decimal places */}
      </Text>
      <Text style={{ color: colors.foreground }}>
        Z: {(z - latestZ).toFixed(2)} {/* Format float to 2 decimal places */}
      </Text>
      <Text style={{ color: colors.foreground }}>
        Pitch : {pitch.toFixed(2)} {"\n"}
        Roll : {roll.toFixed(2)}{"\n"}
        Yaw : {yaw.toFixed(2)}
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















