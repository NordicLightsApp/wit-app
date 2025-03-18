import { StyleSheet } from "react-native";
import { AngleData } from "./components/angles";
import { BeepButtonComponent } from "./components/beepButton";
import { AngleDataAndCalibration } from "./components/angleDataAndCalibration";

export default function App() {
  return (
    <>
      <AngleDataAndCalibration/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
