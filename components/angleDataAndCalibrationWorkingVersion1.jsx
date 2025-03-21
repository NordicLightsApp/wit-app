import { useEffect, useState } from "react";
import {
  Button,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  View,
  Vibration
} from "react-native";
import {useAudioPlayer, createAudioPlayer} from "expo-audio"
const keyboardPath = "./BeepKeyboardEMajor/"
const beepSources = [
    require(keyboardPath+"beepMiddleE.wav"),
    
    require(keyboardPath+"beepLowE.wav"),
    require(keyboardPath+"beepLowFs.wav"),
    require(keyboardPath+"beepLowGs.wav"),
    require(keyboardPath+"beepLowA.wav"),
    require(keyboardPath+"beepLowB.wav"),
    require(keyboardPath+"beepLowCs.wav"),
    require(keyboardPath+"beepLowDs.wav"),

    require(keyboardPath+"beepHighFs.wav"),
    require(keyboardPath+"beepHighGs.wav"),
    require(keyboardPath+"beepHighA.wav"),
    require(keyboardPath+"beepHighB.wav"),
    require(keyboardPath+"beepHighCs.wav"),
    require(keyboardPath+"beepHighDs.wav"),
    require(keyboardPath+"beepHighE.wav"),
]
let currentNoteIndex = 1
let soundPlayerSwitched = false
let noteTestZ = 0

export const AngleDataAndCalibration = () => {
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
  

  useEffect(() => {
    console.log("refreshDataIntervalEffect")
    const timeInterval = setInterval(() => {
      refreshData();
      
    }, 100);

    // Remove interval when component unmounts
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    console.log("updateAnglesEffect")
    updateAngles();
  }, [angleX]);

  useEffect(() => {
    console.log("deviceNameEffect")
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

    
    updateAngleAndNote(); //Temp sound test
    
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

  //
  //ANGLE CALIBRATION
  //

  const [calibrating, SetCalibrating] = useState(false)
  const [calibrationStartedOnce, SetCalibrationStartedOnce] = useState(false)

  const [calibrationButtonTitle, SetText] = useState("Start angle setup")
  const [targetZAngle, SetTargetAngle] = useState(45) //Currently hard-coded target angle
  
  const beepCurrentPlayer1 = useAudioPlayer(beepSources[1])
  const beepCurrentPlayer2 = useAudioPlayer(beepSources[1])
  const beepTargetPlayer1 = useAudioPlayer(beepSources[0])
  const beepTargetPlayer2 = useAudioPlayer(beepSources[0])

  

  useEffect(()=>{
      console.log("calibratingEffect")
      if(!calibrationStartedOnce) return;
      let soundInterval
      if (calibrating){
          soundInterval = setInterval(playCurrentBeep, 1100)
      } else{
          clearInterval(soundInterval)
      }
      return () => {
          clearInterval(soundInterval)
      }
  },[calibrating])

  const aDiv = 180/8
  function angleToNoteIndex(angle){
    let angleDiff = targetZAngle - angle
    let signedNoteNum = Math.floor(angleDiff/aDiv)
    let _noteIndex = signedNoteNum >= 0 ? signedNoteNum + 1 : 15 + signedNoteNum
    return _noteIndex
  }

  const audioRestart = (player) => {
      player.pause()
      player.seekTo(0)
      player.play()
  }

  function playCurrentBeep(){
      soundPlayerSwitched = !soundPlayerSwitched
      let nextPlayer = soundPlayerSwitched ? beepCurrentPlayer1 : beepCurrentPlayer2
      nextPlayer.pause()
      console.log(currentNoteIndex)
      nextPlayer.replace(beepSources[currentNoteIndex])
      nextPlayer.seekTo(0)
      let player = soundPlayerSwitched ? beepCurrentPlayer2 : beepCurrentPlayer1
      audioRestart(player)
      setTimeout(playTargetBeep, 200)
  }
  
  function playTargetBeep(){
      let player = soundPlayerSwitched ? beepTargetPlayer2 : beepTargetPlayer1
      audioRestart(player)

  }
  function updateAngleAndNote(){
    let newZ = (noteTestZ+1)%360

    noteTestZ = newZ;
    
    let newCurrentNoteIndex = angleToNoteIndex(noteTestZ)
    if (newCurrentNoteIndex != currentNoteIndex){
      let nextPlayer = soundPlayerSwitched ? beepCurrentPlayer1 : beepCurrentPlayer2
      currentNoteIndex = newCurrentNoteIndex
      console.log("Note index switched: "+currentNoteIndex)
      nextPlayer.pause()
      nextPlayer.replace(beepSources[currentNoteIndex])
      nextPlayer.seekTo(0)
    }
  }
  const OnPressCalibrationButton = () => {
      SetText((calibrating ? "Start" : "Stop") + " angle setup")
      SetCalibrating(c => !c)
      SetCalibrationStartedOnce(true)
      Vibration.vibrate([0, 100, 100, 100, 100, 100]);
  }

  return (
    <View style={styles.container}>
      <Text>Click to start discovering devices</Text>
      <Button
        disabled={deviceName !== "" || searching}
        title="Start search"
        onPress={startSearch}
      />
      {searching && <Text>Searching...</Text>}
      <Text>{deviceName}</Text>
      <Text>Angle X: {angleX}</Text>
      <Text>Angle Y: {angleY}</Text>
      <Text>Angle Z: {angleZ}</Text>
      <Text style={styles.angleText}>Zeroed X: {zeroedX} </Text>
      <Text style={styles.angleText}>Zeroed Y: {zeroedY} </Text>
      <Text style={styles.angleText}>Zeroed Z: {zeroedZ} </Text>
      <Pressable
        style={{
          backgroundColor: "lightblue",
          padding: 5,
        }}
        onPress={zeroAngles}
      >
        <Text>Zero angles</Text>
      </Pressable>
      <Text>Target Z angle: {targetZAngle} </Text>
      <Text>Note test Z: {noteTestZ} </Text>
      <Button onPress = {OnPressCalibrationButton} title = {calibrationButtonTitle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  angleText: {
    fontSize: 25,
  },
});
