import React from "react";
import { Text, View } from "react-native";

export const FlightListHeader: React.FC = () => {
  return (
    <View className="bg-bg-quaternary border-b border-border-secondary">
      {/* Row 1: Group Header 
        Added w-[30px] spacer at the start to offset the Dropdown column 
      */}
      <View className="flex-row items-stretch bg-bg-tertiary border-b border-border-muted px-2.5">
        {/* SPACER for Dropdown Column */}
        <View className="w-[30px]" />

        <View className="flex-[57]">
          <View className="flex-row justify-center items-center py-2.5">
            <Text className="ml-1.5 text-base font-semibold text-text-primary">
              Flight
            </Text>
          </View>
        </View>

        <View className="flex-[10]">
          <View className="flex-row justify-center items-center py-2.5">
            <Text className="text-base font-semibold text-text-primary pr-[22px]">
              Aircraft
            </Text>
          </View>
        </View>

        {/* PAX Group: flex 5 */}
        <View className="flex-[5]">
          <View className="flex-row justify-center items-center py-2.5">
            <Text className="text-base font-semibold text-text-primary pr-[22px]">
              PAX
            </Text>
          </View>
        </View>

        {/* Spot Group: flex 4 */}
        <View className="flex-[4]">
          <View className="flex-row justify-center items-center py-2.5">
            <Text className="text-base font-semibold text-text-primary">
              Spot
            </Text>
          </View>
        </View>
      </View>

      {/* Row 2: Column Header 
        Added w-[30px] spacer at the start to offset the Dropdown column 
      */}
      <View className="flex-row items-stretch bg-border-secondary px-2.5">
        {/* SPACER for Dropdown Column */}
        <View className="w-[30px]" />

        {/* Flight columns */}
        <View className="flex-[6] px-1">
          <View className="justify-center py-3">
            <Text className="text-sm font-medium text-black">Airline</Text>
          </View>
        </View>
        <View className="flex-[12] px-1">
          <View className="justify-center py-3">
            <Text className="text-sm font-medium text-black">Route</Text>
          </View>
        </View>
        <View className="flex-[8] px-1">
          <View className="justify-center py-3">
            <Text className="text-sm font-medium text-black">Flight #</Text>
          </View>
        </View>
        <View className="flex-[4] px-1">
          <View className="justify-center py-3">
            <Text className="text-sm font-medium text-black">Type</Text>
          </View>
        </View>
        <View className="flex-[6] px-1">
          <View className="justify-center py-3">
            <Text className="text-sm font-medium text-black">Date</Text>
          </View>
        </View>
        <View className="flex-[7] px-1">
          <View className="justify-center py-3">
            <Text className="text-sm font-medium text-black">Departure</Text>
          </View>
        </View>
        <View className="flex-[7] px-1">
          <View className="justify-center py-3">
            <Text className="text-sm font-medium text-black">Arrival</Text>
          </View>
        </View>
        <View className="flex-[7] px-1 border-r border-black mr-1">
          <View className="justify-center py-3">
            <Text className="text-sm font-medium text-black">Status</Text>
          </View>
        </View>

        {/* Aircraft columns */}
        <View className="flex-[10] px-1 border-r border-black mr-1">
          <View className="justify-center py-3">
            <Text className="text-sm font-medium text-black text-center">
              AC Type/Reg
            </Text>
          </View>
        </View>

        <View className="flex-[5] px-1 border-r border-black mr-1">
          <View className="justify-center py-3">
            <Text className="text-sm font-medium text-black text-center">
              Total
            </Text>
          </View>
        </View>

        <View className="flex-[4] px-1">
          <View className="justify-center py-3">
            <Text className="text-sm font-medium text-black"></Text>
          </View>
        </View>
      </View>
    </View>
  );
};
