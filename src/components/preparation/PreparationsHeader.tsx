import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, View } from "react-native";

import { ScanIcon } from "../../assets/icons";
import { AppButton } from "../common/AppButton";
import { MultiSelectFilter } from "./MultiSelectFilter";

export type ScanActionType = "prep" | "seal" | "lock" | "assemble" | "load";

const SCAN_ACTIONS = [
  { label: "Prep Scan", actionType: "prep" as ScanActionType },
  { label: "Verify Seal", actionType: "seal" as ScanActionType },
  { label: "Verify Lock", actionType: "lock" as ScanActionType },
  { label: "Assemble Scan", actionType: "assemble" as ScanActionType },
  { label: "Load Scan", actionType: "load" as ScanActionType },
] as const;

export interface PreparationsHeaderProps {
  filterOptions: { label: string; icon: any }[];
  selectedFilters: string[];
  onToggleFilter: (option: string) => void;
  selectedFlight: any;
  onScanPress: (actionType: ScanActionType) => void;
}

export interface ParsedQRData {
  flightPrepId: string;
  flightId: string;
  flightPrepPackingStandardId: string;
  galleyConfigId: string;
  packingStandardId: string;
  parentStorageId: string;
  storageId: string;
  prepName: string;
  flightNumber: string;
  position: string;
  scheduledDepartUtc: string;
  rotationCode: string;
  prepNameRepeated: string;
  loadingPlanValue: string;
  consumptionFlag: string;
}

export const PreparationsHeader: React.FC<PreparationsHeaderProps> = ({
  filterOptions,
  selectedFilters,
  onToggleFilter,
  onScanPress,
}) => {
  return (
    <View className="flex-row mb-5 z-10">
      {/* Scroll container */}
      <View className="flex-1 relative">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            paddingRight: 32, // space so last button isn’t hidden under gradient
          }}
        >
          {SCAN_ACTIONS.map(({ label, actionType }) => (
            <AppButton
              type="tertiary"
              key={label}
              title={label}
              onPress={() => onScanPress(actionType)}
              IconComponent={<ScanIcon height={28} width={24} />}
              style={{
                marginRight: 12,
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 6,
              }}
              textStyle={{
                fontSize: 17,
                fontWeight: "400",
                color: "var(--text-primary)",
              }}
            />
          ))}
        </ScrollView>

        {/* Scroll hint */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.15)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 28,
            justifyContent: "center",
            alignItems: "center",
          }}
          pointerEvents="none"
        />
      </View>

      <View className="flex-row ms-3 justify-end">
        <MultiSelectFilter
          options={filterOptions}
          selectedOptions={selectedFilters}
          onToggleOption={onToggleFilter}
        />
      </View>
    </View>
  );
};
