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

interface LockNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lockNumber: number) => void;
  title?: string;
}

export const LockNumberModal: React.FC<LockNumberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title = "Enter Lock Tag Number",
}) => {
  const [lockNumber, setLockNumber] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const num = parseInt(lockNumber, 10);
    if (!lockNumber.trim()) {
      setError("Lock number is required");
      return;
    }
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid lock number");
      return;
    }
    onSave(num);
    setLockNumber("");
    setError("");
  };

  const handleClose = () => {
    setLockNumber("");
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
            placeholder="Enter lock tag number"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={lockNumber}
            onChangeText={(text) => {
              setLockNumber(text);
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
