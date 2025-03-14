import { useState, useEffect } from "react"
import { Text, Button, View, Vibration } from "react-native"
import { SoundPlayer } from "react-native-sound-player"

export const BeepButtonComponent = () => {
    const [buttonState, SetButtonState] = useState(false)
    const [text, SetText] = useState("Click to beep")
    const playBeep = () => {
        SoundPlayer.playAsset(require("./beep.wav"))
    }

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