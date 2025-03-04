import { StyleSheet } from "react-native";
import { AngleData } from "./components/angles";

export default function App() {
  return (
    <>
      <AngleData />
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
