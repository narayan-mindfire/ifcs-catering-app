import React from "react";
import { ScrollView, Text, View } from "react-native";

import { ScanIcon } from "@/assets/icons";
import { AppButton } from "@/components/common/AppButton";
import { Flight } from "@/types/flight";
import { Truck } from "@/types/preparations";

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
  selectedFlight: Flight | null;
  onScanPress: (actionType: ScanActionType) => void;
  trucks?: Truck[];
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

const TruckInfo: React.FC<{ truck: Truck }> = ({ truck }) => {
  const driver = truck.dispatchAssignments
    ?.flatMap((da) => da.assignedStaff || [])
    ?.find((s) => s.role === "DRIVER");

  const initials = driver
    ? `${driver.firstName?.[0] || ""}${driver.lastName?.[0] || ""}`.toUpperCase()
    : "";

  const firstName = driver?.firstName || "";
  const lastName = driver?.lastName || "";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
        marginRight: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ marginRight: 20 }}>
        <Text
          style={{
            fontSize: 9,
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "#6B7280",
            marginBottom: 2,
          }}
        >
          Truck ID
        </Text>
        <Text style={{ fontSize: 13, fontWeight: "800", color: "#111827" }}>
          {truck.assetName?.trim() || "N/A"}
        </Text>
      </View>

      {driver ? (
        <>
          <View style={{ position: "relative" }}>
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "#4F46E5",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 14, fontWeight: "bold" }}
              >
                {initials || "??"}
              </Text>
            </View>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                height: 14,
                width: 14,
                backgroundColor: "#10B981",
                borderRadius: 7,
                borderWidth: 2,
                borderColor: "white",
              }}
            />
          </View>

          <View style={{ marginLeft: 16 }}>
            <Text
              style={{
                fontSize: 9,
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#6B7280",
                marginBottom: 2,
              }}
            >
              Assigned Driver
            </Text>
            <Text style={{ fontSize: 13, fontWeight: "800", color: "#111827" }}>
              {firstName} {lastName}
            </Text>
          </View>
        </>
      ) : (
        <View style={{ marginLeft: 8 }}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#6B7280",
              marginBottom: 2,
            }}
          >
            Status
          </Text>
          <Text style={{ fontSize: 11, fontWeight: "600", color: "#9CA3AF" }}>
            No Driver Assigned
          </Text>
        </View>
      )}
    </View>
  );
};

export const PreparationsHeader: React.FC<PreparationsHeaderProps> = ({
  filterOptions,
  selectedFilters,
  onToggleFilter,
  onScanPress,
  trucks,
}) => {
  return (
    <View className="flex-row mb-5 z-10" style={{ minHeight: 70 }}>
      <View className="flex-1 relative">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 32,
            flexGrow: 1,
          }}
        >
          <View className="flex-row items-center">
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
                  color: "#111827",
                }}
              />
            ))}
          </View>

          {trucks && trucks.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderLeftWidth: 1,
                borderColor: "#E5E7EB",
                paddingLeft: 16,
                marginLeft: 4,
              }}
            >
              {trucks.map((truck) => (
                <TruckInfo key={truck.id} truck={truck} />
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      <View className="flex-row ms-3 justify-end items-center">
        <MultiSelectFilter
          options={filterOptions}
          selectedOptions={selectedFilters}
          onToggleOption={onToggleFilter}
        />
      </View>
    </View>
  );
};
