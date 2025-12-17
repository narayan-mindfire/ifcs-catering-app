import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { PackingStandardItem } from "../../types/preparations";
import { ImageIcon } from "../../assets/icons";
import { useConsumptionTrackingStore } from "../../store/useConsumptionStore";

interface ConsumptionModalProps {
  visible: boolean;
  onClose: () => void;
  item: PackingStandardItem | null;
  flightId: string;
  preparationId: string;
  packingStandardId?: string;
  packingStandardItemId?: string;
  locationInfo: {
    galley: string;
    stowage: string;
    carrier: string;
  };
  presentationStyle?: "modal" | "overlay";
}

export const ConsumptionModal: React.FC<ConsumptionModalProps> = ({
  visible,
  onClose,
  item,
  flightId,
  preparationId,
  packingStandardId,
  packingStandardItemId,
  locationInfo,
  presentationStyle = "modal",
}) => {
  const [remainingInput, setRemainingInput] = useState<string>("");
  const { createConsumptionRecord, isCreating } = useConsumptionTrackingStore();

  useEffect(() => {
    if (visible) {
      setRemainingInput("");
    }
  }, [visible, item]);

  if (!item) return null;
  if (presentationStyle === "overlay" && !visible) return null;

  const totalQty = item.quantity || 0;
  const remainingQty = Math.min(parseInt(remainingInput) || 0, totalQty);
  const refillQty = Math.max(0, totalQty - remainingQty);
  const consumedQty = totalQty - remainingQty;

  const handleSave = async () => {
    if (!flightId || remainingInput === "") {
      Alert.alert("Error", "Please enter a valid remaining quantity");
      return;
    }

    try {
      const result = await createConsumptionRecord(flightId, {
        flightPreparationId: preparationId,
        flightPrepPackingStandardId: packingStandardId,
        flightPrepPackingStandardItemId: packingStandardItemId || item.id,
        qty: totalQty,
        consumedQty: consumedQty,
        addQty: 0,
        returnedQty: remainingQty,
      });

      if (result.success) {
        Alert.alert(
          "Success",
          `Consumption tracked successfully!\nConsumed: ${consumedQty}\nRemaining: ${remainingQty}\nTo Refill: ${refillQty}`,
        );
        onClose();
      } else {
        Alert.alert(
          "Error",
          "Failed to save consumption data. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error saving consumption:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const Content = (
    <View className="w-[600px] bg-white rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <View className="p-4 pb-2">
        <Text className="text-lg font-bold text-gray-900 uppercase">
          {item.name || "Item Details"}
        </Text>
      </View>

      {/* Image + Location */}
      <View className="flex-row px-4 pb-4 gap-4">
        <View className="w-36 h-24 bg-gray-100 rounded-lg border border-gray-200 items-center justify-center overflow-hidden">
          {item.picture ? (
            <Image
              source={{ uri: item.picture }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <ImageIcon width={44} height={44} color="#9CA3AF" />
          )}
        </View>

        <View className="flex-1 justify-center gap-1">
          <Text className="text-lg text-gray-500 font-medium mb-1">
            Location:
          </Text>

          <View className="flex-row items-center">
            <Text className="text-base text-gray-400 w-24">Galley:</Text>
            <Text className="text-base text-gray-800 font-semibold">
              {locationInfo.galley}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text-base text-gray-400 w-24">Stowage:</Text>
            <Text className="text-base text-gray-800 font-semibold">
              {locationInfo.stowage}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text-base text-gray-400 w-24">Carrier:</Text>
            <Text className="text-base text-gray-800 font-semibold">
              {locationInfo.carrier}
            </Text>
          </View>
        </View>
      </View>

      {/* Quantity Section */}
      <View className="bg-gray-200 p-4 flex-row items-center justify-between">
        <View className="items-center">
          <Text className="text-base text-gray-500 font-semibold mb-1">
            Total Qty
          </Text>
          <Text className="text-3xl text-gray-600 font-bold">{totalQty}</Text>
        </View>

        <View className="items-center">
          <Text className="text-base text-gray-500 font-semibold mb-1">
            Enter Remaining Quantity
          </Text>
          <View className="bg-white rounded-lg border border-blue-300 w-28 h-14 justify-center items-center shadow-sm">
            <TextInput
              value={remainingInput}
              onChangeText={setRemainingInput}
              keyboardType="numeric"
              placeholder="#"
              placeholderTextColor="#D1D5DB"
              className="text-3xl font-bold text-center text-gray-800 w-full h-full"
              autoFocus
              editable={!isCreating}
            />
          </View>
        </View>

        <View className="items-center">
          <Text className="text-base text-gray-400 font-semibold mb-1">
            To be Refilled
          </Text>
          <Text className="text-3xl text-gray-400 font-bold">
            {remainingInput === "" ? "#" : refillQty}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View className="bg-gray-200 px-4 pb-4 flex-row justify-end gap-3">
        <TouchableOpacity
          onPress={handleSave}
          disabled={remainingInput === "" || isCreating}
          className={`px-6 py-1 rounded-lg shadow-sm ${
            remainingInput === "" || isCreating ? "bg-gray-400" : "bg-[#602AF3]"
          }`}
        >
          {isCreating ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-lg">Confirm</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onClose}
          disabled={isCreating}
          className="bg-gray-300 px-6 py-1 rounded-lg"
        >
          <Text className="text-gray-700 font-bold text-lg">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (presentationStyle === "overlay") {
    return (
      <View className="absolute inset-0 z-50 bg-black/70 justify-center items-center">
        {Content}
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-black/60 justify-center items-center"
      >
        {Content}
      </KeyboardAvoidingView>
    </Modal>
  );
};
