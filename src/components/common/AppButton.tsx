import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  IconComponent?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  type = "primary",
  disabled = false,
  IconComponent,
  style,
  textStyle,
}) => {
  const backgroundColor =
    type === "primary"
      ? "#6200EE"
      : type === "secondary"
      ? "#f0f0f0"
      : "#D90429";

  const textColor = type === "secondary" ? "#333" : "#fff";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: disabled ? "#ccc" : backgroundColor },
        style,
      ]}
    >
      {IconComponent && <View style={styles.icon}>{IconComponent}</View>}
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
});
