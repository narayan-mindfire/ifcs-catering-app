import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { AddIcon } from "../../assets/icons";
import { AppButton } from "../../components/common/AppButton";
import ContentPreparersTab from "../../components/flight-hub/ContentPreparationTab";
import CrewComplianceTab from "../../components/flight-hub/CrewComplianceTab";
import DispatcherCommentsTab from "../../components/flight-hub/DispatcherCommentsTab";
import DriversDeclarationTab from "../../components/flight-hub/DriversDeclarationTab";
import SecurityComplianceTab from "../../components/flight-hub/SecurityComplianceTab";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import { useFlightStore } from "../../store/useFlightStore";
import {
  CrewCompliance,
  Delivery,
  DriversDeclaration,
  SecurityCompliance,
} from "../../types/deliveries";

// --- Types ---

type TabType = "dispatcher" | "preparers" | "security" | "driver" | "crew";

interface TabButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
}

// --- Helpers ---

const getDriversDeclaration = (d: Delivery): DriversDeclaration => ({
  driverName: d.driverName || "",
  driverStaffId: d.driverStaffId || "",
  truckSeal: d.truckSeal || "",
  driverCompany: d.driverCompany || "",
  sealIntact: false,
  confirmationText:
    "I certify that a. the security of in-flight supplies is maintained during the transfer from in-flight supply facilies to aircraft b. in-flight supplies have been loaded into the aircraft in secure condition and handed over to the flight air crew or oman-air representative",
  signature: d.driverSignature || null,
  signedAt: d.driverSignatureTimestampDisplay
    ? new Date(d.driverSignatureTimestampDisplay)
    : null,
});

const getCrewCompliance = (d: Delivery): CrewCompliance => ({
  isCompliant: false,
  confirmationText:
    "In-flight supplies have been loaded into the aircraft in secure condition, and all seals are in secure condition",
  signature: d.crewSignature || null,
  signedAt: d.crewSignatureTimestampDisplay
    ? new Date(d.crewSignatureTimestampDisplay)
    : null,
  airCrewRepresentative: d.airCrewRepresentative || "",
  crewName: d.crewName || "",
  staffNumber: d.crewStaffNumber || "",
});

const getSecurityCompliance = (d: Delivery): SecurityCompliance => ({
  isCompliant: false,
  confirmationText:
    "The in-flight supplies have gone through the following procedures: a. implemented appropriate measures to monitor the activities of staff preparing in-flight supplies(i.e, supervision/CCTV), so it will be preventive to insert prohibited items within a product.\n b. tamper - evident seals used to secure catering, carts and containers are affixed via trained and authorized person and checked against authorized documentation.",
  signature: d.securitySignature || null,
  signedAt: d.securitySignatureTimestampDisplay
    ? new Date(d.securitySignatureTimestampDisplay)
    : null,
  provider: d.securityProvider || null,
  name: d.securityName || null,
  staffNumber: d.securityStaffNumber || null,
  position: d.securityPosition || null,
});

const TabButton: React.FC<TabButtonProps> = React.memo(
  ({ title, active, onPress }) => (
    <Pressable
      onPress={onPress}
      className={`py-2.5 px-5 rounded-[20px] ${
        active ? "bg-bg-accent border-bg-button border-[0.5px]" : ""
      }`}
    >
      <Text
        className={`text-lg ${
          active ? "text-text-primary font-semibold" : "text-text-secondary"
        }`}
      >
        {title}
      </Text>
    </Pressable>
  ),
);

TabButton.displayName = "TabButton";

