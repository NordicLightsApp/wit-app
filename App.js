import { StyleSheet } from "react-native";
import { AngleData } from "./components/angles";
import { BeepButtonComponent } from "./components/beepButton";

export default function App() {
  return (
    <>
      <AngleData />
      <BeepButtonComponent />
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
