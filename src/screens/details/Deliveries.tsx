import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

import { DeliveryContent } from "../../components/deliveries/DeliveryContent";
import { DeliverySidebar } from "../../components/deliveries/DeliverySidebar";
import {
  DeliveryTabs,
  TabType,
} from "../../components/deliveries/DeliveryTabs";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { useFlightStore } from "../../store/useFlightStore";
import {
  CrewCompliance,
  Delivery,
  DriversDeclaration,
  SecurityCompliance,
} from "../../types/deliveries";
import {
  getCrewCompliance,
  getDriversDeclaration,
  getSecurityCompliance,
} from "../../utils/deliveriesHelper";
import { log } from "../../utils/logger";

const DeliveriesScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
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
  const [isAutoSelecting, setIsAutoSelecting] = useState(false);
  const [hasInitialFetched, setHasInitialFetched] = useState(false);
  const lastHandledParamRef = React.useRef<string | null>(null);

  // Reset fetch state on flight change
  useEffect(() => {
    setHasInitialFetched(false);
  }, [flightId]);

  // Handle auto-open driver declaration from navigation params
  useEffect(() => {
    const params = route.params;
    const openParam = params?.openDriverDeclaration;

    // We use a unique key to track if we've already handled this redirection request
    const paramKey = openParam ? `${flightId}-open` : null;

    if (
      openParam &&
      flightId &&
      hasInitialFetched &&
      lastHandledParamRef.current !== paramKey
    ) {
      if (!isLoading) {
        if (deliveries.length === 0) {
          if (!isAutoSelecting) {
            setIsAutoSelecting(true);
            const name = "Delivery 1";
            createDelivery(flightId, name);
          }
        } else {
          // Select latest delivery
          const latestDelivery = deliveries[deliveries.length - 1];
          // Always ensure the tab is set
          setActiveTab("driver");

          if (selectedDeliveryId !== latestDelivery.id) {
            selectDelivery(latestDelivery.id);
          }

          // Mark as handled before clearing param to avoid loops
          lastHandledParamRef.current = paramKey;
          setIsAutoSelecting(false);
          navigation.setParams({ openDriverDeclaration: undefined } as any);
        }
      }
    } else if (!openParam) {
      // Reset ref when param is gone
      lastHandledParamRef.current = null;
    }
  }, [
    route.params,
    deliveries,
    isLoading,
    flightId,
    createDelivery,
    selectDelivery,
    selectedDeliveryId,
    navigation,
    isAutoSelecting,
    hasInitialFetched,
  ]);

  useEffect(() => {
    if (flightId) {
      fetchDeliveries(flightId).finally(() => setHasInitialFetched(true));
    }
  }, [flightId, fetchDeliveries]);

  useEffect(() => {
    if (error) Alert.alert("Error", error);
  }, [error]);

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

  const handleAddNewDelivery = useCallback(() => {
    if (flightId) {
      const name = `Delivery ${deliveries.length + 1}`;
      createDelivery(flightId, name);
    }
  }, [flightId, deliveries.length, createDelivery]);

  const handleDeleteDelivery = useCallback(
    (deliveryId: string) => {
      if (!flightId) return;
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

      if (
        comp.provider !== selectedDelivery.securityProvider ||
        comp.name !== selectedDelivery.securityName ||
        comp.staffNumber !== selectedDelivery.securityStaffNumber ||
        comp.position !== selectedDelivery.securityPosition
      ) {
        promises.push(updateDelivery(flightId, selectedDeliveryId, payload));
      }

      if (
        comp.signature &&
        comp.signature !== selectedDelivery.securitySignature
      ) {
        promises.push(
          addSignature(
            flightId,
            selectedDeliveryId,
            "security",
            comp.signature,
          ),
        );
      }

      try {
        await Promise.all(promises);
      } catch (err) {
        log.error("Error saving Security Declaration:", err);
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

      if (
        comp.airCrewRepresentative !== selectedDelivery.airCrewRepresentative ||
        comp.crewName !== selectedDelivery.crewName ||
        comp.staffNumber !== selectedDelivery.crewStaffNumber
      ) {
        promises.push(updateDelivery(flightId, selectedDeliveryId, payload));
      }

      if (comp.signature && comp.signature !== selectedDelivery.crewSignature) {
        promises.push(
          addSignature(flightId, selectedDeliveryId, "crew", comp.signature),
        );
      }

      try {
        await Promise.all(promises);
      } catch (err) {
        log.error("Error saving Crew Declaration:", err);
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

      if (
        decl.driverName !== selectedDelivery.driverName ||
        decl.driverStaffId !== selectedDelivery.driverStaffId ||
        decl.truckSeal !== selectedDelivery.truckSeal ||
        decl.driverCompany !== selectedDelivery.driverCompany
      ) {
        promises.push(updateDelivery(flightId, selectedDeliveryId, payload));
      }

      if (
        decl.signature &&
        decl.signature !== selectedDelivery.driverSignature
      ) {
        promises.push(
          addSignature(flightId, selectedDeliveryId, "driver", decl.signature),
        );
      }

      try {
        await Promise.all(promises);
      } catch (err) {
        log.error("Error saving driver declaration:", err);
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
      if (preparerId.endsWith("-driver"))
        addSignature(flightId, selectedDeliveryId, "driver", signature);
      else if (preparerId.endsWith("-crew"))
        addSignature(flightId, selectedDeliveryId, "crew", signature);
      else if (preparerId.endsWith("-security"))
        updateDelivery(flightId, selectedDeliveryId, {
          tsaSignature: signature,
          tsaSignatureTimestampDisplay: new Date().toISOString(),
        });
      else if (preparerId.endsWith("-sec"))
        addSignature(flightId, selectedDeliveryId, "security", signature);
    },
    [flightId, selectedDeliveryId, addSignature, updateDelivery],
  );

  const { deleteUserSignature } = useFlightPreparationStore();

  const handleDeletePreparer = useCallback(
    async (id: string) => {
      if (!selectedDeliveryId || !flightId) return;
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          id,
        );

      if (isUuid) {
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this signature?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                const success = await deleteUserSignature(flightId, id);
                if (success) {
                  Alert.alert("Success", "Signature deleted successfully");
                } else {
                  Alert.alert("Error", "Failed to delete signature");
                }
              },
            },
          ],
        );
        return;
      }

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
    [flightId, selectedDeliveryId, updateDelivery, deleteUserSignature],
  );

  return (
    <View className="flex-1 flex-col lg:flex-row bg-bg-surface">
      <DeliverySidebar
        deliveries={deliveries}
        selectedDeliveryId={selectedDeliveryId}
        isLoading={isLoading}
        onSelect={selectDelivery}
        onAdd={handleAddNewDelivery}
        onDelete={handleDeleteDelivery}
      />

      <View className="flex-1 flex-col">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#602AF3" />
            <Text className="text-text-tertiary mt-4">Loading...</Text>
          </View>
        ) : selectedDelivery && flightId ? (
          <>
            <DeliveryTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <DeliveryContent
              activeTab={activeTab}
              flightId={flightId}
              selectedDelivery={selectedDelivery}
              securityCompliance={securityCompliance}
              driversDeclaration={driversDeclaration}
              crewCompliance={crewCompliance}
              onDeletePreparer={handleDeletePreparer}
              onUpdateSignature={handleUpdatePreparerSignature}
              onSecurityUpdate={handleSecurityComplianceUpdate}
              onDriverUpdate={handleDriverComplianceUpdate}
              onCrewUpdate={handleCrewComplianceUpdate}
            />
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
