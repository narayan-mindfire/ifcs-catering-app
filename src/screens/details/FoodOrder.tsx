import React from "react";
import { View, Text, FlatList } from "react-native";
import { FoodOrderItem, foodOrderData } from "../../const/foodOrderData";

export const FoodOrderScreen: React.FC = () => {
  const totals = foodOrderData.reduce(
    (acc, item) => {
      acc.ordered += Number(item.ordered) || 0;
      acc.distributed += Number(item.distributed) || 0;
      acc.loaded += Number(item.loaded) || 0;
      return acc;
    },
    { ordered: 0, distributed: 0, loaded: 0 },
  );

  const renderSummaryRow = () => (
    <View className="flex-row items-center px-4 py-2.5 border-b border-bg-tertiary bg-bg-surface">
      <Text className="flex-1 text-lg text-text-secondary"></Text>
      <Text className="flex-1 text-lg text-text-secondary"></Text>
      <Text className="flex-1 text-lg text-text-secondary"></Text>
      <Text className="flex-1 text-lg text-text-secondary"></Text>
      <Text className="flex-[3] text-lg text-text-secondary"></Text>
      <Text className="flex-1 text-lg text-text-secondary"></Text>
      <Text className="flex-1 text-lg text-text-secondary"></Text>
      <Text className="flex-[3] text-lg text-text-muted text-right pr-5">
        Total
      </Text>
      <Text className="flex-1 text-lg text-text-secondary text-center">
        {totals.ordered}
      </Text>
      <Text className="flex-1 text-lg text-text-secondary text-center">
        {totals.distributed}
      </Text>
      <Text className="flex-1 text-lg text-text-secondary text-center">
        {totals.loaded}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: FoodOrderItem }) => (
    <View className="flex-row items-center px-4 py-2.5 border-b border-bg-tertiary">
      <Text className="flex-1 text-lg text-text-secondary">{item.station}</Text>
      <Text className="flex-1 text-lg text-text-secondary">
        {item.flightNumber}
      </Text>
      <Text className="flex-1 text-lg text-text-secondary">{item.sku}</Text>
      <Text className="flex-1 text-lg text-text-secondary">{item.cabin}</Text>
      <Text className="flex-[3] text-lg text-text-secondary">
        {item.mealName}
      </Text>
      <Text className="flex-1 text-lg text-text-secondary text-center">
        {item.ordered}
      </Text>
      <Text className="flex-1 text-lg text-text-secondary text-center">
        {item.distributed}
      </Text>
      <Text className="flex-1 text-lg text-text-secondary text-center">
        {item.loaded}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-bg-surface p-4">
      <View className="flex-1 border border-border-secondary rounded-[10px] overflow-hidden">
        <View className="flex-row bg-bg-tertiary py-3 px-4 border-b border-border-muted">
          <Text className="flex-1 text-lg font-semibold text-text-secondary">
            Station
          </Text>
          <Text className="flex-1 text-lg font-semibold text-text-secondary">
            FLT #
          </Text>
          <Text className="flex-1 text-lg font-semibold text-text-secondary">
            SKU
          </Text>
          <Text className="flex-1 text-lg font-semibold text-text-secondary">
            Cabin
          </Text>
          <Text className="flex-[3] text-lg font-semibold text-text-secondary">
            Name Y
          </Text>
          <Text className="flex-1 text-lg font-semibold text-text-secondary text-center">
            Ordered
          </Text>
          <Text className="flex-1 text-lg font-semibold text-text-secondary text-center">
            Distributed
          </Text>
          <Text className="flex-1 text-lg font-semibold text-text-secondary text-center">
            Loaded
          </Text>
        </View>

        {renderSummaryRow()}

        <FlatList
          style={{ flex: 1 }}
          data={[
            ...foodOrderData,
            ...foodOrderData,
            ...foodOrderData,
            ...foodOrderData,
          ]}
          keyExtractor={(item, index) => item.id + index}
          removeClippedSubviews={false}
          onLayout={() => {}}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View className="p-4">
              <Text className="text-center text-text-muted mt-6">
                No food orders found.
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};