const DeliveriesScreen: React.FC = () => {
  const flightId = useFlightStore((state) => state.selectedFlight?.id);

  const {
    deliveries,
    selectedDeliveryId,
    isLoading,
    error,
    fetchDeliveries,
    selectDelivery,
    createDelivery,
    updateDelivery,
    addSignature,
    deleteDelivery,
  } = useDeliveryStore();

  const [activeTab, setActiveTab] = useState<TabType>("preparers");

  const selectedDelivery = useMemo(
    () => deliveries.find((d) => d.id === selectedDeliveryId),
    [deliveries, selectedDeliveryId],
  );

  const securityCompliance = useMemo(
    () =>
      selectedDelivery ? getSecurityCompliance(selectedDelivery) : undefined,
    [selectedDelivery],
  );

  const driversDeclaration = useMemo(
    () =>
      selectedDelivery ? getDriversDeclaration(selectedDelivery) : undefined,
    [selectedDelivery],
  );

  const crewCompliance = useMemo(
    () => (selectedDelivery ? getCrewCompliance(selectedDelivery) : undefined),
    [selectedDelivery],
  );

  useEffect(() => {
    if (flightId) {
      fetchDeliveries(flightId);
    }
  }, [flightId, fetchDeliveries]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const handleAddNewDelivery = useCallback(() => {
    if (flightId) {
      const name = `Delivery ${deliveries.length + 1}`;
      createDelivery(flightId, name);
    }
  }, [flightId, deliveries.length, createDelivery]);

  const handleDeleteDelivery = useCallback(
    (deliveryId: string) => {
      if (flightId) {
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this delivery?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => deleteDelivery(flightId, deliveryId),
            },
          ],
        );
      }
    },
    [flightId, deleteDelivery],
  );

  const handleSecurityComplianceUpdate = useCallback(
    async (comp: SecurityCompliance) => {
      if (!selectedDeliveryId || !selectedDelivery || !flightId) return;

      const promises = [];
      const payload: Partial<Delivery> = {
        securityProvider: comp.provider,
        securityName: comp.name,
        securityStaffNumber: comp.staffNumber,
        securityPosition: comp.position,
      };

      const hasTextChanges =
        comp.provider !== selectedDelivery.securityProvider ||
        comp.name !== selectedDelivery.securityName ||
        comp.staffNumber !== selectedDelivery.securityStaffNumber ||
        comp.position !== selectedDelivery.securityPosition;

      if (hasTextChanges) {
        promises.push(updateDelivery(flightId, selectedDeliveryId, payload));
      }

      const hasSignatureChanges =
        comp.signature && comp.signature !== selectedDelivery.securitySignature;

      if (hasSignatureChanges) {
        promises.push(
          addSignature(
            flightId,
            selectedDeliveryId,
            "security",
            comp.signature!,
          ),
        );
      }

      try {
        await Promise.all(promises);
      } catch (err) {
        console.error("Error saving Security Declaration:", err);
        Alert.alert("Error", "Failed to save some changes.");
      }
    },
    [
      flightId,
      selectedDeliveryId,
      selectedDelivery,
      updateDelivery,
      addSignature,
    ],
  );

  const handleCrewComplianceUpdate = useCallback(
    async (comp: CrewCompliance) => {
      if (!selectedDeliveryId || !selectedDelivery || !flightId) return;

      const promises = [];

      const payload: Partial<Delivery> = {
        airCrewRepresentative: comp.airCrewRepresentative,
        crewName: comp.crewName,
        crewStaffNumber: comp.staffNumber,
      };

      const hasTextChanges =
        comp.airCrewRepresentative !== selectedDelivery.airCrewRepresentative ||
        comp.crewName !== selectedDelivery.crewName ||
        comp.staffNumber !== selectedDelivery.crewStaffNumber;

      if (hasTextChanges) {
        promises.push(updateDelivery(flightId, selectedDeliveryId, payload));
      }

      const hasSignatureChanges =
        comp.signature && comp.signature !== selectedDelivery.crewSignature;

      if (hasSignatureChanges) {
        promises.push(
          addSignature(flightId, selectedDeliveryId, "crew", comp.signature!),
        );
      }

      try {
        await Promise.all(promises);
      } catch (err) {
        console.error("Error saving Crew Declaration:", err);
        Alert.alert("Error", "Failed to save some changes.");
      }
    },
    [
      flightId,
      selectedDeliveryId,
      selectedDelivery,
      updateDelivery,
      addSignature,
    ],
  );

  const handleDriverComplianceUpdate = useCallback(
    async (decl: DriversDeclaration) => {
      if (!selectedDeliveryId || !selectedDelivery || !flightId) return;

      const promises = [];

      const payload: Partial<Delivery> = {
        driverName: decl.driverName,
        driverStaffId: decl.driverStaffId,
        truckSeal: decl.truckSeal,
        driverCompany: decl.driverCompany,
        driverSignatureTimestampDisplay: decl.signedAt
          ? decl.signedAt.toISOString()
          : null,
      };

      const hasTextChanges =
        decl.driverName !== selectedDelivery.driverName ||
        decl.driverStaffId !== selectedDelivery.driverStaffId ||
        decl.truckSeal !== selectedDelivery.truckSeal ||
        decl.driverCompany !== selectedDelivery.driverCompany;

      if (hasTextChanges) {
        promises.push(updateDelivery(flightId, selectedDeliveryId, payload));
      }

      const hasSignatureChanges =
        decl.signature && decl.signature !== selectedDelivery.driverSignature;

      if (hasSignatureChanges) {
        promises.push(
          addSignature(flightId, selectedDeliveryId, "driver", decl.signature!),
        );
      }

      try {
        await Promise.all(promises);
      } catch (err) {
        console.error("Error saving driver declaration:", err);
        Alert.alert("Error", "Failed to save some changes.");
      }
    },
    [
      flightId,
      selectedDeliveryId,
      selectedDelivery,
      updateDelivery,
      addSignature,
    ],
  );

  const handleUpdatePreparerSignature = useCallback(
    (preparerId: string, signature: string) => {
      if (!selectedDeliveryId || !flightId) return;

      if (preparerId.endsWith("-driver")) {
        addSignature(flightId, selectedDeliveryId, "driver", signature);
      } else if (preparerId.endsWith("-crew")) {
        addSignature(flightId, selectedDeliveryId, "crew", signature);
      } else if (preparerId.endsWith("-security")) {
        updateDelivery(flightId, selectedDeliveryId, {
          tsaSignature: signature,
          tsaSignatureTimestampDisplay: new Date().toISOString(),
        });
      } else if (preparerId.endsWith("-sec")) {
        addSignature(flightId, selectedDeliveryId, "security", signature);
      }
    },
    [flightId, selectedDeliveryId, addSignature, updateDelivery],
  );

  const handleDeletePreparer = useCallback(
    (id: string) => {
      if (!selectedDeliveryId || !flightId) return;

      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to remove this preparer?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              const payload: Partial<Delivery> = {};

              if (id.endsWith("-security")) {
                payload.tsaName = "";
                payload.tsaRacNumber = "";
                payload.tsaComment = "";
                payload.tsaSignature = "";
              } else if (id.endsWith("-sec")) {
                payload.securityName = "";
                payload.securityRacNumber = "";
                payload.securityComment = "";
                payload.securitySignature = null;
              } else if (id.endsWith("-driver")) {
                payload.driverName = "";
                payload.driverStaffId = "";
                payload.driverCompany = "";
                payload.driverSignature = null;
                payload.truckSeal = "";
              } else if (id.endsWith("-crew")) {
                payload.crewName = "";
                payload.airCrewRepresentative = "";
                payload.crewStaffNumber = "";
                payload.crewSignature = null;
              }

              updateDelivery(flightId, selectedDeliveryId, payload);
            },
          },
        ],
      );
    },
    [flightId, selectedDeliveryId, updateDelivery],
  );

  // 5. Render
  return (
    <View className="flex-1 flex-row bg-bg-surface">
      {/* Sidebar */}
      <View className="w-[260px] border-r border-border-muted p-4 bg-bg-surface">
        <View className="pb-4 border-b border-border-muted mb-4">
          <Text className="text-lg font-semibold text-text-primary mb-3">
            Deliveries ({deliveries.length})
          </Text>
          <AppButton
            title="Add New Delivery"
            onPress={handleAddNewDelivery}
            disabled={isLoading}
            type="secondary"
            IconComponent={
              AddIcon ? (
                <AddIcon width={16} height={16} />
              ) : (
                <Text className="text-lg">+</Text>
              )
            }
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderRadius: 8,
            }}
            textStyle={{
              fontSize: 14,
            }}
          />
        </View>

        <ScrollView className="flex-1">
          {deliveries.map((delivery) => (
            <Pressable
              key={delivery.id}
              onPress={() => selectDelivery(delivery.id)}
              onLongPress={() => handleDeleteDelivery(delivery.id)}
              className={`p-3 rounded-lg mb-2 ${
                selectedDeliveryId === delivery.id
                  ? "bg-bg-accent border border-bg-primary"
                  : "bg-bg-tertiary"
              }`}
            >
              <Text
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

      <View className="flex-1 flex-col">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#602AF3" />
            <Text className="text-text-tertiary mt-4">Loading...</Text>
          </View>
        ) : selectedDelivery ? (
          <>
            <View className="p-4 pb-0 bg-bg-surface h-[60px] w-auto">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  backgroundColor: "#f0f0f0",
                  borderRadius: 25,
                  padding: 1,
                  alignItems: "center",
                  minWidth: "100%",
                  justifyContent: "space-between",
                }}
              >
                <TabButton
                  title="Security Seals"
                  active={activeTab === "preparers"}
                  onPress={() => setActiveTab("preparers")}
                />
                <TabButton
                  title="Security Declaration"
                  active={activeTab === "security"}
                  onPress={() => setActiveTab("security")}
                />
                <TabButton
                  title="Driver Declaration"
                  active={activeTab === "driver"}
                  onPress={() => setActiveTab("driver")}
                />
                <TabButton
                  title="Crew Declaration"
                  active={activeTab === "crew"}
                  onPress={() => setActiveTab("crew")}
                />
              </ScrollView>
            </View>

            <View className="flex-1 p-4 bg-bg-surface">
              {activeTab === "dispatcher" && <DispatcherCommentsTab />}

              {activeTab === "preparers" && flightId && (
                <ContentPreparersTab
                  flightId={flightId}
                  deliveryId={selectedDelivery.id}
                  onDeletePreparer={handleDeletePreparer}
                  onUpdateSignature={handleUpdatePreparerSignature}
                />
              )}

              {activeTab === "security" && securityCompliance && (
                <SecurityComplianceTab
                  securityCompliance={securityCompliance}
                  onUpdateCompliance={handleSecurityComplianceUpdate}
                />
              )}

              {activeTab === "driver" && driversDeclaration && (
                <DriversDeclarationTab
                  driversDeclaration={driversDeclaration}
                  onUpdateDeclaration={handleDriverComplianceUpdate}
                />
              )}

              {activeTab === "crew" && crewCompliance && (
                <CrewComplianceTab
                  crewCompliance={crewCompliance}
                  onUpdateCompliance={handleCrewComplianceUpdate}
                />
              )}
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-text-tertiary mb-2">
              No delivery selected
            </Text>
            <Text className="text-3xl text-text-tertiary">
              Add a new delivery or select one
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DeliveriesScreen;
