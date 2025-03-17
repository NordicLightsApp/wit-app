import { useState, useEffect } from "react"
import { Text, Button, View, Vibration } from "react-native"
import {useAudioPlayer} from "expo-audio"
const beepSources = [
    require("./BeepKeyboardEMajor/beepMiddleE.wav"),
    require("./BeepKeyboardEMajor/beepHighA.wav")]

export const BeepButtonComponent = () => {
    const [calibrating, SetCalibrating] = useState(false)
    const [calibrationStartedOnce, SetCalibrationStartedOnce] = useState(false)
    const [text, SetText] = useState("Start angle setup")
    useEffect(()=>{
        if(!calibrationStartedOnce) return;
        var currentAngleSoundInterval
        var targetAngleSoundInterval;
        if (calibrating){
            console.log("deedee")
            
            currentAngleSoundInterval = setInterval(playCurrentBeep, 1000)
            //setTimeout(() => {targetAngleSoundInterval = setInterval(playTargetBeep), 1000}, 200)
        } else{
            console.log("megadoodoo")
            
        }
    },[calibrating])
    function playCurrentBeep(){
        const beepPlayer = useAudioPlayer(beepSources[1])
        beepPlayer.play()
    }
    function playTargetBeep(){
        const beepPlayer = useAudioPlayer(beepSources[0])
        beepPlayer.play()
    }
    const handleClick = () => {
        SetText((calibrating ? "Start" : "Stop") + " angle setup")
        SetCalibrating(!calibrating)
        SetCalibrationStartedOnce(true)
        Vibration.vibrate([0, 100, 100, 100, 100, 100]);
    }
    return <View>
        <Button onPress = {handleClick} title = {text} />
    </View>
}