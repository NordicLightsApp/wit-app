import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export const SetGoal = ({ x, z }) => {
  const [xAngle, setXAngle] = useState("");
  const [zAngle, setZAngle] = useState("");
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    // Compares the actual rounded angle to the goal angle
    const checkCorrect = () => {
      if (x && z) {
        if (+xAngle === Math.round(x) && +zAngle === Math.round(z)) {
          setCorrect(true);
        } else {
          setCorrect(false);
        }
      }
    };
    checkCorrect();
  }, [x, z]);

  return (
    <>
      <View style={styles.maincontainer}>
        <View style={styles.rowElements}>
          <Text style={styles.uiElements}>x-angle</Text>
          <TextInput
            style={{
              backgroundColor: "white",
              height: 40,
              width: 40,
              margin: 5,
            }}
            onChangeText={(value) => setXAngle(value)}
          />
        </View>
        <View style={styles.rowElements}>
          <Text style={styles.uiElements}>z-angle</Text>
          <TextInput
            style={{
              backgroundColor: "white",
              height: 40,
              width: 40,
              margin: 5,
            }}
            onChangeText={(value) => setZAngle(value)}
          />
        </View>
        {correct && <Text style={{ color: "yellow" }}>Correct!</Text>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flexDirection: "column",
  },
  rowElements: {
    flexDirection: "row",
  },
  uiElements: {
    marginVertical: 5,
    marginHorizontal: 10,
    color: "green",
  },
});
