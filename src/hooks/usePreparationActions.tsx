import { useCallback } from "react";
import { Alert } from "react-native";

import { Flight } from "../types/flight";
import {
  PreparationFlagUpdatePayload,
  PreparationItem,
  PreparationModals,
  Truck,
} from "../types/preparations";
import { User } from "../types/user";
import { log } from "../utils/logger";

interface UsePreparationActionsParams {
  selectedFlight: Flight | null;
  updatePreparationFlag: (
    flightId: string,
    preparationId: string,
    payload: PreparationFlagUpdatePayload,
  ) => Promise<void>;
  hasUserSignature: boolean;
  modals: PreparationModals;
  trucks: Truck[];
  currentUser?: User | null;
}

export const usePreparationActions = ({
  selectedFlight,
  updatePreparationFlag,
  hasUserSignature,
  modals,
  trucks,
  currentUser,
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
      }
    },
    [selectedFlight?.id, updatePreparationFlag, modals],
  );

  const handleSealAction = useCallback(
    async (item: PreparationItem) => {
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

      if (!item.isSealRequired && !isSealed) {
        Alert.alert("Info", "Sealing is not required for this item.");
        return;
      }

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

            await updatePreparationFlag(selectedFlight.id, item.id, {
              action: "seal",
              sealTagNumber: null,
            });
          },
        });

        return;
      }

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
    async (
      item: PreparationItem,
      selectedTruckConfig?: { truckId: string; dispatchAssignmentId: string },
    ) => {
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
              truckId: item.truckId || undefined,
              dispatchAssignmentId: item.dispatchAssignmentId || undefined,
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

        // Use provided truck config if available
        if (selectedTruckConfig) {
          await updatePreparationFlag(selectedFlight.id, item.id, {
            action: "load",
            loadedTruckFlag: true,
            truckId: selectedTruckConfig.truckId,
            dispatchAssignmentId: selectedTruckConfig.dispatchAssignmentId,
          });
          return;
        }

        // Handle truck selection (auto-selection logic)
        // if (!trucks || trucks.length === 0) {
        //   Alert.alert(
        //     "No Trucks assigned",
        //     "There are no trucks assigned to this flight. Please assign a truck first.",
        //   );
        //   return;
        // }

        if (trucks.length > 1) {
          modals.openTruckSelection(item);
          return;
        }

        // Only one truck exists - auto-assign it
        const selectedTruck = trucks[0];
        const selectedAssignment = selectedTruck.dispatchAssignments?.[0];

        if (!selectedAssignment) {
          Alert.alert(
            "No Assignment",
            `Truck ${selectedTruck.assetName} has no active dispatch assignments.`,
          );
          return;
        }

        // Inform the user which truck is being used
        // Alert.alert(
        //   "Auto-Assign Truck",
        //   `Loading item into Truck: ${selectedTruck.assetName}`,
        //   [
        //     {
        //       text: "OK",
        //       onPress: async () => {
        //         await updatePreparationFlag(selectedFlight.id, item.id, {
        //           action: "load",
        //           loadedTruckFlag: true,
        //           truckId: selectedTruck.id,
        //           dispatchAssignmentId: selectedAssignment.id,
        //         });
        //       },
        //     },
        //   ],
        // );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modals, updatePreparationFlag, trucks, currentUser?.id],
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
