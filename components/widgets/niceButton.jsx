import { Pressable } from "react-native";
import { colors } from "../../assets/colors";

export const NiceButton = ({ children, onPress }) => (
  <Pressable
    style={{
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 50,
    }}
    onPress={() => onPress()}
  >
    {children}
  </Pressable>
);
