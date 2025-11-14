import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

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
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={dropdownStyles.dropdownOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={dropdownStyles.dropdownContainer}>
          <TouchableOpacity
            style={dropdownStyles.dropdownItem}
            onPress={() => {
              onLogout();
              onClose();
            }}
          >
            <Text style={dropdownStyles.dropdownItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const dropdownStyles = StyleSheet.create({
  dropdownOverlay: {
    flex: 1,
  },
  dropdownContainer: {
    position: "absolute",
    top: 70,
    right: 80,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    minWidth: 150,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
});
