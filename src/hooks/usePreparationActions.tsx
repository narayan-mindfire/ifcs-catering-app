import { useCallback } from "react";
import { Alert } from "react-native";

import { PreparationItem } from "../types/preparations";
import { log } from "../utils/logger";

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
            await updatePreparationFlag(selectedFlight.id, item.id, {
              action: "prepared",
              isContentPrepared: false,
            });
          },
        });
      } else {
        await updatePreparationFlag(selectedFlight.id, item.id, {
          action: "prepared",
          isContentPrepared: true,
        });
        // if (success) Alert.alert("Success", "Marked as prepared");
      }
    },
    [selectedFlight?.id, updatePreparationFlag, modals],
  );

  const handleSealAction = useCallback(
    async (item: PreparationItem) => {
      log.info("[handleSealAction] START");
      log.info("[handleSealAction] item:", item);
      log.info("[handleSealAction] selectedFlight:", selectedFlight);

      if (!selectedFlight?.id) {
        log.warn("[handleSealAction] EXIT → selectedFlight.id missing");
        return;
      }

      const isPrepared = !!item.isContentPrepared;
      const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";
      const isLocked =
        item.isLockRequired &&
        (item.assemblyProcessFlag === "inprogress" ||
          item.assemblyProcessFlag === "completed");

      log.info("[handleSealAction] computed flags:", {
        isPrepared,
        isSealed,
        isLocked,
        hasUserSignature,
      });

      if (!item.isSealRequired && !isSealed) {
        log.info("[handleSealAction] BLOCKED → Sealing not required");
        Alert.alert("Info", "Sealing is not required for this item.");
        return;
      }

      if (isSealed) {
        log.info("[handleSealAction] BRANCH → item is SEALED");

        if (isLocked) {
          log.warn("[handleSealAction] BLOCKED → item is LOCKED");
          modals.showValidationMessage(
            "Cannot remove seal. Please unlock first.",
          );
          return;
        }

        log.info("[handleSealAction] Opening REMOVE SEAL confirm modal");

        modals.openConfirm({
          title: "Remove Seal",
          message: "Are you sure you want to remove the seal from this item?",
          actionType: "disable",
          onConfirm: async () => {
            log.info("[handleSealAction] CONFIRM → Remove Seal clicked");

            modals.closeConfirm();

            log.info("[handleSealAction] Calling updatePreparationFlag");

            const success = await updatePreparationFlag(
              selectedFlight.id,
              item.id,
              {
                action: "seal",
                sealTagNumber: null,
              },
            );

            log.info(
              "[handleSealAction] updatePreparationFlag result:",
              success,
            );

            if (success) {
              log.info("[handleSealAction] Seal removed successfully");
              // Alert.alert("Success", "Seal removed");
            } else {
              log.warn("[handleSealAction] Failed to remove seal");
            }
          },
        });

        return;
      }

      log.info("[handleSealAction] BRANCH → item is NOT sealed");

      if (!isPrepared) {
        log.warn("[handleSealAction] BLOCKED → item not prepared");
        modals.showValidationMessage(
          "Please complete preparation first before sealing.",
        );
        return;
      }

      if (!hasUserSignature) {
        log.warn("[handleSealAction] BLOCKED → user signature missing");
        modals.openSignature(item);
        return;
      }

      modals.openSeal(item);

      log.info("[handleSealAction] END");
    },
    [selectedFlight, hasUserSignature, modals, updatePreparationFlag],
  );

  const handleLockAction = useCallback(
    async (item: PreparationItem) => {
      if (!selectedFlight?.id) return;

      const isPrepared = !!item.isContentPrepared;
      const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";
      const isLocked = !!item.lockTagNumber && item.lockTagNumber !== "";
      const isAssembled = item.assemblyProcessFlag === "true";

      if (!item.isLockRequired && !isLocked) {
        Alert.alert("Info", "Locking is not required for this item.");
        return;
      }

      if (isLocked) {
        if (isAssembled) {
          modals.showValidationMessage(
            "Cannot remove lock. Please disassemble first.",
          );
          return;
        }

        modals.openConfirm({
          title: "Remove Lock",
          message: "Are you sure you want to remove the lock from this item?",
          actionType: "disable",
          onConfirm: async () => {
            modals.closeConfirm();
            await updatePreparationFlag(selectedFlight.id, item.id, {
              action: "lock",
              lockTagNumber: null,
            });
          },
        });
        return;
      }

      if (!isPrepared) {
        modals.showValidationMessage(
          "Please complete preparation first before locking.",
        );
        return;
      }

      if (item.isSealRequired && !isSealed) {
        modals.showValidationMessage("Please seal the item before locking.");
        return;
      }

      if (!hasUserSignature) {
        modals.openSignature(item);
        return;
      }

      modals.openLock(item);
    },
    [selectedFlight, hasUserSignature, modals, updatePreparationFlag],
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
            await updatePreparationFlag(selectedFlight.id, item.id, {
              action: "assembly",
              assemblyProcessFlag: false,
            });
          },
        });
      } else {
        if (item.isSealRequired && !isSealed) {
          modals.showValidationMessage(
            "Please complete sealing first before assembly.",
          );
          return;
        }
        const isLocked = !!item.lockTagNumber && item.lockTagNumber !== "";
        if (item.isLockRequired && !isLocked) {
          modals.showValidationMessage(
            "Please complete locking first before assembly.",
          );
          return;
        }
        await updatePreparationFlag(selectedFlight.id, item.id, {
          action: "assembly",
          assemblyProcessFlag: true,
        });
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
            await updatePreparationFlag(selectedFlight.id, item.id, {
              action: "load",
              loadedTruckFlag: false,
            });
          },
        });
      } else {
        if (!isAssembled) {
          modals.showValidationMessage(
            "Please complete assembly first before loading.",
          );
          return;
        }
        await updatePreparationFlag(selectedFlight.id, item.id, {
          action: "load",
          loadedTruckFlag: true,
        });
      }
    },
    [selectedFlight?.id, updatePreparationFlag, modals],
  );

  return {
    handleOpenPdf,
    handlePreparedAction,
    handleSealAction,
    handleLockAction,
    handleAssemblyAction,
    handleLoadAction,
    handleOpenDetailModal: modals.openDetailModal,
  };
};
