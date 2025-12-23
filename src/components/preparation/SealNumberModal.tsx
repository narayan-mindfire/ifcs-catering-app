import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SealNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sealNumber: number) => void;
  title?: string;
}

export const SealNumberModal: React.FC<SealNumberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title = "Enter Seal Tag Number",
}) => {
  const [sealNumber, setSealNumber] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const num = parseInt(sealNumber, 10);
    if (!sealNumber.trim()) {
      setError("Seal number is required");
      return;
    }
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid seal number");
      return;
    }
    onSave(num);
    setSealNumber("");
    setError("");
  };

  const handleClose = () => {
    setSealNumber("");
    setError("");
    onClose();
  };

  return (
    <Modal transparent visible={isOpen} animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-black/50 justify-center items-center"
      >
        <View className="bg-bg-surface w-[350px] p-6 rounded-xl shadow-lg border border-border-secondary">
          <Text className="text-xl font-bold text-text-primary mb-4 text-center">
            {title}
          </Text>

          <TextInput
            className="bg-bg-tertiary border border-border-muted rounded-lg px-4 py-3 text-text-primary text-base mb-2"
            placeholder="Enter seal tag number"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={sealNumber}
            onChangeText={(text) => {
              setSealNumber(text);
              setError("");
            }}
            autoFocus
          />

          {error ? (
            <Text className="text-red-500 text-sm mb-3">{error}</Text>
          ) : null}

          <View className="flex-row gap-3 mt-2">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-bg-tertiary py-3 rounded-lg border border-border-muted"
            >
              <Text className="text-text-primary font-semibold text-center">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 bg-bg-button py-3 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
