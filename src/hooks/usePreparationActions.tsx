import { useCallback } from "react";
import { Alert } from "react-native";
import { PreparationItem } from "../types/preparations";

interface UsePreparationActionsParams {
  selectedFlight: any;
  updatePreparationFlag: any;
  hasUserSignature: boolean;
  modals: any;
}

export const usePreparationActions = ({
  selectedFlight,
  updatePreparationFlag,
  hasUserSignature,
  modals,
}: UsePreparationActionsParams) => {
  const handleOpenPdf = useCallback(
    (item: PreparationItem) => {
      if (item.labelUrl) {
        modals.openPdf({ uri: item.labelUrl, cache: true });
      } else {
        Alert.alert(
          "No Label Available",
          "There is no label URL associated with this item.",
        );
      }
    },
    [modals],
  );

  const handlePreparedAction = useCallback(
    async (item: PreparationItem) => {
      if (!selectedFlight?.id) return;

      const isPrepared = !!item.isContentPrepared;
      const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";

      if (isPrepared) {
        if (isSealed) {
          modals.showValidationMessage(
            "Cannot disable preparation. Please remove seal first.",
          );
          return;
        }
        modals.openConfirm({
          title: "Disable Preparation",
          message: "Are you sure you want to mark this as not prepared?",
          actionType: "disable",
          onConfirm: async () => {
            modals.closeConfirm();
            const success = await updatePreparationFlag(
              selectedFlight.id,
              item.id,
              {
                action: "prepared",
                isContentPrepared: false,
              },
            );
            if (success) Alert.alert("Success", "Preparation status updated");
          },
        });
      } else {
        const success = await updatePreparationFlag(
          selectedFlight.id,
          item.id,
          {
            action: "prepared",
            isContentPrepared: true,
          },
        );
        if (success) Alert.alert("Success", "Marked as prepared");
      }
    },
    [selectedFlight?.id, updatePreparationFlag, modals],
  );

  const handleSealAction = useCallback(
    async (item: PreparationItem) => {
      if (!selectedFlight?.id) return;

      const isPrepared = !!item.isContentPrepared;
      const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";
      const isLocked =
        item.isLockRequired &&
        (item.assemblyProcessFlag === "inprogress" ||
          item.assemblyProcessFlag === "completed");

      if (isSealed) {
        if (isLocked) {
          modals.showValidationMessage(
            "Cannot remove seal. Please unlock first.",
          );
          return;
        }
        modals.openConfirm({
          title: "Remove Seal",
          message: "Are you sure you want to remove the seal from this item?",
          actionType: "disable",
          onConfirm: async () => {
            modals.closeConfirm();
            const success = await updatePreparationFlag(
              selectedFlight.id,
              item.id,
              {
                action: "seal",
                sealTagNumber: null,
              },
            );
            if (success) Alert.alert("Success", "Seal removed");
          },
        });
      } else {
        if (!isPrepared) {
          modals.showValidationMessage(
            "Please complete preparation first before sealing.",
          );
          return;
        }
        if (!hasUserSignature) {
          modals.openSignature(item);
          return;
        }
        modals.openSeal();
      }
    },
    [selectedFlight?.id, hasUserSignature, updatePreparationFlag, modals],
  );

  const handleAssemblyAction = useCallback(
    async (item: PreparationItem) => {
      if (!selectedFlight?.id) return;

      const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";
      const isAssembled = item.assemblyProcessFlag === "true";
      const isLoaded = item.loadedTruckFlag === "true";

      if (isAssembled) {
        if (isLoaded) {
          modals.showValidationMessage(
            "Cannot disable assembly. Please unload first.",
          );
          return;
        }
        modals.openConfirm({
          title: "Disable Assembly",
          message: "Are you sure you want to mark this as not assembled?",
          actionType: "disable",
          onConfirm: async () => {
            modals.closeConfirm();
            const success = await updatePreparationFlag(
              selectedFlight.id,
              item.id,
              {
                action: "assembly",
                assemblyProcessFlag: false,
              },
            );
            if (success) Alert.alert("Success", "Assembly status updated");
          },
        });
      } else {
        if (!isSealed) {
          modals.showValidationMessage(
            "Please complete sealing first before assembly.",
          );
          return;
        }
        const success = await updatePreparationFlag(
          selectedFlight.id,
          item.id,
          {
            action: "assembly",
            assemblyProcessFlag: true,
          },
        );
        if (success) Alert.alert("Success", "Marked as assembled");
      }
    },
    [selectedFlight?.id, updatePreparationFlag, modals],
  );

  const handleLoadAction = useCallback(
    async (item: PreparationItem) => {
      if (!selectedFlight?.id) return;

      const isAssembled = item.assemblyProcessFlag === "true";
      const isLoaded = item.loadedTruckFlag === "true";

      if (isLoaded) {
        modals.openConfirm({
          title: "Unload Item",
          message: "Are you sure you want to mark this as not loaded?",
          actionType: "disable",
          onConfirm: async () => {
            modals.closeConfirm();
            const success = await updatePreparationFlag(
              selectedFlight.id,
              item.id,
              {
                action: "load",
                loadedTruckFlag: false,
              },
            );
            if (success) Alert.alert("Success", "Load status updated");
          },
        });
      } else {
        if (!isAssembled) {
          modals.showValidationMessage(
            "Please complete assembly first before loading.",
          );
          return;
        }
        const success = await updatePreparationFlag(
          selectedFlight.id,
          item.id,
          {
            action: "load",
            loadedTruckFlag: true,
          },
        );
        if (success) Alert.alert("Success", "Marked as loaded");
      }
    },
    [selectedFlight?.id, updatePreparationFlag, modals],
  );

  return {
    handleOpenPdf,
    handlePreparedAction,
    handleSealAction,
    handleAssemblyAction,
    handleLoadAction,
    handleOpenDetailModal: modals.openDetailModal,
  };
};
