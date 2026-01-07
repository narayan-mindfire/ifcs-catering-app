import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { AddIcon } from "../../assets/icons";
import { Delivery } from "../../types/deliveries";
import { AppButton } from "../common/AppButton";

interface DeliverySidebarProps {
  deliveries: Delivery[];
  selectedDeliveryId: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export const DeliverySidebar: React.FC<DeliverySidebarProps> = ({
  deliveries,
  selectedDeliveryId,
  isLoading,
  onSelect,
  onAdd,
  onDelete,
}) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;

  return (
    <View className="w-full lg:w-[260px] lg:h-auto border-b lg:border-r lg:border-b-0 border-border-muted p-4 bg-bg-surface">
      <View className="pb-4 border-b border-border-muted mb-4">
        <Text className="text-lg font-semibold text-text-primary mb-3">
          Deliveries ({deliveries.length})
        </Text>
        <AppButton
          title="Add New Delivery"
          onPress={onAdd}
          disabled={isLoading}
          type="secondary"
          IconComponent={
            AddIcon ? <AddIcon width={16} height={16} /> : undefined
          }
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 8,
          }}
          textStyle={{ fontSize: 14 }}
        />
      </View>

      <ScrollView
        horizontal={!isLargeScreen}
        className={isLargeScreen ? "flex-1" : "flex-grow-0"}
        showsHorizontalScrollIndicator={false}
      >
        {deliveries.map((delivery) => (
          <Pressable
            key={delivery.id}
            onPress={() => onSelect(delivery.id)}
            onLongPress={() => onDelete(delivery.id)}
            className={`p-3 rounded-lg ${
              isLargeScreen ? "mb-2 w-full" : "mr-2 w-[160px]"
            } ${
              selectedDeliveryId === delivery.id
                ? "bg-bg-accent border border-bg-primary"
                : "bg-bg-tertiary"
            }`}
          >
            <Text
              numberOfLines={1}
              className={`text-base ${
                selectedDeliveryId === delivery.id
                  ? "text-text-primary font-semibold"
                  : "text-text-primary"
              }`}
            >
              {delivery.deliveryName}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
