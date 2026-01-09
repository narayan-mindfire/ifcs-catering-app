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

import { PreparationsModals } from "../../components/preparation/PreparationModal";
import {
  ParsedQRData,
  PreparationsHeader,
  ScanActionType,
} from "../../components/preparation/PreparationsHeader";
import { PreparationsList } from "../../components/preparation/PreparationsList";
import { usePreparationActions } from "../../hooks/usePreparationActions";
import { usePreparationData } from "../../hooks/usePreparationData";
import { usePreparationModals } from "../../hooks/usePreparationModals";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuthStore } from "../../store/useAuthStore";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { useFlightStore } from "../../store/useFlightStore";
import { useScannerStore } from "../../store/useScannerStore";
import { PreparationItem } from "../../types/preparations";
import { log } from "../../utils/logger";

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
  } = useFlightPreparationStore();

  const { deliveries, selectedDeliveryId, fetchDeliveries, createDelivery } =
    useDeliveryStore();

  const { userId } = useAuthStore();

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [hasUserSignature, setHasUserSignature] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ FIX: Use Ref to hold data across async closures (Alerts/Timeouts)
  const pendingOldFlightDataRef = useRef<ParsedQRData | null>(null);

  // Keep State for UI/Modals updates
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
  });

  useEffect(() => {
    if (selectedFlight?.id) {
      fetchPreparations(selectedFlight.id);
      fetchDeliveries(selectedFlight.id);
    }
  }, [selectedFlight?.id, fetchPreparations, fetchDeliveries]);

  useEffect(() => {
    const checkSignature = async () => {
      if (selectedFlight?.id && deliveries.length > 0) {
        const deliveryId = selectedDeliveryId || deliveries[0].id;
        const hasSignature = await checkUserSignature(
          selectedFlight.id,
          deliveryId,
          userId,
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
    userId,
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
      if (!selectedFlight?.id) return;
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
          userId,
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
      userId,
    ],
  );

  const handleSaveSealNumber = useCallback(
    async (sealNumber: number) => {
      modals.closeSeal();
      if (!modals.currentActionItem || !selectedFlight?.id) return;
      const success = await updatePreparationFlag(
        selectedFlight.id,
        modals.currentActionItem.id,
        { action: "seal", sealTagNumber: sealNumber },
      );
      if (success) Alert.alert("Success", `Seal applied: ${sealNumber}`);
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
        console.error("Invalid QR data format - insufficient lines");
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
      };
    } catch (error) {
      console.error("Error parsing QR data:", error);
      return null;
    }
  };

  const handleScanPress = (actionType: ScanActionType) => {
    // Set the callback in the global store
    useScannerStore.getState().setOnScan((data) => {
      if (actionType) {
        const parsedData = parseQRData(data);
        if (parsedData) {
          handleScanAction(actionType, parsedData);
        } else {
          Alert.alert("Error", "Invalid QR code format");
        }
      }
    });

    navigation.navigate("QRCodeScanner", {
      title: getScannerTitle(actionType),
      continuous: true,
    });
  };

  // Helper for title (modified to take arg)
  const getScannerTitle = (action: ScanActionType) => {
    switch (action) {
      case "prep":
        return "Scan item to mark as prepared";
      case "seal":
        return "Scan item to verify seal";
      case "assemble":
        return "Scan item to mark as assembled";
      case "load":
        return "Scan item to mark as loaded";
      default:
        return "Align QR code within the frame";
    }
  };

  // Step 1: Initial Scan
  const handleScanAction = useCallback(
    async (
      actionType: "prep" | "seal" | "assemble" | "load" | "consumption",
      scannedData: ParsedQRData,
    ) => {
      log.info("Scan 1 Received:", actionType, scannedData);
      setRefreshKey((prev) => prev + 1);

      // PREP ACTION: Check Flight Match
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
          log.info("Old Flight Detected. Starting Step 2 (Scan Current).");

          // 1. Store Old Data Reference (Sync Ref & State)
          setPendingOldFlightData(scannedData);
          pendingOldFlightDataRef.current = scannedData;

          // 2. IMMEDIATELY Open Verification Scanner
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
        case "assemble":
          await actions.handleAssemblyAction(item);
          break;
        case "load":
          await actions.handleLoadAction(item);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [findPreparationItem, actions, selectedFlight?.id, navigation],
  );

  // Step 2: Verification Scan (Scan 2)
  const handleVerifyScan = useCallback(
    async (data: string) => {
      const lines = data.split("\n");
      if (lines.length < 2) return;

      const scannedCurrentPrepId = lines[0]?.trim();
      const scannedFlightId = lines[1]?.trim();

      // VALIDATION: Must match CURRENT flight
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

      log.info("Current Flight Verified. Fetching Old Data...");
      setPendingCurrentItem(currentItem);

      // ✅ FIX: Read from Ref instead of State to avoid stale closure
      const oldData = pendingOldFlightDataRef.current;

      if (oldData) {
        log.info("back up", oldData);
        navigation.goBack(); // Close Scanner
        log.info("BACKED - Opening Modal");

        await fetchPreparationById(oldData.flightId, oldData.flightPrepId);

        modals.openDetailModal({
          id: oldData.flightPrepId,
          ...oldData,
        } as any);
      } else {
        log.error("REF LOST - Data unavailable");
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

  // Step 3: Finish & Link (Triggered by Modal Button)
  const handleFinishConsumption = useCallback(async () => {
    modals.closeDetailModal();

    const oldData = pendingOldFlightDataRef.current; // Read from Ref

    if (!selectedFlight?.id || !oldData || !pendingCurrentItem) {
      setPendingOldFlightData(null);
      pendingOldFlightDataRef.current = null;
      setPendingCurrentItem(null);
      return;
    }

    log.info("Finalizing Consumption Flow...");

    // 1. Mark Current as Prepared
    await actions.handlePreparedAction(pendingCurrentItem);

    // 2. Link Old Prep to Current Prep
    const linkSuccess = await linkPriorPrep(
      selectedFlight.id,
      pendingCurrentItem.id, // Current
      oldData.flightPrepId, // Prior
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
          // We use State here for UI reactivity, which updates fine on re-renders
          isConsumptionMode={!!pendingOldFlightData && !!pendingCurrentItem}
          consumptionFlightId={pendingOldFlightData?.flightId}
          onFinishConsumption={handleFinishConsumption}
        />
      </Suspense>

      <PreparationsHeader
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        onToggleFilter={handleToggleFilter}
        selectedFlight={selectedFlight}
        onScanPress={handleScanPress}
      />

      <PreparationsList
        isLoading={isLoading}
        sectionedData={sectionedData}
        isUpdating={isUpdating}
        actions={actions}
      />
    </View>
  );
};
