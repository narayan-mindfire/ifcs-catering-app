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

import { ImageIcon } from "@/assets/icons";
import { AppButton } from "@/components/common/AppButton";

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

  // Image Preview State
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const handleAddImage = () => {
    Alert.alert("Upload Image", "Choose an option", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
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
      allowsMultipleSelection: true,
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
                  Mark <Text className="color-bg-button">{itemName}</Text> as
                  Failed
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
                          ? "bg-bg-accent border-bg-button"
                          : "bg-bg-tertiary border-border-secondary"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          selectedReason === reason
                            ? "text-bg-button"
                            : "text-gray-600"
                        }`}
                      >
                        {reason}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

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

                {/* Image List (Scrollable) */}
                {images.length > 0 && (
                  <View className="mb-4">
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={true} // Enabled scrollbar for better UX
                      className="flex-row"
                      contentContainerStyle={{ paddingBottom: 8 }}
                    >
                      {images.map((uri, index) => (
                        <View key={index} className="relative mr-3 mt-3">
                          <TouchableOpacity
                            onPress={() => setPreviewUri(uri)}
                            activeOpacity={0.8}
                          >
                            <Image
                              source={{ uri }}
                              className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200"
                              resizeMode="cover"
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center border border-white z-10"
                            hitSlop={{
                              top: 10,
                              bottom: 10,
                              left: 10,
                              right: 10,
                            }}
                          >
                            <Text className="text-white text-xs font-bold">
                              ✕
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
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
                <View className="flex-1">
                  <AppButton
                    title="Cancel"
                    onPress={handleClose}
                    type="secondary"
                    style={{ borderRadius: 8 }}
                    textStyle={{ fontSize: 18 }}
                  />
                </View>
                <View className="flex-1">
                  <AppButton
                    title="Confirm Fail"
                    onPress={handleConfirm}
                    type="danger"
                    disabled={!selectedReason}
                    style={{ borderRadius: 8 }}
                    textStyle={{ fontSize: 18 }}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Internal Image Preview Modal */}
      {previewUri && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewUri(null)}
        >
          <View className="flex-1 bg-black/90 justify-center items-center z-50">
            <TouchableOpacity
              onPress={() => setPreviewUri(null)}
              className="absolute top-12 right-6 p-2 z-10 bg-black/50 rounded-full"
            >
              <Text className="text-white text-2xl font-bold">✕</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: previewUri }}
              className="w-full h-4/5"
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </Modal>
  );
};
