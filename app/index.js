import { 
  StyleSheet, Text, TextInput, View, Appearance,
  NativeModules
} from "react-native";
import { useEffect, useState } from "react";
import { light, dark } from "../assets/colors";
import { NiceButton } from "../components/widgets/niceButton";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const { BluetoothModule } = NativeModules;
  const router = useRouter();
  const theme = Appearance.getColorScheme() == "dark" ? dark : light;
  
  const [name, setName] = useState("");
  const [searching, setSearching] = useState(false);
  console.log(name);
  
  var button;
  if (!searching) {
    button=(
        <NiceButton onPress={() =>{BluetoothModule.startDiscoveryR(); setSearching(true);}  }>
            <Text> Detect Sensor </Text>
        </NiceButton>
      )
  }else{
    button=(
      <NiceButton onPress={() =>{BluetoothModule.stopDiscoveryR(); setSearching(false);}  }>
          <Text> Stop Detection </Text>
      </NiceButton>
    )
  }
  
  if (name){
      button=(
        <NiceButton onPress={() =>{router.navigate("./SetupValues")}  }>
            <Text> Continue Setup </Text>
        </NiceButton>
      )
    }
  
  useEffect(() => {
    const timeInterval = setInterval(() => {
      BluetoothModule.getDeviceName().then((data)=>{setName(data)});
    }, 100);
    return () => clearInterval(timeInterval);
  }, []);
  
  useEffect(() => {
    if (name) {
      router.navigate("./SetupValues");
    }
  }, [name]);
  
  return (
    <>
      <View
        style={{
          backgroundColor: theme.background,
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: theme.foreground,
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            {"Welcome to the Nordic Lights app"}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          {button}
        </View>
      </View>
    </>
  );
}
