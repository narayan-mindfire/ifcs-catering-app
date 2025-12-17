import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  ImageIcon,
  //   ChevronLeftIcon,
  //   ChevronRightIcon,
} from "../../assets/icons";

interface FailReasonModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (data: { reason: string; remarks: string }) => void;
  itemName: string;
}

const REASONS = [
  "Incorrect Item",
  "Incorrect Count",
  "Leaking Item",
  "Wrong Label",
  "Broken Item",
];

export const FailReasonModal: React.FC<FailReasonModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  itemName,
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm({ reason: selectedReason, remarks });
      // Reset state after confirm
      setSelectedReason(null);
      setRemarks("");
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-xl">
              {/* Header */}
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-lg font-semibold text-gray-800">
                  Mark {itemName} as Failed
                </Text>
              </View>

              <View className="p-6">
                {/* Reason Section */}
                <Text className="text-base font-bold text-gray-800 mb-3">
                  Reason
                </Text>
                <View className="flex-row flex-wrap gap-3 mb-6">
                  {REASONS.map((reason) => (
                    <TouchableOpacity
                      key={reason}
                      onPress={() => setSelectedReason(reason)}
                      className={`px-4 py-2 rounded-lg border ${
                        selectedReason === reason
                          ? "bg-bg-accent border-bg-button"
                          : "bg-gray-100 border-border-secondary"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          selectedReason === reason
                            ? "text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {reason}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Remarks Section */}
                <Text className="text-base font-bold text-gray-800 mb-3">
                  Remarks
                </Text>
                <View className="border border-gray-200 rounded-lg mb-6 bg-white">
                  <TextInput
                    multiline
                    numberOfLines={4}
                    placeholder="Enter Remarks"
                    placeholderTextColor="#9ca3af"
                    value={remarks}
                    onChangeText={setRemarks}
                    className="p-3 text-gray-700 h-24 text-top"
                    style={{ textAlignVertical: "top" }}
                  />
                </View>

                {/* Upload Images Section */}
                <Text className="text-base font-bold text-gray-800 mb-3">
                  Upload Images
                </Text>
                <TouchableOpacity className="bg-gray-100 rounded-lg py-3 flex-row items-center justify-center mb-4 border border-gray-200 border-dashed">
                  <ImageIcon width={20} height={20} color="#6b7280" />
                  <Text className="ml-2 text-gray-700 font-medium">
                    Add Pictures
                  </Text>
                </TouchableOpacity>

                {/* Image Carousel Placeholder */}
                <View className="flex-row items-center justify-between border border-gray-200 rounded-lg h-24 px-2 mb-2">
                  <TouchableOpacity className="p-2">
                    {/* <ChevronLeftIcon width={24} height={24} color="#d1d5db" /> */}
                  </TouchableOpacity>
                  <Text className="text-gray-400 text-sm">
                    No images selected
                  </Text>
                  <TouchableOpacity className="p-2">
                    {/* <ChevronRightIcon width={24} height={24} color="#d1d5db" /> */}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Footer Actions */}
              <View className="flex-row gap-4 p-6 pt-2 border-t border-gray-50">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 py-3 rounded-lg border border-gray-200 items-center justify-center bg-white"
                >
                  <Text className="text-gray-700 font-medium text-lg">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  disabled={!selectedReason}
                  className={`flex-1 py-3 rounded-lg items-center justify-center ${
                    selectedReason ? "bg-bg-button" : "bg-gray-300"
                  }`}
                >
                  <Text className="text-white font-medium text-lg">
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
