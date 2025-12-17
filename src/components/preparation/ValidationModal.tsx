import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { InfoIcon } from "../../assets/icons";

interface ValidationModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  visible,
  message,
  onClose,
}) => (
  <Modal transparent visible={visible} animationType="fade">
    <View className="flex-1 bg-black/50 justify-center items-center">
      <View className="bg-bg-surface w-[300px] p-5 rounded-xl shadow-lg border border-border-secondary items-center">
        <View className="h-12 w-12 rounded-full bg-bg-button/10 items-center justify-center mb-3">
          <InfoIcon width={24} height={24} color="#602AF3" />
        </View>
        <Text className="text-lg font-bold text-text-primary mb-2 text-center">
          Action Required
        </Text>
        <Text className="text-base text-text-secondary text-center mb-5">
          {message}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="bg-bg-button w-full py-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
