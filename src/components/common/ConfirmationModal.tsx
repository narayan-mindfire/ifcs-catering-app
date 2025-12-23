import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  actionType: "disable" | "enable";
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  actionType,
}) => {
  return (
    <Modal transparent visible={isOpen} animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-bg-surface w-[350px] p-6 rounded-xl shadow-lg border border-border-secondary">
          <Text className="text-xl font-bold text-text-primary mb-3 text-center">
            {title}
          </Text>

          <Text className="text-base text-text-secondary text-center mb-6">
            {message}
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-bg-tertiary py-3 rounded-lg border border-border-muted"
            >
              <Text className="text-text-primary font-semibold text-center">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className={`flex-1 py-3 rounded-lg ${
                actionType === "disable" ? "bg-red-500" : "bg-bg-button"
              }`}
            >
              <Text className="text-white font-semibold text-center">
                {actionType === "disable" ? "Disable" : "Confirm"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
