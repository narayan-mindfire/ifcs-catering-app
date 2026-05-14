import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { PreparationsModals } from "@/components/preparation/PreparationModal";
import {
  ParsedQRData,
  PreparationsHeader,
  ScanActionType,
} from "@/components/preparation/PreparationsHeader";
import { PreparationsList } from "@/components/preparation/PreparationsList";
import { TruckSelectionModal } from "@/components/preparation/TruckSelectionModal";
import { RootStackParamList } from "@/navigation/AppNavigator";
import { useAuthStore } from "@/store/useAuthStore";
import { useDeliveryStore } from "@/store/useDeliveryStore";
import { useFlightPreparationStore } from "@/store/useFlightPreparationStore";
import { useFlightStore } from "@/store/useFlightStore";
import { useScannerStore } from "@/store/useScannerStore";
import { PreparationItem } from "@/types/preparations";
import { log } from "@/utils/logger";

import { usePreparationActions } from "../../hooks/usePreparationActions";
import { usePreparationData } from "../../hooks/usePreparationData";
import { usePreparationModals } from "../../hooks/usePreparationModals";

export const PreparationsScreen: React.FC = () => {
  const selectedFlight = useFlightStore((state) => state.selectedFlight);
  const {
    preparations,
    isLoading,
    fetchPreparations,
    updatePreparationFlag,
    isUpdating,
    checkUserSignature,
    addUserSignature,
    linkPriorPrep,
    fetchPreparationById,
    trucks,
  } = useFlightPreparationStore(
    useShallow((state) => ({
      preparations: state.preparations,
      isLoading: state.isLoading,
      fetchPreparations: state.fetchPreparations,
      updatePreparationFlag: state.updatePreparationFlag,
      isUpdating: state.isUpdating,
      checkUserSignature: state.checkUserSignature,
      addUserSignature: state.addUserSignature,
      linkPriorPrep: state.linkPriorPrep,
      fetchPreparationById: state.fetchPreparationById,
      trucks: state.trucks,
    })),
  );

  const { deliveries, selectedDeliveryId, fetchDeliveries, createDelivery } =
    useDeliveryStore(
      useShallow((state) => ({
        deliveries: state.deliveries,
        selectedDeliveryId: state.selectedDeliveryId,
        fetchDeliveries: state.fetchDeliveries,
        createDelivery: state.createDelivery,
      })),
    );

  const { user } = useAuthStore();

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [hasUserSignature, setHasUserSignature] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const pendingOldFlightDataRef = useRef<ParsedQRData | null>(null);

  const [pendingOldFlightData, setPendingOldFlightData] =
    useState<ParsedQRData | null>(null);

  const [pendingCurrentItem, setPendingCurrentItem] =
    useState<PreparationItem | null>(null);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const modals = usePreparationModals();
  const { filterOptions, sectionedData } = usePreparationData(
    preparations,
    selectedFilters,
  );
  const actions = usePreparationActions({
    selectedFlight,
    updatePreparationFlag,
    hasUserSignature,
    modals,
    trucks,
    currentUser: user,
  });

  useEffect(() => {
    if (selectedFlight?.id) {
      fetchPreparations(selectedFlight.id);
      fetchDeliveries(selectedFlight.id);
    }
  }, [selectedFlight?.id, fetchPreparations, fetchDeliveries]);

  useEffect(() => {
    const checkSignature = async () => {
      if (selectedFlight?.id && deliveries.length > 0 && user?.id) {
        const deliveryId = selectedDeliveryId || deliveries[0].id;
        const hasSignature = await checkUserSignature(
          selectedFlight.id,
          deliveryId,
          user.id,
        );
        setHasUserSignature(hasSignature);
      }
    };
    if (deliveries.length > 0) checkSignature();
  }, [
    deliveries,
    selectedFlight?.id,
    selectedDeliveryId,
    checkUserSignature,
    user?.id,
  ]);

  const handleToggleFilter = useCallback((option: string) => {
    setSelectedFilters((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  }, []);

  const handleSaveSignature = useCallback(
    async (signature: string) => {
      modals.closeSignature();
      if (!selectedFlight?.id || !user?.id) return;
      let deliveryId = selectedDeliveryId || deliveries[0]?.id;
      if (!deliveryId) {
        try {
          await createDelivery(selectedFlight.id, "Default Delivery");
          await new Promise((resolve) => setTimeout(resolve, 500));
          deliveryId = useDeliveryStore.getState().deliveries[0]?.id;
        } catch {
          return;
        }
      }
      if (
        await addUserSignature(
          selectedFlight.id,
          deliveryId!,
          user.id,
          signature,
        )
      ) {
        setHasUserSignature(true);
        if (modals.currentActionItem) modals.openSeal(modals.currentActionItem);
      }
    },
    [
      selectedFlight?.id,
      selectedDeliveryId,
      deliveries,
      modals,
      createDelivery,
      addUserSignature,
      user?.id,
    ],
  );

  const handleSaveSealNumber = useCallback(
    async (sealNumber: number) => {
      modals.closeSeal();
      if (!modals.currentActionItem || !selectedFlight?.id) return;
      await updatePreparationFlag(
        selectedFlight.id,
        modals.currentActionItem.id,
        { action: "seal", sealTagNumber: sealNumber },
      );
      modals.clearCurrentAction();
    },
    [modals, selectedFlight?.id, updatePreparationFlag],
  );

  const handleSaveLockNumber = useCallback(
    async (lockNumber: number) => {
      modals.closeLock();
      if (!modals.currentActionItem || !selectedFlight?.id) return;
      const success = await updatePreparationFlag(
        selectedFlight.id,
        modals.currentActionItem.id,
        { action: "lock", lockTagNumber: lockNumber },
      );
      if (success) Alert.alert("Success", `Lock applied: ${lockNumber}`);
      modals.clearCurrentAction();
    },
    [modals, selectedFlight?.id, updatePreparationFlag],
  );

  const findPreparationItem = useCallback(
    (flightPrepId: string) => {
      return preparations.find((prep) => prep.id === flightPrepId);
    },
    [preparations],
  );

  const parseQRData = (rawData: string): ParsedQRData | null => {
    try {
      const lines = rawData
        .trim()
        .split("\n")
        .filter((line) => line.trim() !== "");

      if (lines.length < 12) {
        return null;
      }

      return {
        flightPrepId: lines[0].trim(),
        flightId: lines[1].trim(),
        flightPrepPackingStandardId: lines[2].trim(),
        galleyConfigId: lines[3].trim(),
        packingStandardId: lines[4].trim(),
        parentStorageId: lines[5].trim(),
        storageId: lines[6].trim(),
        prepName: lines[7].trim(),
        flightNumber: lines[8].trim(),
        position: lines[9].trim(),
        scheduledDepartUtc: lines[10].trim(),
        rotationCode: lines[11].trim(),
        prepNameRepeated: lines[12]?.trim() || "",
        loadingPlanValue: lines[13]?.trim() || "",
        consumptionFlag: lines[14]?.trim() || "",
      };
    } catch (error) {
      log.error("Error parsing QR data:", error);
      return null;
    }
  };

  const handleScanPress = (actionType: ScanActionType) => {
    if (actionType === "load") {
      if (!trucks || trucks.length === 0) {
        Alert.alert("Error", "No trucks assigned to this flight.");
        return;
      }

      if (trucks.length > 1) {
        modals.openTruckSelection();
        return;
      } else {
        // Only one truck, auto-select it
        const truck = trucks[0];
        const assignment = truck.dispatchAssignments?.[0];
        if (assignment) {
          const config = {
            truckId: truck.id,
            dispatchAssignmentId: assignment.id,
          };
          openScannerWithConfig(actionType, config);
        } else {
          Alert.alert("Error", "No assignment for the assigned truck.");
        }
        return;
      }
    }

    openScannerWithConfig(actionType);
  };

  const openScannerWithConfig = (
    actionType: ScanActionType,
    config?: { truckId: string; dispatchAssignmentId: string },
  ) => {
    useScannerStore.getState().setOnScan((data) => {
      const parsedData = parseQRData(data);
      if (parsedData) {
        handleScanAction(actionType, parsedData, config);
      } else {
        Alert.alert("Error", "Invalid QR code format");
      }
    });

    let subtitle = "";
    if (config && actionType === "load") {
      const truck = trucks?.find((t) => t.id === config.truckId);
      const driver = truck?.dispatchAssignments?.[0]?.assignedStaff?.find(
        (s) => s.role === "DRIVER",
      );
      if (truck) {
        const driverName = driver
          ? `${driver.firstName || ""} ${driver.lastName || ""}`.trim()
          : "";
        subtitle = `Truck: ${truck.assetName}${
          driverName ? ` • Driver: ${driverName}` : ""
        }`;
      }
    }

    navigation.navigate("QRCodeScanner", {
      title: getScannerTitle(actionType),
      subtitle,
      continuous: true,
    });
  };

  // Helper for title based on action type
  const getScannerTitle = (action: ScanActionType) => {
    switch (action) {
      case "prep":
        return "Scan item to mark as prepared";
      case "seal":
        return "Scan item to verify seal";
      case "lock":
        return "Scan item to verify lock";
      case "assemble":
        return "Scan item to mark as assembled";
      case "load":
        return "Scan item to mark as loaded";
      default:
        return "Align QR code within the frame";
    }
  };

  //Initial Scan
  const handleScanAction = useCallback(
    async (
      actionType:
        | "prep"
        | "seal"
        | "lock"
        | "assemble"
        | "load"
        | "consumption",
      scannedData: ParsedQRData,
      loadTruckConfig?: { truckId: string; dispatchAssignmentId: string },
    ) => {
      setRefreshKey((prev) => prev + 1);

      //Check Flight Match
      if (actionType === "prep") {
        // A. Current Flight -> Standard Prep
        if (scannedData.flightId === selectedFlight?.id) {
          const item = findPreparationItem(scannedData.flightPrepId);
          if (item) {
            await actions.handlePreparedAction(item);
          } else {
            Alert.alert("Error", "Item not found in current list.");
          }
          return;
        }

        // B. Mismatch -> OLD Flight Detected -> Start Consumption Flow
        else {
          //Store Old Data Reference (Sync Ref & State)
          setPendingOldFlightData(scannedData);
          pendingOldFlightDataRef.current = scannedData;

          //IMMEDIATELY Open Verification Scanner
          setTimeout(() => {
            Alert.alert(
              "Verify Current Flight",
              "You scanned an OLD flight label.\n\nPlease scan the CURRENT flight label now to confirm linking.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: () => {
                    setPendingOldFlightData(null);
                    pendingOldFlightDataRef.current = null;
                  },
                },
                {
                  text: "Scan Now",
                  onPress: () => {
                    useScannerStore
                      .getState()
                      .setOnScan((data) => handleVerifyScan(data));
                    navigation.navigate("QRCodeScanner", {
                      title: "Scan CURRENT Flight Label to Confirm",
                      continuous: true,
                    });
                  },
                },
              ],
            );
          }, 500);

          return;
        }
      }
      if (scannedData.flightId !== selectedFlight?.id) {
        Alert.alert(
          "Error",
          "Scanned item does not belong to the selected flight.",
        );
        return;
      }
      const item = findPreparationItem(scannedData.flightPrepId);
      if (!item) {
        Alert.alert("Not Found", "Item not found.");
        return;
      }

      switch (actionType) {
        case "seal":
          await actions.handleSealAction(item);
          break;
        case "lock":
          await actions.handleLockAction(item);
          break;
        case "assemble":
          await actions.handleAssemblyAction(item);
          break;
        case "load":
          await actions.handleLoadAction(item, loadTruckConfig);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [findPreparationItem, actions, selectedFlight?.id, navigation],
  );

  //Verification Scan
  const handleVerifyScan = useCallback(
    async (data: string) => {
      const lines = data.split("\n");
      if (lines.length < 2) return;

      const scannedCurrentPrepId = lines[0]?.trim();
      const scannedFlightId = lines[1]?.trim();

      if (scannedFlightId !== selectedFlight?.id) {
        Alert.alert(
          "Mismatch",
          "Wrong Flight! Please scan the label for the CURRENT flight.",
        );
        return;
      }

      const currentItem = findPreparationItem(scannedCurrentPrepId);
      if (!currentItem) {
        Alert.alert("Error", "Scanned item not found in current flight list.");
        return;
      }

      setPendingCurrentItem(currentItem);

      const oldData = pendingOldFlightDataRef.current;

      if (oldData) {
        navigation.goBack();

        await fetchPreparationById(oldData.flightId, oldData.flightPrepId);

        modals.openDetailModal({
          id: oldData.flightPrepId,
          ...oldData,
        } as any);
      } else {
        Alert.alert("Error", "Session lost. Please try scanning again.");
        navigation.goBack();
      }
    },
    [
      selectedFlight?.id,
      findPreparationItem,
      fetchPreparationById,
      modals,
      navigation,
    ],
  );

  //Finish & Link (Triggered by Modal Button)
  const handleFinishConsumption = useCallback(async () => {
    modals.closeDetailModal();

    const oldData = pendingOldFlightDataRef.current;

    if (!selectedFlight?.id || !oldData || !pendingCurrentItem) {
      setPendingOldFlightData(null);
      pendingOldFlightDataRef.current = null;
      setPendingCurrentItem(null);
      return;
    }

    await actions.handlePreparedAction(pendingCurrentItem);

    const linkSuccess = await linkPriorPrep(
      selectedFlight.id,
      pendingCurrentItem.id,
      oldData.flightPrepId,
    );

    if (linkSuccess) {
      await fetchPreparations(selectedFlight.id);
      Alert.alert(
        "Complete",
        "Items linked and preparation marked as complete.",
      );
    } else {
      Alert.alert(
        "Warning",
        "Preparation marked, but linking prior flight failed.",
      );
    }

    // Cleanup
    setPendingOldFlightData(null);
    pendingOldFlightDataRef.current = null;
    setPendingCurrentItem(null);
  }, [
    modals,
    selectedFlight?.id,
    pendingCurrentItem,
    actions,
    linkPriorPrep,
    fetchPreparations,
  ]);

  return (
    <View className="flex-1 bg-bg-surface p-4" key={refreshKey}>
      <Suspense fallback={<ActivityIndicator size="small" color="#B79EFA" />}>
        <PreparationsModals
          modals={modals}
          selectedFlight={selectedFlight}
          onSaveSignature={handleSaveSignature}
          onSaveSealNumber={handleSaveSealNumber}
          onSaveLockNumber={handleSaveLockNumber}
          isConsumptionMode={!!pendingOldFlightData && !!pendingCurrentItem}
          consumptionFlightId={pendingOldFlightData?.flightId}
          onFinishConsumption={handleFinishConsumption}
          labelData={pendingOldFlightData}
        />
      </Suspense>

      <PreparationsHeader
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        onToggleFilter={handleToggleFilter}
        selectedFlight={selectedFlight}
        onScanPress={handleScanPress}
        trucks={trucks}
      />

      <PreparationsList
        isLoading={isLoading}
        sectionedData={sectionedData}
        isUpdating={isUpdating}
        actions={actions}
      />

      <TruckSelectionModal
        isOpen={modals.truckModalVisible}
        onClose={() => modals.closeTruckSelection()}
        trucks={trucks}
        onSelect={(truckId, dispatchAssignmentId) => {
          modals.closeTruckSelection();
          const config = { truckId, dispatchAssignmentId };
          if (modals.currentActionItem) {
            actions.handleLoadAction(modals.currentActionItem, config);
          } else {
            openScannerWithConfig("load", config);
          }
        }}
      />
      <LoadingOverlay visible={isUpdating} />
    </View>
  );
};
