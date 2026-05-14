import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { ImageIcon } from "@/assets/icons";
import { ConsumptionTrackingRecord } from "@/types/consumption";
import {
  PackingStandardItem,
  PreparationDetailData,
} from "@/types/preparations";

interface ItemsListProps {
  activeEquipmentName: string;
  selectedDrawerContents: PackingStandardItem[];
  isConsumptionMode: boolean;
  preparationDetail: PreparationDetailData;
  consumptionRecords: ConsumptionTrackingRecord[];
  handleOpenConsumptionModal: (item: PackingStandardItem) => void;
  handleImagePress: (
    url: string | null | undefined,
    name: string | null | undefined,
  ) => void;
}

export const ItemsList: React.FC<ItemsListProps> = ({
  activeEquipmentName,
  selectedDrawerContents,
  isConsumptionMode,
  preparationDetail,
  consumptionRecords,
  handleOpenConsumptionModal,
  handleImagePress,
}) => {
  return (
    <View className="flex-1 bg-bg-surface rounded-2xl border border-border-muted overflow-hidden">
      <View className="p-3 border-b border-border-muted bg-bg-secondary">
        <View className="mb-2">
          <Text className="text-xs text-text-secondary">Selected</Text>
          <Text className="text-sm font-bold text-text-primary">
            {activeEquipmentName}
          </Text>
        </View>
      </View>

      <View className="flex-row p-2 border-b border-border-muted bg-bg-tertiary">
        <Text className="flex-1 text-xs font-bold text-text-secondary text-center">
          Qty
        </Text>
        <Text className="flex-[3] text-xs font-bold text-text-secondary pl-2">
          Item
        </Text>
        <Text className="flex-1 text-xs font-bold text-text-secondary text-center">
          Img
        </Text>
      </View>

      <ScrollView>
        {selectedDrawerContents.length > 0 ? (
          selectedDrawerContents.map((item, index) => {
            const isTrackable =
              preparationDetail.isTrackConsumption || item.isTrackConsumption;

            const isTracked = consumptionRecords.some((r) => {
              if (item.isDynamic) {
                return (
                  r.flightPreparationDynamicItemId ===
                  (item.flightPreparationDynamicItemId || item.id)
                );
              }
              return r.flightPrepPackingStandardItemId === item.id;
            });
            let rowStyle = "bg-bg-surface border-b border-border-muted";

            if (isConsumptionMode && isTrackable) {
              if (isTracked) {
                rowStyle =
                  "bg-blue-50 border-b border-blue-200 border-l-[4px] border-l-blue-500";
              } else {
                rowStyle =
                  "bg-red-50 border-b border-red-200 border-l-[4px] border-l-red-500";
              }
            }

            return (
              <TouchableOpacity
                key={item.id || index}
                className={`flex-row p-3 items-center ${rowStyle}`}
                onPress={() => {
                  if (isConsumptionMode && isTrackable) {
                    handleOpenConsumptionModal(item);
                  } else {
                    handleImagePress(item.picture, item.name);
                  }
                }}
              >
                <Text className="flex-1 text-sm text-text-primary text-center">
                  {item.quantity}
                </Text>

                <Text className="flex-[3] text-sm text-text-primary pl-2">
                  {item.name}
                </Text>

                <View className="flex-1 items-center">
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleImagePress(item.picture, item.name);
                    }}
                  >
                    {item.picture ? (
                      <Image
                        source={{ uri: item.picture }}
                        className="w-8 h-8 rounded"
                        resizeMode="cover"
                      />
                    ) : (
                      <ImageIcon width={25} height={25} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View className="p-4 items-center">
            <Text className="text-text-muted text-sm">
              No items in this selection.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
