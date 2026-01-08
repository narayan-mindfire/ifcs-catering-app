import React, { lazy } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { ConfirmationModal } from "../common/ConfirmationModal";

const FlightPreparationDetailsModal = lazy(() =>
  import("../flight-hub/FlightPreparationDetailsModal").then((m) => ({
    default: m.FlightPreparationDetailsModal,
  })),
);
const PdfViewerModal = lazy(() =>
  import("../flight-hub/PDFViewerModal").then((m) => ({
    default: m.PdfViewerModal,
  })),
);
const SignatureModal = lazy(() =>
  import("../flight-hub/SharedComponents").then((m) => ({
    default: m.SignatureModal,
  })),
);
const SealNumberModal = lazy(() =>
  import("../preparation/SealNumberModal").then((m) => ({
    default: m.SealNumberModal,
  })),
);
const ValidationModal = lazy(() =>
  import("../preparation/ValidationModal").then((m) => ({
    default: m.ValidationModal,
  })),
);

interface PreparationsModalsProps {
  modals: any;
  selectedFlight: any;
  onSaveSignature: (signature: string) => void;
  onSaveSealNumber: (sealNumber: number) => void;

  // ✅ Props for consumption flow logic
  isConsumptionMode?: boolean;
  consumptionFlightId?: string;
  onFinishConsumption?: () => void;
}

export const PreparationsModals: React.FC<PreparationsModalsProps> = ({
  modals,
  selectedFlight,
  onSaveSignature,
  onSaveSealNumber,
  isConsumptionMode = false,
  consumptionFlightId,
  onFinishConsumption, // ✅ Passed down
}) => {
  // Determine which flight ID to use
  const activeFlightId =
    isConsumptionMode && consumptionFlightId
      ? consumptionFlightId
      : selectedFlight?.id || "";

  return (
    <>
      <PdfViewerModal
        visible={modals.pdfVisible}
        onClose={modals.closePdf}
        source={modals.pdfSource}
      />

      <ValidationModal
        visible={modals.showValidation}
        message={modals.validationMsg}
        onClose={modals.closeValidation}
      />

      <SignatureModal
        isOpen={modals.signatureModalVisible}
        onClose={modals.closeSignature}
        onSave={onSaveSignature}
        title="Add Your Signature"
      />

      <SealNumberModal
        isOpen={modals.sealModalVisible}
        onClose={modals.closeSeal}
        onSave={onSaveSealNumber}
      />

      <ConfirmationModal
        isOpen={modals.confirmModalVisible}
        onClose={modals.closeConfirm}
        onConfirm={modals.confirmModalData.onConfirm}
        title={modals.confirmModalData.title}
        message={modals.confirmModalData.message}
        actionType={modals.confirmModalData.actionType}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modals.paxModalVisible}
        onRequestClose={modals.closePaxModal}
      >
        <TouchableOpacity
          className="flex-1 bg-transparent"
          activeOpacity={1}
          onPress={modals.closePaxModal}
        >
          <View
            className="absolute w-[250px] bg-bg-surface rounded-lg p-4 shadow-lg border border-border-muted"
            style={{
              top: modals.dropdownPos.top,
              left: modals.dropdownPos.left,
            }}
          >
            <Text className="text-xl font-bold text-text-primary mb-2.5">
              Passenger Count
            </Text>
            <Text className="text-xs text-text-secondary mb-2">
              Flight:{" "}
              {selectedFlight?.flightNumber || selectedFlight?.id || "N/A"}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {modals.selectedItem && (
        <FlightPreparationDetailsModal
          visible={modals.detailModalVisible}
          onClose={modals.closeDetailModal}
          preparationId={modals.selectedItem.id}
          flightId={activeFlightId}
          isLocked={modals.selectedPrepStatus.isLocked}
          isSealed={modals.selectedPrepStatus.isSealed}
          isPrepared={modals.selectedPrepStatus.isCompleted}
          lockRequired={modals.selectedItem.isLockRequired}
          sealRequired={modals.selectedItem.isSealRequired}
          isConsumptionMode={isConsumptionMode}
          onFinishConsumption={onFinishConsumption}
        />
      )}
    </>
  );
};
