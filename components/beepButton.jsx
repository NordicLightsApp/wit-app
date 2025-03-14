import { useState, useEffect } from "react"
import { Text, Button, View, Vibration } from "react-native"
import Sound from "react-native-sound"
// Enable playback in silence mode
Sound.setCategory('Playback');

export const BeepButtonComponent = () => {
    const [buttonState, SetButtonState] = useState(false)
    const [text, SetText] = useState("Click to beep")
    //SoundPlayer.loadSoundFile("beep","wav");
    var beep = new Sound('beep.wav', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load beep-sound', error);
          return;
        }});
    const playBeep = () => {
        beep.play()
        /*
        try {
            SoundPlayer.play();
        } catch (e){
            console.log(`cannot play beep-sound file`, e);
        }*/
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