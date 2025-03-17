import { useState, useEffect } from "react"
import { Text, Button, View, Vibration } from "react-native"
import {useAudioPlayer, AudioPlayer, createAudioPlayer} from "expo-audio"
const beepSources = [
    require("./BeepKeyboardEMajor/beepMiddleE.wav"),
    require("./BeepKeyboardEMajor/beepHighA.wav")]

export const BeepButtonComponent = () => {
    const [calibrating, SetCalibrating] = useState(false)
    const [calibrationStartedOnce, SetCalibrationStartedOnce] = useState(false)

    const [text, SetText] = useState("Start angle setup")
    const [targetAngle, SetTargetAngle] = useState(45)

    const beepCurrentPlayer1 = useAudioPlayer(beepSources[1])
    const beepCurrentPlayer2 = createAudioPlayer(beepSources[1])
    const beepTargetPlayer1 = useAudioPlayer(beepSources[0])
    const beepTargetPlayer2 = createAudioPlayer(beepSources[0])
    const [soundPlayerSwitched, SetSoundPlayerSwitched] = useState(false)

    
    useEffect(()=>{
        if(!calibrationStartedOnce) return;
        var soundInterval
        if (calibrating){
            soundInterval = setInterval(playCurrentBeep, 1100)
        } else{
            clearInterval(soundInterval)
        }
        return () => {
            clearInterval(soundInterval)
        }
    },[calibrating])

    function setCurrentNote(noteNum){
        beepCurrentPlayer.replace(beepSources[noteNum])
    }
    const audioRestart = (player) => {
        player.pause()
        player.seekTo(0)
        player.play()
    }

    function playCurrentBeep(){
        console.log("current")
        const player = soundPlayerSwitched ? beepCurrentPlayer2 : beepCurrentPlayer1
        audioRestart(player)
        Vibration.vibrate(80)
        setTimeout(playTargetBeep, 120)
    }
    
    function playTargetBeep(){
        console.log("target")
        const player = soundPlayerSwitched ? beepTargetPlayer2 : beepTargetPlayer1
        audioRestart(player)
        SetSoundPlayerSwitched(!soundPlayerSwitched)
        Vibration.vibrate(80)
    }
    const handleClick = () => {
        SetText((calibrating ? "Start" : "Stop") + " angle setup")
        SetCalibrating(!calibrating)
        SetCalibrationStartedOnce(true)
        Vibration.vibrate([0, 100, 100, 100, 100, 100]);
    }
    return <View>
        <Text>Target angle: {targetAngle} </Text>
        <Button onPress = {handleClick} title = {text} />
    </View>
}