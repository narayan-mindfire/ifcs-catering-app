import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { ImageIcon, InfoIcon } from "@/assets/icons";
import { AppButton } from "@/components/common/AppButton";

interface ItemData {
  id: number;
  qty: number;
  item: string;
  status: string;
}

interface SpotCheckItemListPanelProps {
  items: ItemData[];
  onPass: () => void;
  onFail: () => void;
}

export const SpotCheckItemListPanel: React.FC<SpotCheckItemListPanelProps> =
  React.memo(({ items, onPass, onFail }) => {
    const renderItem = useCallback(({ item }: { item: ItemData }) => {
      const isPass = item.status === "Pass";
      return (
        <View className="flex-row px-4 py-4 border-b border-gray-50 items-center hover:bg-gray-50">
          <Text className="flex-[0.2] text-text-secondary">{item.qty}</Text>
          <Text className="flex-[1.5] text-text-secondary">{item.item}</Text>
          <View className="flex-[0.4] flex-row items-center gap-1">
            <Text
              className={`${
                isPass ? "text-green-500" : "text-red-500"
              } font-medium`}
            >
              {item.status}
            </Text>
            <TouchableOpacity>
              <InfoIcon width={16} height={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          <View className="flex-[0.3] items-end">
            <TouchableOpacity>
              <ImageIcon width={20} height={20} color="#4b5563" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }, []);

    return (
      <View className="flex-[1.5] bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden">
        <View className="p-4 border-b border-gray-100">
          <Text className="text-xl font-medium text-text-primary">Items</Text>
        </View>

        <View className="flex-row bg-gray-50 px-4 py-3 border-b border-gray-100">
          <Text className="flex-[0.2] font-semibold text-text-primary">
            Qty.
          </Text>
          <Text className="flex-[1.5] font-semibold text-text-primary">
            Item
          </Text>
          <Text className="flex-[0.4] font-semibold text-text-primary">
            Status
          </Text>
          <Text className="flex-[0.3] font-semibold text-text-primary text-right">
            Action
          </Text>
        </View>

        <View className="flex-1">
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        </View>

        <View className="p-4 flex-row gap-4 border-t border-gray-100">
          <AppButton style={{ flex: 1 }} title={"Pass"} onPress={onPass} />
          <AppButton
            style={{ flex: 1, backgroundColor: "red" }}
            title={"Fail"}
            onPress={onFail}
          />
        </View>
      </View>
    );
  });
SpotCheckItemListPanel.displayName = "SpotCheckItemListPanel";
