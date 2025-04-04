import { TextInput, Appearance } from "react-native";
import { colors, dark, light } from "../../assets/colors";

export const NumberInput = ({ value, onChange }) => {
  const theme = Appearance.getColorScheme() == "dark" ? dark : light;
  return (
    <TextInput
      style={{
        color: theme.foreground,
        backgroundColor: theme.background,
        padding: 10,
        borderRadius: 5,
        borderBottomWidth: 2,
        borderColor: theme.foreground,
        width: 50,
      }}
      value={value.toString()}
      onChangeText={(text) => onChange(parseInt(text))}
      keyboardType="numeric"
      maxLength={3}
      cursorColor={colors.primary}
      selectionHandleColor={colors.primary}
      selectionColor={colors.primary + "80"}
    />
  );
};
