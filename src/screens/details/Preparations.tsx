import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { PrintIcon, ScanIcon, SeatIcon } from "../../assets/icons";

import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { FlightPreparationDetailsModal } from "../../components/flight-hub/FlightPreparationDetailsModal";
import { PdfViewerModal } from "../../components/flight-hub/PDFViewerModal";
import { SignatureModal } from "../../components/flight-hub/SharedComponents";
import { getIconForPreparationType } from "../../components/preparation/PreparationUtils";
import { PreparationListItem } from "../../components/preparation/PreparationListItems";
import { MultiSelectFilter } from "../../components/preparation/MultiSelectFilter";
import { SealNumberModal } from "../../components/preparation/SealNumberModal";
import { ValidationModal } from "../../components/preparation/ValidationModal";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { useFlightStore } from "../../store/useFlightStore";
import { PreparationItem } from "../../types/preparations";

export const PreparationsScreen: React.FC = () => {
  const [paxModalVisible, setPaxModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfSource, setPdfSource] = useState<any>(null);
  const [validationMsg, setValidationMsg] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<PreparationItem | null>(
    null,
  );
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const [sealModalVisible, setSealModalVisible] = useState(false);
  const [currentActionItem, setCurrentActionItem] =
    useState<PreparationItem | null>(null);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [hasUserSignature, setHasUserSignature] = useState(false);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string;
    actionType: "disable" | "enable";
    onConfirm: () => void;
  }>({
    title: "",
    message: "",
    actionType: "disable",
    onConfirm: () => {},
  });

  const [selectedPrepStatus, setSelectedPrepStatus] = useState({
    isLocked: false,
    isSealed: false,
    isCompleted: false,
  });

  const buttonRef = useRef<View>(null);
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

  const CURRENT_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  useEffect(() => {
    if (selectedFlight?.id) {
      console.log("Fetching preparations for flight:", selectedFlight.id);
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
        console.log("User signature check:", hasSignature);
      }
    };

    if (deliveries.length > 0) {
      checkSignature();
    }
  }, [deliveries, selectedFlight?.id, selectedDeliveryId, checkUserSignature]);

  const filterOptions = useMemo(() => {
    const uniqueNames = Array.from(
      new Set(
        preparations
          .map((p) => p.preparedBy)
          .filter((name): name is string => !!name),
      ),
    );
    return uniqueNames.map((name) => ({
      label: name,
      icon: getIconForPreparationType(name),
    }));
  }, [preparations]);

  const sectionedData = useMemo(() => {
    let filtered = preparations;
    if (selectedFilters.length > 0) {
      filtered = preparations.filter((p) =>
        selectedFilters.includes(p.preparedBy || ""),
      );
    }

    const grouped: Record<string, PreparationItem[]> = {};
    filtered.forEach((item) => {
      const key = item.preparedBy || "Unassigned";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    return Object.keys(grouped)
      .sort()
      .map((key) => ({
        title: key,
        data: grouped[key],
      }));
  }, [preparations, selectedFilters]);

  const handleToggleFilter = useCallback((option: string) => {
    setSelectedFilters((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  }, []);

  const handleOpenDetailModal = useCallback((item: PreparationItem) => {
    const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";
    const isLocked =
      item.assemblyProcessFlag === "inprogress" ||
      item.assemblyProcessFlag === "completed";
    const isCompleted = item.loadedTruckFlag === "loaded";

    setSelectedPrepStatus({ isLocked, isSealed, isCompleted });
    setSelectedItem(item);
    setDetailModalVisible(true);
  }, []);

  const handleOpenPdf = useCallback((item: PreparationItem) => {
    if (item.labelUrl) {
      setPdfSource({ uri: item.labelUrl, cache: true });
      setPdfVisible(true);
    } else {
      Alert.alert(
        "No Label Available",
        "There is no label URL associated with this item.",
      );
    }
  }, []);

  const handleOpenPaxModal = useCallback(() => {
    buttonRef.current?.measure((fx, fy, width, height, px, py) => {
      setDropdownPos({ top: py + height + 5, left: px });
      setPaxModalVisible(true);
    });
  }, []);

  const handlePrint = useCallback(async () => {
    if (!selectedFlight?.id) {
      Alert.alert("Error", "No flight selected.");
      return;
    }

    console.log("Generating print for flight:", selectedFlight.id);
    const result = await printPreparation(selectedFlight.id);

    if (result.success && result.fileUrl) {
      setPdfSource({ uri: result.fileUrl, cache: true });
      setPdfVisible(true);
    } else {
      Alert.alert(
        "Print Error",
        result.error || "Failed to generate print document.",
      );
    }
  }, [selectedFlight?.id, printPreparation]);

  const handlePreparedAction = useCallback(
    async (item: PreparationItem) => {
      if (!selectedFlight?.id) return;

      const isPrepared = !!item.isContentPrepared;
      const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";

      if (isPrepared) {
        if (isSealed) {
          setValidationMsg(
            "Cannot disable preparation. Please remove seal first.",
          );
          setShowValidation(true);
          return;
        }
        setConfirmModalData({
          title: "Disable Preparation",
          message: "Are you sure you want to mark this as not prepared?",
          actionType: "disable",
          onConfirm: async () => {
            setConfirmModalVisible(false);
            const success = await updatePreparationFlag(
              selectedFlight.id,
              item.id,
              { action: "prepared", isContentPrepared: false },
            );
            if (success) Alert.alert("Success", "Preparation status updated");
          },
        });
        setConfirmModalVisible(true);
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
    [selectedFlight?.id, updatePreparationFlag],
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
          setValidationMsg("Cannot remove seal. Please unlock first.");
          setShowValidation(true);
          return;
        }
        setConfirmModalData({
          title: "Remove Seal",
          message: "Are you sure you want to remove the seal from this item?",
          actionType: "disable",
          onConfirm: async () => {
            setConfirmModalVisible(false);
            const success = await updatePreparationFlag(
              selectedFlight.id,
              item.id,
              { action: "seal", sealTagNumber: null },
            );
            if (success) Alert.alert("Success", "Seal removed");
          },
        });
        setConfirmModalVisible(true);
      } else {
        if (!isPrepared) {
          setValidationMsg("Please complete preparation first before sealing.");
          setShowValidation(true);
          return;
        }
        if (!hasUserSignature) {
          setCurrentActionItem(item);
          setSignatureModalVisible(true);
          return;
        }
        setCurrentActionItem(item);
        setSealModalVisible(true);
      }
    },
    [selectedFlight?.id, hasUserSignature, updatePreparationFlag],
  );

  const handleSaveSignature = useCallback(
    async (signature: string) => {
      setSignatureModalVisible(false);

      if (!selectedFlight?.id) {
        Alert.alert("Error", "No flight selected");
        setCurrentActionItem(null);
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
          setCurrentActionItem(null);
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
        if (currentActionItem) {
          setSealModalVisible(true);
        }
      } else {
        Alert.alert("Error", "Failed to save signature. Please try again.");
        setCurrentActionItem(null);
      }
    },
    [
      selectedFlight?.id,
      selectedDeliveryId,
      deliveries,
      currentActionItem,
      createDelivery,
      addUserSignature,
    ],
  );

  const handleSaveSealNumber = useCallback(
    async (sealNumber: number) => {
      setSealModalVisible(false);
      if (!currentActionItem || !selectedFlight?.id) return;

      const success = await updatePreparationFlag(
        selectedFlight.id,
        currentActionItem.id,
        { action: "seal", sealTagNumber: sealNumber },
      );

      if (success) {
        Alert.alert("Success", `Seal applied with tag number: ${sealNumber}`);
      }
      setCurrentActionItem(null);
    },
    [currentActionItem, selectedFlight?.id, updatePreparationFlag],
  );

  const handleAssemblyAction = useCallback(
    async (item: PreparationItem) => {
      if (!selectedFlight?.id) return;

      const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";
      const isAssembled = item.assemblyProcessFlag === "true";
      const isLoaded = item.loadedTruckFlag === "true";

      if (isAssembled) {
        if (isLoaded) {
          setValidationMsg("Cannot disable assembly. Please unload first.");
          setShowValidation(true);
          return;
        }
        setConfirmModalData({
          title: "Disable Assembly",
          message: "Are you sure you want to mark this as not assembled?",
          actionType: "disable",
          onConfirm: async () => {
            setConfirmModalVisible(false);
            const success = await updatePreparationFlag(
              selectedFlight.id,
              item.id,
              { action: "assembly", assemblyProcessFlag: false },
            );
            if (success) Alert.alert("Success", "Assembly status updated");
          },
        });
        setConfirmModalVisible(true);
      } else {
        if (!isSealed) {
          setValidationMsg("Please complete sealing first before assembly.");
          setShowValidation(true);
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
    [selectedFlight?.id, updatePreparationFlag],
  );

  const handleLoadAction = useCallback(
    async (item: PreparationItem) => {
      if (!selectedFlight?.id) return;

      const isAssembled = item.assemblyProcessFlag === "true";
      const isLoaded = item.loadedTruckFlag === "true";

      if (isLoaded) {
        setConfirmModalData({
          title: "Unload Item",
          message: "Are you sure you want to mark this as not loaded?",
          actionType: "disable",
          onConfirm: async () => {
            setConfirmModalVisible(false);
            const success = await updatePreparationFlag(
              selectedFlight.id,
              item.id,
              { action: "load", loadedTruckFlag: false },
            );
            if (success) Alert.alert("Success", "Load status updated");
          },
        });
        setConfirmModalVisible(true);
      } else {
        if (!isAssembled) {
          setValidationMsg("Please complete assembly first before loading.");
          setShowValidation(true);
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
    [selectedFlight?.id, updatePreparationFlag],
  );

  const renderItem = useCallback(
    ({ item }: { item: PreparationItem }) => (
      <PreparationListItem
        item={item}
        isUpdating={isUpdating}
        onOpenPdf={handleOpenPdf}
        onPreparedAction={handlePreparedAction}
        onSealAction={handleSealAction}
        onAssemblyAction={handleAssemblyAction}
        onLoadAction={handleLoadAction}
        onOpenDetailModal={handleOpenDetailModal}
      />
    ),
    [
      isUpdating,
      handleOpenPdf,
      handlePreparedAction,
      handleSealAction,
      handleAssemblyAction,
      handleLoadAction,
      handleOpenDetailModal,
    ],
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => (
      <View className="bg-bg-tertiary px-4 py-2 border-b border-border-secondary">
        <Text className="text-sm font-bold text-text-secondary uppercase">
          {title}
        </Text>
      </View>
    ),
    [],
  );

  // 6. Render
  return (
    <View className="flex-1 bg-bg-surface p-4">
      {/* Modals */}
      <PdfViewerModal
        visible={pdfVisible}
        onClose={() => setPdfVisible(false)}
        source={pdfSource}
      />

      <ValidationModal
        visible={showValidation}
        message={validationMsg}
        onClose={() => setShowValidation(false)}
      />

      <SignatureModal
        isOpen={signatureModalVisible}
        onClose={() => setSignatureModalVisible(false)}
        onSave={handleSaveSignature}
        title="Add Your Signature"
      />

      <SealNumberModal
        isOpen={sealModalVisible}
        onClose={() => {
          setSealModalVisible(false);
          setCurrentActionItem(null);
        }}
        onSave={handleSaveSealNumber}
      />

      <ConfirmationModal
        isOpen={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        onConfirm={confirmModalData.onConfirm}
        title={confirmModalData.title}
        message={confirmModalData.message}
        actionType={confirmModalData.actionType}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={paxModalVisible}
        onRequestClose={() => setPaxModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-transparent"
          activeOpacity={1}
          onPress={() => setPaxModalVisible(false)}
        >
          <View
            className="absolute w-[250px] bg-bg-surface rounded-lg p-4 shadow-lg border border-border-muted"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
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

      {selectedItem && (
        <FlightPreparationDetailsModal
          visible={detailModalVisible}
          onClose={() => {
            setDetailModalVisible(false);
            setSelectedItem(null);
          }}
          preparationId={selectedItem.id}
          flightId={selectedFlight?.id || ""}
          isLocked={selectedPrepStatus.isLocked}
          isSealed={
            selectedItem.sealTagNumber !== null &&
            selectedItem.sealTagNumber !== ""
          }
          isPrepared={selectedItem.assemblyProcessFlag === "true"}
          lockRequired={selectedItem.isLockRequired}
        />
      )}

      {/* Header Actions */}
      <View className="flex-row mb-5 z-10">
        <View className="flex-1 flex-row justify-start">
          <Pressable className="flex-row items-center bg-bg-tertiary py-2.5 px-4 rounded-md mr-3">
            <ScanIcon height={28} width={28} />
            <Text className="text-xl font-normal m-0.5 text-text-primary">
              Prep Scan
            </Text>
          </Pressable>
          <Pressable className="flex-row items-center bg-bg-tertiary py-2.5 px-4 rounded-md mr-3">
            <ScanIcon height={28} width={28} />
            <Text className="text-xl font-normal m-0.5 text-text-primary">
              Verify Seal
            </Text>
          </Pressable>
          <Pressable className="flex-row items-center bg-bg-tertiary py-2.5 px-4 rounded-md mr-3">
            <ScanIcon height={28} width={28} />
            <Text className="text-xl font-normal m-0.5 text-text-primary">
              Assembel Scan
            </Text>
          </Pressable>
        </View>

        <View className="flex-1 flex-row justify-end">
          <MultiSelectFilter
            options={filterOptions}
            selectedOptions={selectedFilters}
            onToggleOption={handleToggleFilter}
          />

          <View ref={buttonRef} collapsable={false}>
            <Pressable
              className="flex-row items-center bg-bg-tertiary py-2.5 px-4 rounded-md mr-3"
              onPress={handleOpenPaxModal}
            >
              <SeatIcon />
              <Text className="text-xl font-normal m-0.5 text-text-primary">
                PAX Count
              </Text>
            </Pressable>
          </View>

          <Pressable
            className="flex-row items-center bg-bg-tertiary py-2.5 px-4 rounded-md mr-3"
            onPress={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? (
              <ActivityIndicator size="small" color="#602AF3" />
            ) : (
              <PrintIcon />
            )}
            <Text className="text-xl font-normal m-0.5 text-text-primary">
              {isPrinting ? "Printing..." : "Print"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* List Content */}
      <View className="flex-1 border border-border-secondary rounded-[10px] overflow-hidden">
        <View className="flex-row bg-bg-quaternary p-4 border-b border-border-muted">
          <View className="flex-[2]">
            <Text className="text-lg font-semibold text-text-secondary">
              Stowage
            </Text>
          </View>
          <View className="flex-[3]">
            <Text className="text-lg font-semibold text-text-secondary">
              Carrier
            </Text>
          </View>
          <View className="flex-[4] items-end">
            <Text className="text-lg font-semibold text-text-secondary">
              Action
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#B79EFA" />
          </View>
        ) : (
          <SectionList
            style={{ flex: 1 }}
            sections={sectionedData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled={true}
            ListEmptyComponent={() => (
              <View className="p-4">
                <Text className="text-center text-lg text-text-muted mt-6">
                  No preparations found for selected filters.
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};
