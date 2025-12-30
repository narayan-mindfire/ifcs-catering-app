import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { ImageIcon } from "../../assets/icons";

interface FailReasonModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (data: {
    reason: string;
    remarks: string;
    images: string[];
  }) => void;
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
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = () => {
    Alert.alert("Upload Image", "Choose an option", [
      {
        text: "Camera",
        onPress: pickFromCamera,
      },
      {
        text: "Gallery",
        onPress: pickFromGallery,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const pickFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.7,
      allowsMultipleSelection: true, // Allow multiple items from gallery
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newUris]);
    }
  };

  const pickFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm({ reason: selectedReason, remarks, images });
      // Reset state
      setSelectedReason(null);
      setRemarks("");
      setImages([]);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    setRemarks("");
    setImages([]);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90%]">
              {/* Header */}
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-lg font-semibold text-gray-800">
                  Mark {itemName} as Failed
                </Text>
              </View>

              <ScrollView className="p-6">
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
                          ? "bg-red-50 border-red-500"
                          : "bg-gray-100 border-gray-200"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          selectedReason === reason
                            ? "text-red-700"
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
                    placeholder="Enter Remarks (Optional)"
                    placeholderTextColor="#9ca3af"
                    value={remarks}
                    onChangeText={setRemarks}
                    className="p-3 text-gray-700 h-24 text-top"
                    style={{ textAlignVertical: "top" }}
                  />
                </View>

                {/* Upload Images Section */}
                <Text className="text-base font-bold text-gray-800 mb-3">
                  Evidence Photos
                </Text>

                {/* Image List */}
                {images.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-4 flex-row gap-3"
                  >
                    {images.map((uri, index) => (
                      <View key={index} className="relative mr-3">
                        <Image
                          source={{ uri }}
                          className="w-20 h-20 rounded-lg bg-gray-100"
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center border border-white"
                        >
                          <Text className="text-white text-xs font-bold">
                            ✕
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}

                <TouchableOpacity
                  onPress={handleAddImage}
                  className="bg-gray-50 rounded-lg py-4 flex-row items-center justify-center border border-gray-300 border-dashed"
                >
                  <ImageIcon width={24} height={24} color="#6b7280" />
                  <Text className="ml-2 text-gray-700 font-medium">
                    {images.length > 0
                      ? "Add More Pictures"
                      : "Take Photo or Upload"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Footer Actions */}
              <View className="flex-row gap-4 p-6 pt-2 border-t border-gray-50 bg-white">
                <TouchableOpacity
                  onPress={handleClose}
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
                    selectedReason ? "bg-red-600" : "bg-gray-300"
                  }`}
                >
                  <Text className="text-white font-medium text-lg">
                    Confirm Fail
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
