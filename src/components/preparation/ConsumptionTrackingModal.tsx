import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";

import { ImageIcon } from "../../assets/icons";
import { useConsumptionTrackingStore } from "../../store/useConsumptionStore";
import { ConsumptionTrackingRecord } from "../../types/consumption"; // Import this
import { PackingStandardItem } from "../../types/preparations";
import { AppButton } from "../common/AppButton";

interface ConsumptionModalProps {
  visible: boolean;
  onClose: () => void;
  item: PackingStandardItem | null;
  existingRecord?: ConsumptionTrackingRecord | null; // NEW PROP
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
  existingRecord, // Destructure new prop
  flightId,
  preparationId,
  packingStandardId,
  packingStandardItemId,
  locationInfo,
  presentationStyle = "modal",
}) => {
  const [remainingInput, setRemainingInput] = useState<string>("");

  // Get both actions from store
  const {
    createConsumptionRecord,
    updateConsumptionRecord,
    isCreating,
    isUpdating,
  } = useConsumptionTrackingStore();

  const isLoading = isCreating || isUpdating;

  // INITIALIZATION LOGIC
  useEffect(() => {
    if (visible && item) {
      if (existingRecord) {
        // Mode: UPDATE - Pre-fill with existing returnedQty
        setRemainingInput(existingRecord.returnedQty.toString());
      } else {
        // Mode: CREATE - Reset to empty
        setRemainingInput("");
      }
    }
  }, [visible, item, existingRecord]);

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
      let resultSuccess = false;

      // LOGIC SPLIT: CREATE vs UPDATE
      if (existingRecord) {
        // --- UPDATE FLOW ---
        const success = await updateConsumptionRecord(
          flightId,
          existingRecord.id,
          {
            qty: totalQty,
            consumedQty: consumedQty,
            addQty: 0,
            returnedQty: remainingQty,
          },
        );
        resultSuccess = success;
      } else {
        // --- CREATE FLOW ---
        const result = await createConsumptionRecord(flightId, {
          flightPreparationId: preparationId,
          flightPrepPackingStandardId: packingStandardId,
          flightPrepPackingStandardItemId: packingStandardItemId || item.id,
          qty: totalQty,
          consumedQty: consumedQty,
          addQty: 0,
          returnedQty: remainingQty,
        });
        resultSuccess = result.success;
      }

      if (resultSuccess) {
        // Optional: Reduced verbosity for updates to make it snappier
        if (!existingRecord) {
          Alert.alert(
            "Success",
            `Consumption tracked successfully!\nConsumed: ${consumedQty}\nRemaining: ${remainingQty}\nTo Refill: ${refillQty}`,
          );
        }
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
      <View className="p-5 border-b border-border-muted bg-bg-quaternary flex-row justify-between items-center">
        <Text className="text-xl font-bold text-text-primary uppercase tracking-wide">
          {item.name || "Item Details"}
        </Text>
        {/* Visual Indicator for Update Mode */}
        {existingRecord && (
          <View className="bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            <Text className="text-blue-700 text-xs font-bold uppercase">
              Updating
            </Text>
          </View>
        )}
      </View>

      {/* ... [IMAGE AND LOCATION INFO SECTIONS REMAIN EXACTLY THE SAME] ... */}
      <View className="flex-row p-6 gap-6">
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
        <View className="flex-1 justify-center gap-4">
          <View className="bg-bg-tertiary rounded-xl p-4 border border-border-muted">
            <Text className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">
              Location Details
            </Text>
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
        <View className="items-center">
          <Text className="text-sm font-semibold text-text-muted mb-1 uppercase">
            Total Qty
          </Text>
          <Text className="text-4xl font-bold text-text-primary">
            {totalQty}
          </Text>
        </View>

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
              editable={!isLoading}
            />
          </View>
        </View>

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
          disabled={isLoading}
          style={{ width: 120 }}
        />

        <AppButton
          // Dynamic Title
          title={
            isLoading ? "Saving..." : existingRecord ? "Update" : "Confirm"
          }
          onPress={handleSave}
          type="primary"
          disabled={remainingInput === "" || isLoading}
          loading={isLoading}
          style={{ width: 140 }}
        />
      </View>
    </View>
  );

  // ... (Overlay/Modal wrapper logic remains the same)
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
