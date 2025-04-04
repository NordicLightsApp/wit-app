import { StyleSheet, Text, TextInput, View, Appearance } from "react-native";
import { light, dark } from "../assets/colors";
import { NiceButton } from "../components/widgets/niceButton";
import { NumberInput } from "../components/widgets/numberInput";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = Appearance.getColorScheme() == "dark" ? dark : light;
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);

  if (isNaN(yaw)) {
    setYaw(0);
  }
  if (isNaN(pitch)) {
    setPitch(0);
  }

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
            justifyContent: "space-around",
          }}
        >
          <Text
            style={{
              color: theme.foreground,
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            {"Set Up Angle Values"}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <View
            style={{
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ color: theme.foreground }}>Pitch:</Text>
            <NumberInput value={pitch} onChange={(value) => setPitch(value)} />
          </View>
          <View
            style={{
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ color: theme.foreground }}>Yaw:</Text>
            <NumberInput value={yaw} onChange={(value) => setYaw(value)} />
          </View>
          <NiceButton onPress={() => router.navigate("./ConnectSensor")}>
            <Text>next</Text>
          </NiceButton>
        </View>
      </View>
    </>
  );
}
