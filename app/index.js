import { StyleSheet, Text, TextInput, View, Appearance } from "react-native";
import { light, dark } from "../assets/colors";
import { NiceButton } from "../components/widgets/niceButton";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = Appearance.getColorScheme() == "dark" ? dark : light;

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
            {"hello there!"}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <NiceButton onPress={() => router.navigate("./App")}>
            <Text>Click me!</Text>
          </NiceButton>
        </View>
      </View>
    </>
  );
}
