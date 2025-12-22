import { useCallback, useRef, useState } from "react";
import { PreparationItem } from "../types/preparations";

interface PrepStatus {
  isLocked: boolean;
  isSealed: boolean;
  isCompleted: boolean;
}

interface ConfirmModalData {
  title: string;
  message: string;
  actionType: "disable" | "enable";
  onConfirm: () => void;
}

export const usePreparationModals = () => {
  const [paxModalVisible, setPaxModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfSource, setPdfSource] = useState<any>(null);
  const [validationMsg, setValidationMsg] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PreparationItem | null>(
    null,
  );
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [sealModalVisible, setSealModalVisible] = useState(false);
  const [currentActionItem, setCurrentActionItem] =
    useState<PreparationItem | null>(null);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<ConfirmModalData>({
    title: "",
    message: "",
    actionType: "disable",
    onConfirm: () => {},
  });
  const [selectedPrepStatus, setSelectedPrepStatus] = useState<PrepStatus>({
    isLocked: false,
    isSealed: false,
    isCompleted: false,
  });

  const buttonRef = useRef<any>(null);

  const openPaxModal = useCallback(() => {
    buttonRef.current?.measure(
      (
        fx: number,
        fy: number,
        width: number,
        height: number,
        px: number,
        py: number,
      ) => {
        setDropdownPos({ top: py + height + 5, left: px });
        setPaxModalVisible(true);
      },
    );
  }, []);

  const closePaxModal = useCallback(() => setPaxModalVisible(false), []);

  const openDetailModal = useCallback((item: PreparationItem) => {
    const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";
    const isLocked =
      item.assemblyProcessFlag === "inprogress" ||
      item.assemblyProcessFlag === "completed";
    const isCompleted = item.loadedTruckFlag === "loaded";

    setSelectedPrepStatus({ isLocked, isSealed, isCompleted });
    setSelectedItem(item);
    setDetailModalVisible(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailModalVisible(false);
    setSelectedItem(null);
  }, []);

  const openPdf = useCallback((source: any) => {
    setPdfSource(source);
    setPdfVisible(true);
  }, []);

  const closePdf = useCallback(() => setPdfVisible(false), []);

  const showValidationMessage = useCallback((message: string) => {
    setValidationMsg(message);
    setShowValidation(true);
  }, []);

  const closeValidation = useCallback(() => setShowValidation(false), []);

  const openSignature = useCallback((item: PreparationItem) => {
    setCurrentActionItem(item);
    setSignatureModalVisible(true);
  }, []);

  const closeSignature = useCallback(() => setSignatureModalVisible(false), []);

  const openSeal = useCallback((item?: PreparationItem) => {
    if (item) {
      setCurrentActionItem(item);
    }
    setSealModalVisible(true);
  }, []);

  const closeSeal = useCallback(() => {
    setSealModalVisible(false);
    setCurrentActionItem(null);
  }, []);

  const openConfirm = useCallback((data: ConfirmModalData) => {
    setConfirmModalData(data);
    setConfirmModalVisible(true);
  }, []);

  const closeConfirm = useCallback(() => setConfirmModalVisible(false), []);

  const clearCurrentAction = useCallback(() => setCurrentActionItem(null), []);

  return {
    paxModalVisible,
    detailModalVisible,
    pdfVisible,
    pdfSource,
    validationMsg,
    showValidation,
    selectedItem,
    dropdownPos,
    sealModalVisible,
    currentActionItem,
    signatureModalVisible,
    confirmModalVisible,
    confirmModalData,
    selectedPrepStatus,
    buttonRef,
    openPaxModal,
    closePaxModal,
    openDetailModal,
    closeDetailModal,
    openPdf,
    closePdf,
    showValidationMessage,
    closeValidation,
    openSignature,
    closeSignature,
    openSeal,
    closeSeal,
    openConfirm,
    closeConfirm,
    clearCurrentAction,
  };
};
