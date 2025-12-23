import React, { Suspense, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, View } from "react-native";

import { QRScanner } from "../../components/common/QRScanner";
import { PreparationsModals } from "../../components/preparation/PreparationModal";
import {
  ParsedQRData,
  PreparationsHeader,
} from "../../components/preparation/PreparationsHeader";
import { PreparationsList } from "../../components/preparation/PreparationsList";
import { usePreparationActions } from "../../hooks/usePreparationActions";
import { usePreparationData } from "../../hooks/usePreparationData";
import { usePreparationModals } from "../../hooks/usePreparationModals";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { useFlightStore } from "../../store/useFlightStore";
import { PreparationItem } from "../../types/preparations";
import { log } from "../../utils/logger";

const CURRENT_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

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

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [hasUserSignature, setHasUserSignature] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // --- Consumption Flow State ---
  // Data from Scan 1 (Old Flight)
  const [pendingOldFlightData, setPendingOldFlightData] =
    useState<ParsedQRData | null>(null);

  // Data from Scan 2 (Current Flight Item)
  const [pendingCurrentItem, setPendingCurrentItem] =
    useState<PreparationItem | null>(null);

  // Controls the Step 2 Scanner
  const [isVerifyScannerVisible, setIsVerifyScannerVisible] = useState(false);

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

  // --- Effects ---
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
          CURRENT_USER_ID,
        );
        setHasUserSignature(hasSignature);
      }
    };
    if (deliveries.length > 0) checkSignature();
  }, [deliveries, selectedFlight?.id, selectedDeliveryId, checkUserSignature]);

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
          CURRENT_USER_ID,
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

  const findPreparationItem = useCallback(
    (flightPrepId: string) => {
      return preparations.find((prep) => prep.id === flightPrepId);
    },
    [preparations],
  );

  // --- CONSUMPTION FLOW LOGIC ---

  // Step 1: Initial Scan (Prep)
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
          log.info("⚠️ Old Flight Detected. Starting Step 2 (Scan Current).");

          // 1. Store Old Data Reference
          setPendingOldFlightData(scannedData);

          // 2. IMMEDIATELY Open Verification Scanner (Step 2)
          // We use a timeout to allow the previous scanner modal (from header) to close smoothly
          setTimeout(() => {
            Alert.alert(
              "Verify Current Flight",
              "You scanned an OLD flight label.\n\nPlease scan the CURRENT flight label now to confirm linking.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: () => setPendingOldFlightData(null),
                },
                {
                  text: "Scan Now",
                  onPress: () => setIsVerifyScannerVisible(true),
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
    [findPreparationItem, actions, selectedFlight?.id],
  );

  // Step 2: Verification Scan (Scan 2)
  const handleVerifyScan = async (data: string) => {
    const lines = data.split("\n");
    if (lines.length < 2) return;

    const scannedCurrentPrepId = lines[0]?.trim();
    const scannedFlightId = lines[1]?.trim();

    // 🚨 VALIDATION: Must match CURRENT flight 🚨
    if (scannedFlightId !== selectedFlight?.id) {
      Alert.alert(
        "Mismatch",
        "Wrong Flight! Please scan the label for the CURRENT flight.",
      );
      return;
    }

    // Find the item in our current list
    const currentItem = findPreparationItem(scannedCurrentPrepId);
    if (!currentItem) {
      Alert.alert("Error", "Scanned item not found in current flight list.");
      return;
    }

    log.info("✅ Current Flight Verified. Fetching Old Data...");

    // Close Scanner
    setIsVerifyScannerVisible(false);

    // Store Current Item for later use in Step 3
    setPendingCurrentItem(currentItem);

    // Fetch Old Data & Open Modal
    if (pendingOldFlightData) {
      await fetchPreparationById(
        pendingOldFlightData.flightId,
        pendingOldFlightData.flightPrepId,
      );

      modals.openDetailModal({
        id: pendingOldFlightData.flightPrepId,
        ...pendingOldFlightData,
      } as any);
    }
  };

  // Step 3: Finish & Link (Triggered by Modal Button)
  const handleFinishConsumption = useCallback(async () => {
    modals.closeDetailModal();

    if (!selectedFlight?.id || !pendingOldFlightData || !pendingCurrentItem) {
      // Safety check
      setPendingOldFlightData(null);
      setPendingCurrentItem(null);
      return;
    }

    log.info("🎬 Finalizing Consumption Flow...");

    // 1. Mark Current as Prepared
    await actions.handlePreparedAction(pendingCurrentItem);

    // 2. Link Old Prep to Current Prep
    const linkSuccess = await linkPriorPrep(
      selectedFlight.id,
      pendingCurrentItem.id, // Current
      pendingOldFlightData.flightPrepId, // Prior
    );

    if (linkSuccess) {
      // Refresh Data
      await fetchPreparations(selectedFlight.id);
      Alert.alert(
        "✅ Complete",
        "Items linked and preparation marked as complete.",
      );
    } else {
      Alert.alert(
        "⚠️ Warning",
        "Preparation marked, but linking prior flight failed.",
      );
    }

    // Cleanup
    setPendingOldFlightData(null);
    setPendingCurrentItem(null);
  }, [
    modals,
    selectedFlight?.id,
    pendingOldFlightData,
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
          // Modal logic relies on having BOTH old data (for display) and current item (for linking context)
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
        onScanAction={handleScanAction}
      />

      <PreparationsList
        isLoading={isLoading}
        sectionedData={sectionedData}
        isUpdating={isUpdating}
        actions={actions}
      />

      {/* Step 2 Scanner */}
      <Modal visible={isVerifyScannerVisible} animationType="slide">
        <QRScanner
          onScan={handleVerifyScan}
          scanned={false}
          onClose={() => {
            setIsVerifyScannerVisible(false);
            setPendingOldFlightData(null); // Cancel entire flow if scan is cancelled
          }}
          title="Scan CURRENT Flight Label to Confirm"
        />
      </Modal>
    </View>
  );
};
