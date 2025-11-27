import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Checkbox } from "./SharedComponents";
import { formatDate } from "../../utils/dateFormatter";

interface ComplianceSignatureCardProps {
  title: string;
  isCompliant: boolean;
  onToggleCompliance: (value: boolean) => void;
  confirmationText: string;
  signature: string | null;
  signedAt: Date | null;
  onSign: () => void;
}

export const ComplianceSignatureCard: React.FC<
  ComplianceSignatureCardProps
> = ({
  title,
  isCompliant,
  onToggleCompliance,
  confirmationText,
  signature,
  signedAt,
  onSign,
}) => {
  return (
    <View className="flex-1 bg-bg-surface rounded-2xl border border-border-muted p-4">
      <View className="flex-row justify-between items-center mb-4 border-b border-border-muted pb-2.5">
        <Text className="text-base text-text-secondary font-semibold max-w-[80%]">
          {title}
        </Text>
        <Checkbox checked={isCompliant} onChange={onToggleCompliance} />
      </View>

      <View className="flex-row items-center mb-5">
        <Text className="text-base text-text-muted flex-1">
          {confirmationText}
        </Text>
      </View>

      <Text className="text-base text-text-secondary mb-1.5">Signature</Text>
      {signature ? (
        <View>
          <View className="h-[250px] border border-border-muted rounded-xl bg-bg-surface overflow-hidden">
            <Image
              source={{ uri: signature }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
          <Text className="text-right text-text-tertiary text-xs mt-1">
            Signed: {signedAt ? formatDate(String(signedAt)) : ""}
          </Text>
        </View>
      ) : (
        <Pressable
          className={`h-[250px] border-2 border-dashed rounded-xl justify-center items-center ${
            isCompliant
              ? "border-border-secondary bg-bg-tertiary"
              : "border-border-muted bg-bg-surface opacity-50"
          }`}
          onPress={onSign}
          disabled={!isCompliant}
        >
          <Text className="text-text-tertiary">
            {isCompliant
              ? "Click here to sign"
              : "Check compliance box to enable signature"}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
