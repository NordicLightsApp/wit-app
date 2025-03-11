import { useState } from "react"
import { Text, Button, View, Vibration } from "react-native"

export const BeepButtonComponent = () => {
    const [buttonState, SetButtonState] = useState(false)
    const [text, SetText] = useState("Click to beep")
    const handleClick = () => {
        SetText(buttonState ? "BEEP BEEP BEEP" : "Click to beep")
        SetButtonState(!buttonState)
        Vibration.vibrate([300, 200, 300, 200, 300, 200]);
    }
    return <View>
        <Button onPress = {handleClick} title = {text} />
    </View>
}