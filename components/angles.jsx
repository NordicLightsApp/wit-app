import { useEffect, useState } from "react";
import {
  Button,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  Appearance,
  useColorScheme,
  View,
} from "react-native";

export const AngleData = () => {
  const { BluetoothModule } = NativeModules;
  const [deviceName, setDeviceName] = useState("");
  const [angleX, setAngleX] = useState(0);
  const [angleY, setAngleY] = useState(0);
  const [angleZ, setAngleZ] = useState(0);
  const [zeroedX, setZeroedX] = useState(0);
  const [zeroedY, setZeroedY] = useState(0);
  const [zeroedZ, setZeroedZ] = useState(0);
  const [valueX, setValueX] = useState(0);
  const [valueY, setValueY] = useState(0);
  const [valueZ, setValueZ] = useState(0);
  const [searching, setSearching] = useState(false);
  var colors = {
  	"background": "#FFF",
  	"foreground": "#000",
  	"primary": "#FF8200",
  	"gray": "#D9D9D6",
  	"secondary": "#32C8BE",
  	"complementary": "#A9D52D"
  };

  const changeTheme = (preferences) => {
  console.log(preferences.colorScheme);
  console.log(typeof(preferences.colorScheme));
  	switch (preferences.colorScheme) {
  		case 'dark':
  			colors.background = "#000";
  			colors.foreground = "#FFF";
  		break;
  		case 'light':
  		default:
  			colors.background = "#FFF";
  			colors.foreground = "#000";
  		break;
  	}
  };
    //switch between light and dark mode
  Appearance.addChangeListener(changeTheme);

	changeTheme({"colorScheme": Appearance.getColorScheme()});

  useEffect(() => {
    const timeInterval = setInterval(() => {
      refreshData();
    }, 100);

    // Remove interval when component unmounts
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    updateAngles();
  }, [angleX]);

  useEffect(() => {
    if (deviceName) {
      setSearching(false);
    }
  }, [deviceName]);

  const startSearch = () => {
    setSearching(true);
    BluetoothModule.startDiscoveryR();
  };

  const refreshData = async () => {
    if (deviceName === "") {
      const device = await getName();
      setDeviceName(device);
    }

    const x = await BluetoothModule.getAngleX();
    const y = await BluetoothModule.getAngleY();
    const z = await BluetoothModule.getAngleZ();

    setAngleX(x);
    setAngleY(y);
    setAngleZ(z);
  };

  const getName = async () => {
    const name = await BluetoothModule.getDeviceName();
    return name;
  };

  const zeroAngles = () => {
    setValueX(+angleX.replace(",", "."));
    setValueY(+angleY.replace(",", "."));
    setValueZ(+angleZ.replace(",", "."));
    setZeroedX(0);
    setZeroedY(0);
    setZeroedZ(0);
  };

  const updateAngles = () => {
    if (angleX && angleY && angleZ) {
      let x = Number(angleX.replace(",", "."));
      let calculatedX = x - valueX;
      setZeroedX(calculatedX.toFixed(2));
      let y = Number(angleY.replace(",", "."));
      let calculatedY = y - valueY;
      setZeroedY(calculatedY.toFixed(2));
      let z = Number(angleZ.replace(",", "."));
      let calculatedZ = z - valueZ;
      setZeroedZ(calculatedZ.toFixed(2));
    }
  };

  return (
    <View style={[styles.container,{backgroundColor: colors.background}]}>
      <Text style={{color: colors.foreground}}>Click to start discovering devices</Text>
      <Button
      	color={colors.primary}
        disabled={deviceName !== "" || searching}
        title="Start search"
        onPress={startSearch}
      />
      {searching && <Text style={{color: colors.foreground}}>Searching...</Text>}
      <Text style={{color: colors.foreground}}>{deviceName}</Text>
      <Text style={{color: colors.foreground}}>Angle X: {angleX}</Text>
      <Text style={{color: colors.foreground}}>Angle Y: {angleY}</Text>
      <Text style={{color: colors.foreground}}>Angle Z: {angleZ}</Text>
      <Text style={[styles.angleText,{color: colors.foreground}]}>Zeroed X: {zeroedX} </Text>
      <Text style={[styles.angleText,{color: colors.foreground}]}>Zeroed Y: {zeroedY} </Text>
      <Text style={[styles.angleText,{color: colors.foreground}]}>Zeroed Z: {zeroedZ} </Text>
      <Pressable
        style={{
          backgroundColor: colors.primary,
          padding: 12,
          borderRadius: 50,
        }}
        onPress={zeroAngles}
      >
        <Text>Zero angles</Text>
      </Pressable>
    </View>
  )
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