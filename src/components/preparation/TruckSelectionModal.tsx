import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Truck } from "../../types/preparations";

interface TruckSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trucks: Truck[];
  onSelect: (truckId: string, dispatchAssignmentId: string) => void;
}

export const TruckSelectionModal: React.FC<TruckSelectionModalProps> = ({
  isOpen,
  onClose,
  trucks,
  onSelect,
}) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            maxWidth: 400,
            borderRadius: 24,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 15,
            elevation: 10,
          }}
        >
          <View className="mb-6">
            <Text className="text-2xl font-black text-text-primary mb-1">
              Select Truck
            </Text>
            <Text className="text-sm text-text-tertiary">
              Choose the truck you are currently loading into.
            </Text>
          </View>

          <ScrollView className="max-h-[60vh]">
            {trucks.map((truck) => {
              const driver =
                truck.dispatchAssignments?.[0]?.assignedStaff?.find(
                  (s) => s.role === "DRIVER",
                );
              const assignmentId = truck.dispatchAssignments?.[0]?.id;

              return (
                <TouchableOpacity
                  key={truck.id}
                  onPress={() =>
                    assignmentId && onSelect(truck.id, assignmentId)
                  }
                  disabled={!assignmentId}
                  className="flex-row items-center bg-bg-surface border border-border-muted p-4 rounded-2xl mb-3 active:bg-indigo-50 active:border-indigo-200"
                >
                  <View className="flex-1">
                    <Text className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1">
                      Truck ID
                    </Text>
                    <Text className="text-base font-bold text-text-primary">
                      {truck.assetName}
                    </Text>
                    {driver && (
                      <View className="flex-row items-center mt-2">
                        <View className="h-5 w-5 rounded-full bg-indigo-100 items-center justify-center mr-2">
                          <Text className="text-indigo-600 text-[10px] font-bold">
                            {driver.firstName?.[0] || ""}
                            {driver.lastName?.[0] || ""}
                          </Text>
                        </View>
                        <Text className="text-xs text-text-secondary font-medium">
                          {driver.firstName || ""} {driver.lastName || ""}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="h-8 w-8 rounded-full bg-indigo-600 items-center justify-center shadow-md">
                    <Text className="text-white">→</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity onPress={onClose} className="mt-4 p-4 items-center">
            <Text className="text-text-tertiary font-bold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
