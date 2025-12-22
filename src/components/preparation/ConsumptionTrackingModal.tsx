import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { PackingStandardItem } from "../../types/preparations";
import { ImageIcon } from "../../assets/icons";
import { useConsumptionTrackingStore } from "../../store/useConsumptionStore";
import { AppButton } from "../common/AppButton";

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
    <View className="w-[650px] bg-bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border-muted">
      {/* --- HEADER --- */}
      <View className="p-5 border-b border-border-muted bg-bg-quaternary">
        <Text className="text-xl font-bold text-text-primary uppercase tracking-wide">
          {item.name || "Item Details"}
        </Text>
      </View>

      {/* --- BODY --- */}
      <View className="flex-row p-6 gap-6">
        {/* Left: Image Container */}
        <View className="w-48 h-48 bg-bg-tertiary rounded-xl border border-border-muted items-center justify-center overflow-hidden shadow-sm">
          {item.picture ? (
            <Image
              source={{ uri: item.picture }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <ImageIcon width={64} height={64} color="#A09CAB" />
          )}
        </View>

        {/* Right: Info Table */}
        <View className="flex-1 justify-center gap-4">
          <View className="bg-bg-tertiary rounded-xl p-4 border border-border-muted">
            <Text className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">
              Location Details
            </Text>

            {/* Table Row 1: Headers */}
            <View className="flex-row border-b border-border-muted pb-2 mb-2">
              <Text className="flex-1 text-xs font-bold text-text-secondary">
                GALLEY
              </Text>
              <Text className="flex-1 text-xs font-bold text-text-secondary">
                STOWAGE
              </Text>
              <Text className="flex-1 text-xs font-bold text-text-secondary">
                CARRIER
              </Text>
            </View>

            {/* Table Row 2: Data */}
            <View className="flex-row">
              <Text className="flex-1 text-base font-medium text-text-primary">
                {locationInfo.galley}
              </Text>
              <Text className="flex-1 text-base font-medium text-text-primary">
                {locationInfo.stowage}
              </Text>
              <Text className="flex-1 text-base font-medium text-text-primary">
                {locationInfo.carrier}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* --- QUANTITY INPUT SECTION --- */}
      <View className="bg-bg-quaternary px-8 py-6 border-t border-border-muted flex-row items-center justify-between">
        {/* Total */}
        <View className="items-center">
          <Text className="text-sm font-semibold text-text-muted mb-1 uppercase">
            Total Qty
          </Text>
          <Text className="text-4xl font-bold text-text-primary">
            {totalQty}
          </Text>
        </View>

        {/* Input */}
        <View className="items-center">
          <Text className="text-sm font-bold text-bg-button mb-2 uppercase">
            Enter Leftover
          </Text>
          <View className="bg-bg-surface rounded-xl border-2 border-bg-button w-32 h-16 justify-center items-center shadow-sm">
            <TextInput
              value={remainingInput}
              onChangeText={setRemainingInput}
              keyboardType="numeric"
              placeholder="#"
              placeholderTextColor="#A09CAB"
              className="text-3xl font-bold text-center text-text-primary w-full h-full p-0"
              autoFocus
              editable={!isCreating}
            />
          </View>
        </View>

        {/* Refill Calculation */}
        <View className="items-center">
          <Text className="text-sm font-semibold text-text-muted mb-1 uppercase">
            To Refill
          </Text>
          <Text className="text-4xl font-bold text-text-secondary">
            {remainingInput === "" ? "-" : refillQty}
          </Text>
        </View>
      </View>

      {/* --- FOOTER ACTIONS --- */}
      <View className="p-5 border-t border-border-muted flex-row justify-end gap-3 bg-bg-surface">
        <AppButton
          title="Cancel"
          onPress={onClose}
          type="secondary"
          disabled={isCreating}
          style={{ width: 120 }}
        />

        <AppButton
          title={isCreating ? "Saving..." : "Confirm"}
          onPress={handleSave}
          type="primary"
          disabled={remainingInput === "" || isCreating}
          loading={isCreating}
          style={{ width: 140 }}
        />
      </View>
    </View>
  );

  if (presentationStyle === "overlay") {
    return (
      <View className="absolute inset-0 z-50 bg-black/70 justify-center items-center px-4">
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
        className="flex-1 bg-black/60 justify-center items-center px-4"
      >
        {Content}
      </KeyboardAvoidingView>
    </Modal>
  );
};
