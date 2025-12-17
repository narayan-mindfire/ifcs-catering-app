import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "danger" | "tertiary";
  disabled?: boolean;
  IconComponent?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  type = "primary",
  disabled = false,
  IconComponent,
  style,
  textStyle,
  loading,
}) => {
  const baseButton =
    "flex-row items-center justify-center rounded-xl py-3 px-4";

  const backgroundClass = disabled
    ? "bg-border-muted"
    : type === "primary"
      ? "bg-bg-button"
      : type === "secondary"
        ? "bg-bg-secondary"
        : type === "tertiary"
          ? "bg-bg-tertiary"
          : "bg-red-600";

  const textClass =
    type === "secondary" ? "text-text-primary" : "text-text-surface";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={`${baseButton} ${backgroundClass}`}
      style={style}
    >
      {loading ? (
        <ActivityIndicator
          color={type === "secondary" ? "#000" : "#fff"}
          size="small"
        />
      ) : (
        <>
          {IconComponent && <View className="mr-2">{IconComponent}</View>}
          <Text
            className={`text-lg font-semibold ${textClass}`}
            style={textStyle}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
