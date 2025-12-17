import React, { Suspense, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import { useDeliveryStore } from "../../store/useDeliveryStore";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { useFlightStore } from "../../store/useFlightStore";
import { usePreparationActions } from "../../hooks/usePreparationActions";
import { usePreparationData } from "../../hooks/usePreparationData";
import { usePreparationModals } from "../../hooks/usePreparationModals";
import { PreparationsList } from "../../components/preparation/PreparationsList";
import { PreparationsHeader } from "../../components/preparation/PreparationsHeader";
import { PreparationsModals } from "../../components/preparation/PreparationModal";

const CURRENT_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

export const PreparationsScreen: React.FC = () => {
  const selectedFlight = useFlightStore((state) => state.selectedFlight);
  const {
    preparations,
    isLoading,
    fetchPreparations,
    printPreparation,
    isPrinting,
    updatePreparationFlag,
    isUpdating,
    checkUserSignature,
    addUserSignature,
  } = useFlightPreparationStore();
  const { deliveries, selectedDeliveryId, fetchDeliveries, createDelivery } =
    useDeliveryStore();

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [hasUserSignature, setHasUserSignature] = useState(false);

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
          CURRENT_USER_ID,
        );
        setHasUserSignature(hasSignature);
      }
    };

    if (deliveries.length > 0) {
      checkSignature();
    }
  }, [deliveries, selectedFlight?.id, selectedDeliveryId, checkUserSignature]);

  const handleToggleFilter = useCallback((option: string) => {
    setSelectedFilters((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  }, []);

  const handlePrint = useCallback(async () => {
    if (!selectedFlight?.id) {
      Alert.alert("Error", "No flight selected.");
      return;
    }

    const result = await printPreparation(selectedFlight.id);

    if (result.success && result.fileUrl) {
      modals.openPdf({ uri: result.fileUrl, cache: true });
    } else {
      Alert.alert(
        "Print Error",
        result.error || "Failed to generate print document.",
      );
    }
  }, [selectedFlight?.id, printPreparation, modals]);

  const handleSaveSignature = useCallback(
    async (signature: string) => {
      modals.closeSignature();

      if (!selectedFlight?.id) {
        Alert.alert("Error", "No flight selected");
        modals.clearCurrentAction();
        return;
      }

      let deliveryId = selectedDeliveryId || deliveries[0]?.id;

      if (!deliveryId) {
        try {
          await createDelivery(selectedFlight.id, "Default Delivery");
          await new Promise((resolve) => setTimeout(resolve, 500));
          const newDeliveries = useDeliveryStore.getState().deliveries;
          deliveryId = newDeliveries[0]?.id;
          if (!deliveryId) throw new Error("Delivery creation failed");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          Alert.alert("Error", "Failed to create delivery");
          modals.clearCurrentAction();
          return;
        }
      }

      const success = await addUserSignature(
        selectedFlight.id,
        deliveryId,
        CURRENT_USER_ID,
        signature,
      );

      if (success) {
        setHasUserSignature(true);
        Alert.alert("Success", "Signature saved successfully");
        if (modals.currentActionItem) {
          modals.openSeal();
        }
      } else {
        Alert.alert("Error", "Failed to save signature. Please try again.");
        modals.clearCurrentAction();
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
        {
          action: "seal",
          sealTagNumber: sealNumber,
        },
      );

      if (success) {
        Alert.alert("Success", `Seal applied with tag number: ${sealNumber}`);
      }
      modals.clearCurrentAction();
    },
    [modals, selectedFlight?.id, updatePreparationFlag],
  );

  return (
    <View className="flex-1 bg-bg-surface p-4">
      <Suspense fallback={<ActivityIndicator size="small" color="#B79EFA" />}>
        <PreparationsModals
          modals={modals}
          selectedFlight={selectedFlight}
          onSaveSignature={handleSaveSignature}
          onSaveSealNumber={handleSaveSealNumber}
        />
      </Suspense>

      <PreparationsHeader
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        onToggleFilter={handleToggleFilter}
        onPrint={handlePrint}
        isPrinting={isPrinting}
        selectedFlight={selectedFlight}
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
