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
import { ConsumptionTrackingRecord } from "../../types/consumption";
import { PackingStandardItem } from "../../types/preparations";
import { log } from "../../utils/logger";
import { AppButton } from "../common/AppButton";

interface ConsumptionModalProps {
  visible: boolean;
  onClose: () => void;
  item: PackingStandardItem | null;
  existingRecord?: ConsumptionTrackingRecord | null;
  flightId: string;
  preparationId: string;
  packingStandardId?: string;
  packingStandardItemId?: string;
  flightPrepProvisionItemId?: string;
  locationInfo: {
    galley: string | null;
    stowage: string | null;
    carrier: string | null;
  };
  presentationStyle?: "modal" | "overlay";
  drawerName?: string;
}

export const ConsumptionModal: React.FC<ConsumptionModalProps> = ({
  visible,
  onClose,
  item,
  existingRecord,
  flightId,
  preparationId,
  packingStandardId,
  packingStandardItemId,
  flightPrepProvisionItemId,
  locationInfo,
  presentationStyle = "modal",
}) => {
  const [remainingInput, setRemainingInput] = useState<string>("");

  const {
    createConsumptionRecord,
    updateConsumptionRecord,
    isCreating,
    isUpdating,
  } = useConsumptionTrackingStore();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (visible && item) {
      if (existingRecord) {
        setRemainingInput(existingRecord.returnedQty.toString());
      } else {
        setRemainingInput("");
      }
    }
  }, [visible, item, existingRecord]);

  if (!item) return null;
  if (presentationStyle === "overlay" && !visible) return null;

  const totalQty = item.quantity || 0;
  const rawRemainingQty = parseInt(remainingInput) || 0;
  const remainingQty = Math.min(rawRemainingQty, totalQty);
  const refillQty = Math.max(0, totalQty - remainingQty);
  const consumedQty = totalQty - remainingQty;

  const isInvalid = rawRemainingQty > totalQty;

  const handleSave = async () => {
    if (!flightId || remainingInput === "") {
      Alert.alert("Error", "Please enter a valid remaining quantity");
      return;
    }

    if (isInvalid) return;

    try {
      let resultSuccess = false;

      const commonPayload = {
        qty: totalQty,
        consumedQty: consumedQty,
        addQty: 0,
        returnedQty: remainingQty,
      };

      if (existingRecord) {
        const success = await updateConsumptionRecord(
          flightId,
          existingRecord.id,
          commonPayload,
        );
        resultSuccess = success;
      } else {
        let createPayload: any = {
          flightPreparationId: preparationId,
          ...commonPayload,
        };

        if (item.isDynamic) {
          createPayload.flightPreparationId = preparationId;
          createPayload.flightPreparationDynamicItemId = item.id;
          createPayload.foodOrderItemId = item.foodOrderItemId;
          createPayload.mealId = item.mealId;
        } else {
          createPayload.flightPreparationId = preparationId;
          createPayload.flightPrepPackingStandardId = packingStandardId;
          createPayload.flightPrepPackingStandardItemId =
            packingStandardItemId || item.id;
          createPayload.flightPrepProvisionItemId =
            flightPrepProvisionItemId ||
            (item as any).itemId ||
            (item as any).provisionId;
          createPayload.foodOrderItemId = item.foodOrderItemId;
          createPayload.mealId = item.mealId;
        }
        const result = await createConsumptionRecord(flightId, createPayload);
        resultSuccess = result.success;
      }

      if (resultSuccess) {
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
      log.error("Error saving consumption:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const Content = (
    <View className="w-[650px] bg-bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border-muted">
      <View className="p-5 border-b border-border-muted bg-bg-quaternary flex-row justify-between items-center">
        <Text className="text-xl font-bold text-text-primary uppercase tracking-wide">
          {item.name || "Item Details"}
        </Text>
        {existingRecord && (
          <View className="bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            <Text className="text-blue-700 text-xs font-bold uppercase">
              Updating
            </Text>
          </View>
        )}
      </View>

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
                {locationInfo.galley || "N/A"}
              </Text>
              <Text className="flex-1 text-base font-medium text-text-primary">
                {locationInfo.stowage || "N/A"}
              </Text>
              <Text className="flex-1 text-base font-medium text-text-primary">
                {locationInfo.carrier || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </View>

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
          <View
            className={`bg-bg-surface rounded-xl border-2 w-32 h-16 justify-center items-center shadow-sm ${
              isInvalid ? "border-red-500 bg-red-50" : "border-bg-button"
            }`}
          >
            <TextInput
              value={remainingInput}
              onChangeText={setRemainingInput}
              keyboardType="numeric"
              placeholder="#"
              placeholderTextColor="#A09CAB"
              className={`text-3xl font-bold text-center w-full h-full p-0 ${
                isInvalid ? "text-red-500" : "text-text-primary"
              }`}
              autoFocus
              editable={!isLoading}
            />
          </View>
          {isInvalid && (
            <Text className="text-red-500 text-xs font-bold mt-1">
              Max: {totalQty}
            </Text>
          )}
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

      <View className="p-5 border-t border-border-muted flex-row justify-end gap-3 bg-bg-surface">
        <AppButton
          title="Cancel"
          onPress={onClose}
          type="secondary"
          disabled={isLoading}
          style={{ width: 120 }}
        />

        <AppButton
          title={
            isLoading ? "Saving..." : existingRecord ? "Update" : "Confirm"
          }
          onPress={handleSave}
          type="primary"
          disabled={remainingInput === "" || isLoading || isInvalid}
          loading={isLoading}
          style={{ width: 140 }}
        />
      </View>
    </View>
  );

  if (presentationStyle === "overlay") {
    return (
      <View className="absolute inset-0 z-50 bg-black/70 justify-center items-center px-4">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center w-full"
        >
          {Content}
        </KeyboardAvoidingView>
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
