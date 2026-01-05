import React from "react";
import { View } from "react-native";

import { ScanIcon } from "../../assets/icons";
import { AppButton } from "../common/AppButton";
import { MultiSelectFilter } from "./MultiSelectFilter";

export type ScanActionType = "prep" | "seal" | "assemble" | "load";

const SCAN_ACTIONS = [
  { label: "Prep Scan", actionType: "prep" as ScanActionType },
  { label: "Verify Seal", actionType: "seal" as ScanActionType },
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
}

export const PreparationsHeader: React.FC<PreparationsHeaderProps> = ({
  filterOptions,
  selectedFilters,
  onToggleFilter,
  onScanPress,
}) => {
  return (
    <View className="flex-row mb-5 z-10">
      <View className="flex-1 flex-row justify-start">
        {SCAN_ACTIONS.map(({ label, actionType }) => (
          <AppButton
            type="tertiary"
            key={label}
            title={label}
            onPress={() => onScanPress(actionType)}
            IconComponent={<ScanIcon height={28} width={28} />}
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
      </View>

      <View className="flex-1 flex-row justify-end">
        <MultiSelectFilter
          options={filterOptions}
          selectedOptions={selectedFilters}
          onToggleOption={onToggleFilter}
        />
      </View>
    </View>
  );
};
