import { useEffect, useState } from "react";
import {
  Button,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  Appearance,
  useColorScheme,
  View,
} from "react-native";

export const AngleView = ({x, y, background="grey", indicator="black"}) => {
	x=(x>180?x-360:x);
	y=(y>180?y-360:y);
	x=(x<-180?x+360:x);
	y=(y<-180?y+360:y);
	const size = 1-Math.sin(Math.sqrt(x*x+y*y)/360*3.14);
	return (
	<View style={{flex: 0, alignItems: "center", justifyContent:"center", width: "180", height: "180", backgroundColor: background, borderRadius:360, overflow:"hidden"}}>
		<View style={{left:x, top: y, width: 25*size, height: 25*size, borderRadius: 25, backgroundColor: indicator}}/>
	</View>
	);
}