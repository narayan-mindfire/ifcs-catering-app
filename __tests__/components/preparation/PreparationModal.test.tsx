import { render } from "@testing-library/react-native";
import React, { Suspense } from "react";
import { Text } from "react-native";

import { PreparationsModals } from "../../../src/components/preparation/PreparationModal";

// Mock sub-modals
jest.mock("../../../src/components/flight-hub/PDFViewerModal", () => ({
  PdfViewerModal: () => null,
}));
jest.mock("../../../src/components/preparation/ValidationModal", () => ({
  ValidationModal: () => null,
}));
jest.mock("../../../src/components/flight-hub/SharedComponents", () => ({
  SignatureModal: () => null,
}));
jest.mock("../../../src/components/preparation/SealNumberModal", () => ({
  SealNumberModal: () => null,
}));
jest.mock("../../../src/components/preparation/LockNumberModal", () => ({
  LockNumberModal: () => null,
}));
jest.mock("../../../src/components/common/ConfirmationModal", () => ({
  ConfirmationModal: () => null,
}));
jest.mock(
  "../../../src/components/flight-hub/FlightPreparationDetailsModal",
  () => ({ FlightPreparationDetailsModal: () => null }),
);

describe("PreparationsModals", () => {
  const mockModals = {
    pdfVisible: false,
    showValidation: false,
    signatureModalVisible: false,
    sealModalVisible: false,
    lockModalVisible: false,
    confirmModalVisible: false,
    paxModalVisible: false,
    dropdownPos: { top: 0, left: 0 },
    confirmModalData: {},
  };

  it("renders without crashing", () => {
    const { toJSON } = render(
      <Suspense fallback={<Text>Loading...</Text>}>
        <PreparationsModals
          modals={mockModals}
          selectedFlight={{ id: "f1" }}
          onSaveSignature={jest.fn()}
          onSaveSealNumber={jest.fn()}
          onSaveLockNumber={jest.fn()}
        />
      </Suspense>,
    );
    expect(toJSON()).toBeTruthy();
  });
});
