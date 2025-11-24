import React from "react";
import {
  TouchableOpacity,
  Text,
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
  const baseButton =
    "flex-row items-center justify-center rounded-xl py-3 px-4";

  const backgroundClass = disabled
    ? "bg-border-muted"
    : type === "primary"
      ? "bg-bg-button"
      : type === "secondary"
        ? "bg-bg-secondary"
        : "bg-red-600";

  const textClass =
    type === "secondary" ? "text-text-primary" : "text-text-surface";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className={`${baseButton} ${backgroundClass}`}
      style={style}
    >
      {IconComponent && <View className="mr-2">{IconComponent}</View>}
      <Text className={`text-lg font-semibold ${textClass}`} style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
