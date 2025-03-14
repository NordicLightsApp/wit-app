import { useState, useEffect } from "react"
import { Text, Button, View, Vibration } from "react-native"
import {useAudioPlayer} from "expo-audio"
const beepSource = require("./BeepKeyboard/beepMiddleE.wav")

export const BeepButtonComponent = () => {
    const [buttonState, SetButtonState] = useState(false)
    const [text, SetText] = useState("Click to beep")
    const beepPlayer = useAudioPlayer(beepSource)
    

    const playBeep = () => {
        beepPlayer.loop = true
        beepPlayer.play()
    };

    /*useEffect(() => {

    },[buttonState])*/
    const handleClick = () => {
        SetText(buttonState ? "BEEP BEEP BEEP" : "Click to beep")
        SetButtonState(!buttonState)
        Vibration.vibrate([300, 200, 300, 200, 300, 200]);
    }
    return <View>
        <Button onPress = {playBeep} title = {text} />
    </View>
}