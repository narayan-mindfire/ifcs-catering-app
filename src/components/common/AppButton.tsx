import React from "react";
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "danger" | "tertiary" | "accent";
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
    "flex-row items-center justify-center rounded-xl py-3 px-4 border";

  const backgroundClass = disabled
    ? "bg-border-muted border-border-muted"
    : type === "primary"
      ? "bg-bg-button border-bg-button"
      : type === "secondary"
        ? "bg-bg-secondary border-bg-secondary"
        : type === "tertiary"
          ? "bg-bg-tertiary border-bg-tertiary"
          : type === "accent"
            ? "bg-bg-accent border-bg-button"
            : "bg-red-600 border-red-600";

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
