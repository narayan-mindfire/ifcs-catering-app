import React, { useRef } from "react";
import { View } from "react-native";
import { PrintIcon, ScanIcon, SeatIcon } from "../../assets/icons";
import { AppButton } from "../common/AppButton";
import { MultiSelectFilter } from "./MultiSelectFilter";

const SCAN_ACTIONS = [
  { label: "Prep Scan", onPress: () => {} },
  { label: "Verify Seal", onPress: () => {} },
  { label: "Assemble Scan", onPress: () => {} },
  { label: "Load Scan", onPress: () => {} },
] as const;

interface PreparationsHeaderProps {
  filterOptions: { label: string; icon: any }[];
  selectedFilters: string[];
  onToggleFilter: (option: string) => void;
  onPrint: () => void;
  isPrinting: boolean;
  selectedFlight: any;
}

export const PreparationsHeader: React.FC<PreparationsHeaderProps> = ({
  filterOptions,
  selectedFilters,
  onToggleFilter,
  onPrint,
  isPrinting,
  selectedFlight,
}) => {
  const buttonRef = useRef<View>(null);

  return (
    <View className="flex-row mb-5 z-10">
      <View className="flex-1 flex-row justify-start">
        {SCAN_ACTIONS.map(({ label, onPress }) => (
          <AppButton
            type="tertiary"
            key={label}
            title={label}
            onPress={onPress}
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

        <View ref={buttonRef} collapsable={false}>
          <AppButton
            title="PAX Count"
            onPress={() => {}}
            type="tertiary"
            IconComponent={<SeatIcon />}
            style={{
              marginRight: 12,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 6,
            }}
            textStyle={{
              fontSize: 16,
              fontWeight: "400",
              color: "var(--text-secondary)",
            }}
          />
        </View>

        <AppButton
          title={isPrinting ? "Printing..." : "Print"}
          onPress={onPrint}
          loading={isPrinting}
          disabled={isPrinting}
          type="tertiary"
          IconComponent={!isPrinting ? <PrintIcon /> : undefined}
          style={{
            marginRight: 12,
            paddingHorizontal: 16,
            borderRadius: 6,
          }}
          textStyle={{
            fontSize: 16,
            fontWeight: "400",
            color: "var(--text-secondary)",
          }}
        />
      </View>
    </View>
  );
};
