import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface UserDropdownProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  visible,
  onClose,
  onLogout,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1"
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View
          className="
            absolute top-[70px] right-[80px]
            bg-bg-surface rounded-lg p-2
            shadow-lg min-w-[150px]
          "
        >
          <TouchableOpacity
            className="py-2.5 px-4"
            onPress={() => {
              onLogout();
              onClose();
            }}
          >
            <Text className="text-base text-text-primary">Logout</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
