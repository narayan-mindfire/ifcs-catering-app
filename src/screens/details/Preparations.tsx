import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  SectionList,
  FlatList,
  Alert,
} from "react-native";
import {
  BoxIcon,
  StringIcon,
  DeliveryIcon,
  CheckIcon,
  LockOpenIcon,
  StringIconTrue,
  BoxIconTrue,
  CheckIconTrue,
  DeliveryIconTrue,
  InfoIcon,
  PrintIcon,
  QrIcon,
  ScanIcon,
  SeatIcon,
  FilterIcon,
  DresserIcon,
  ArchiveIcon,
  BracketIcon,
  TrayIcon,
  WashingMachineIcon,
} from "../../assets/icons";

import { FlightPreparationDetailsModal } from "../../components/flight-hub/FlightPreparationDetailsModal";
import { PdfViewerModal } from "../../components/flight-hub/PDFViewerModal";
import { SealNumberModal } from "../../components/preparation/SealNumberModal";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { useFlightStore } from "../../store/useFlightStore";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { PreparationItem } from "../../types/preparations";

const hasUserSignature = true;

// Helper to assign icons to dynamic names
const getIconForPreparationType = (type: string) => {
  const lowerType = type?.toLowerCase() || "";
  if (lowerType.includes("bond")) return <ArchiveIcon width={20} height={20} />;
  if (lowerType.includes("dry")) return <BracketIcon width={20} height={20} />;
  if (lowerType.includes("laundry"))
    return <WashingMachineIcon width={20} height={20} />;
  if (lowerType.includes("loading"))
    return <DresserIcon width={20} height={20} />;
  if (lowerType.includes("tray")) return <TrayIcon width={20} height={20} />;
  return <DresserIcon width={20} height={20} />;
};

const ValidationModal = ({
  visible,
  message,
  onClose,
}: {
  visible: boolean;
  message: string;
  onClose: () => void;
}) => (
  <Modal transparent visible={visible} animationType="fade">
    <View className="flex-1 bg-black/50 justify-center items-center">
      <View className="bg-bg-surface w-[300px] p-5 rounded-xl shadow-lg border border-border-secondary items-center">
        <View className="h-12 w-12 rounded-full bg-bg-button/10 items-center justify-center mb-3">
          <InfoIcon width={24} height={24} color="#602AF3" />
        </View>
        <Text className="text-lg font-bold text-text-primary mb-2 text-center">
          Action Required
        </Text>
        <Text className="text-base text-text-secondary text-center mb-5">
          {message}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="bg-bg-button w-full py-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const MultiSelectFilter = ({
  options,
  selectedOptions,
  onToggleOption,
}: {
  options: { label: string; icon: React.ReactNode }[];
  selectedOptions: string[];
  onToggleOption: (option: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<View>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const toggleDropdown = () => {
    if (!isOpen) {
      dropdownRef.current?.measure((fx, fy, width, height, px, py) => {
        setPos({ top: py + height + 5, left: px, width: 250 });
        setIsOpen(true);
      });
    } else {
      setIsOpen(false);
    }
  };

  const displayText =
    selectedOptions.length === 0
      ? "Filter (All)"
      : selectedOptions.length === options.length
        ? "Filter (All)"
        : `Filter (${selectedOptions.length})`;

  return (
    <View>
      <TouchableOpacity
        ref={dropdownRef}
        onPress={toggleDropdown}
        className="flex-row items-center bg-bg-tertiary py-2.5 px-4 rounded-md mr-3"
      >
        <FilterIcon width={25} height={25} />
        <Text className="text-xl font-normal m-0.5 text-text-primary ml-2">
          {displayText}
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={isOpen} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-transparent"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            className="absolute bg-bg-surface border border-border-muted rounded-lg shadow-lg max-h-[300px]"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => {
                const isSelected = selectedOptions.includes(item.label);
                return (
                  <TouchableOpacity
                    onPress={() => onToggleOption(item.label)}
                    className={`flex-row items-center px-4 py-3 border-b border-bg-tertiary ${
                      isSelected
                        ? "bg-bg-accent border-border-accent"
                        : "bg-bg-surface"
                    }`}
                  >
                    <View className="mr-3">{item.icon}</View>
                    <Text
                      className={`text-base ${
                        isSelected
                          ? "text-text-primary font-semibold"
                          : "text-text-primary font-normal"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

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

  // Seal Number Modal
  const [sealModalVisible, setSealModalVisible] = useState(false);
  const [currentActionItem, setCurrentActionItem] =
    useState<PreparationItem | null>(null);

  // Confirmation Modal
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
  } = useFlightPreparationStore();

  useEffect(() => {
    if (selectedFlight?.id) {
      console.log("Fetching preparations for flight:", selectedFlight.id);
      fetchPreparations(selectedFlight.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlight?.id]);

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

  const handleToggleFilter = (option: string) => {
    setSelectedFilters((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleOpenDetailModal = (item: PreparationItem) => {
    const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";
    const isLocked =
      item.assemblyProcessFlag === "inprogress" ||
      item.assemblyProcessFlag === "completed";
    const isCompleted = item.loadedTruckFlag === "loaded";

    setSelectedPrepStatus({
      isLocked,
      isSealed,
      isCompleted,
    });

    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  const handleOpenPdf = (item: PreparationItem) => {
    if (item.labelUrl) {
      setPdfSource({ uri: item.labelUrl, cache: true });
      setPdfVisible(true);
    } else {
      Alert.alert(
        "No Label Available",
        "There is no label URL associated with this item.",
      );
    }
  };

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

  const handleOpenPaxModal = () => {
    buttonRef.current?.measure((fx, fy, width, height, px, py) => {
      setDropdownPos({ top: py + height + 5, left: px });
      setPaxModalVisible(true);
    });
  };

  const handlePrint = async () => {
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
  };

  // ACTION HANDLERS

  const handlePreparedAction = async (item: PreparationItem) => {
    if (!selectedFlight?.id) return;

    const isPrepared = !!item.isContentPrepared;

    if (isPrepared) {
      // Disable preparation
      setConfirmModalData({
        title: "Disable Preparation",
        message: "Are you sure you want to mark this as not prepared?",
        actionType: "disable",
        onConfirm: async () => {
          setConfirmModalVisible(false);
          const success = await updatePreparationFlag(
            selectedFlight.id,
            item.id,
            {
              action: "prepared",
              isContentPrepared: false,
            },
          );
          if (success) {
            Alert.alert("Success", "Preparation status updated");
          }
        },
      });
      setConfirmModalVisible(true);
    } else {
      // Enable preparation
      const success = await updatePreparationFlag(selectedFlight.id, item.id, {
        action: "prepared",
        isContentPrepared: true,
      });
      if (success) {
        Alert.alert("Success", "Marked as prepared");
      }
    }
  };

  const handleSealAction = async (item: PreparationItem) => {
    if (!selectedFlight?.id) return;

    const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";
    const isAssembled = item.assemblyProcessFlag === "true"; // Logic based on renderItem

    if (isSealed) {
      // VALIDATION: Cannot turn off Seal if Assembly is still active
      if (isAssembled) {
        setValidationMsg("Assembly must be undone before removing the seal.");
        setShowValidation(true);
        return;
      }

      // Disable seal
      setConfirmModalData({
        title: "Remove Seal",
        message: "Are you sure you want to remove the seal from this item?",
        actionType: "disable",
        onConfirm: async () => {
          setConfirmModalVisible(false);
          const success = await updatePreparationFlag(
            selectedFlight.id,
            item.id,
            {
              action: "seal",
              sealTagNumber: "",
            },
          );
          if (success) {
            Alert.alert("Success", "Seal removed");
          }
        },
      });
      setConfirmModalVisible(true);
    } else {
      // Check if user has signature
      if (!hasUserSignature) {
        setValidationMsg("Please add your signature before sealing.");
        setShowValidation(true);
        return;
      }

      // Show seal number modal
      setCurrentActionItem(item);
      setSealModalVisible(true);
    }
  };

  const handleSaveSealNumber = async (sealNumber: number) => {
    setSealModalVisible(false);
    if (!currentActionItem || !selectedFlight?.id) return;

    const success = await updatePreparationFlag(
      selectedFlight.id,
      currentActionItem.id,
      {
        action: "seal",
        sealTagNumber: sealNumber,
      },
    );

    if (success) {
      Alert.alert("Success", `Seal applied with tag number: ${sealNumber}`);
    }
    setCurrentActionItem(null);
  };

  const handleAssemblyAction = async (item: PreparationItem) => {
    if (!selectedFlight?.id) return;

    const isAssembled =
      item.assemblyProcessFlag === "inprogress" ||
      item.assemblyProcessFlag === "completed" ||
      item.assemblyProcessFlag === "true";

    const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";

    if (isAssembled) {
      // Disable assembly
      setConfirmModalData({
        title: "Disable Assembly",
        message: "Are you sure you want to mark this as not assembled?",
        actionType: "disable",
        onConfirm: async () => {
          setConfirmModalVisible(false);
          const success = await updatePreparationFlag(
            selectedFlight.id,
            item.id,
            {
              action: "assembly",
              assemblyProcessFlag: false,
            },
          );
          if (success) {
            Alert.alert("Success", "Assembly status updated");
          }
        },
      });
      setConfirmModalVisible(true);
    } else {
      // VALIDATION: Cannot turn on Assembly if not Sealed
      if (!isSealed) {
        setValidationMsg("Item must be sealed before assembly.");
        setShowValidation(true);
        return;
      }

      // Enable assembly
      const success = await updatePreparationFlag(selectedFlight.id, item.id, {
        action: "assembly",
        assemblyProcessFlag: true,
      });
      if (success) {
        Alert.alert("Success", "Marked as assembled");
      }
    }
  };

  const handleLoadAction = async (item: PreparationItem) => {
    if (!selectedFlight?.id) return;

    const isLoaded = item.loadedTruckFlag === "loaded";

    if (isLoaded) {
      // Disable load
      setConfirmModalData({
        title: "Unload Item",
        message: "Are you sure you want to mark this as not loaded?",
        actionType: "disable",
        onConfirm: async () => {
          setConfirmModalVisible(false);
          const success = await updatePreparationFlag(
            selectedFlight.id,
            item.id,
            {
              action: "load",
              loadedTruckFlag: false,
            },
          );
          if (success) {
            Alert.alert("Success", "Load status updated");
          }
        },
      });
      setConfirmModalVisible(true);
    } else {
      // Enable load
      const success = await updatePreparationFlag(selectedFlight.id, item.id, {
        action: "load",
        loadedTruckFlag: true,
      });
      if (success) {
        Alert.alert("Success", "Marked as loaded");
      }
    }
  };

  const renderItem = ({ item }: { item: PreparationItem }) => {
    const isPrepared = !!item.isContentPrepared;
    const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";

    const isAssembled = item.assemblyProcessFlag === "true";
    const isLoaded = item.loadedTruckFlag === "true";

    const PreparedIcon = isPrepared ? BoxIconTrue : BoxIcon;
    const SealIcon = isSealed ? StringIconTrue : StringIcon;
    const AssemblyIcon = isAssembled ? CheckIconTrue : CheckIcon;
    const LoadIcon = isLoaded ? DeliveryIconTrue : DeliveryIcon;

    return (
      <View className="flex-row items-center px-4 py-2 border-b border-bg-tertiary bg-bg-surface">
        <View className="flex-[2] justify-center">
          <Text className="text-lg text-text-primary font-semibold">
            {item.stowage}
          </Text>
        </View>
        <View className="flex-[3] justify-center">
          <Text className="text-lg text-text-primary">
            {item.carrier || item.name || item.nameDisplay || "N/A"}
          </Text>
        </View>
        <View className="flex-[4] flex-row justify-end items-center gap-5">
          <TouchableOpacity onPress={() => handleOpenPdf(item)}>
            <QrIcon height={30} width={30} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePreparedAction(item)}
            disabled={isUpdating}
          >
            <PreparedIcon height={30} width={30} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSealAction(item)}
            disabled={isUpdating}
          >
            <SealIcon height={30} width={30} />
          </TouchableOpacity>

          <TouchableOpacity disabled={true}>
            <View style={{ position: "relative" }}>
              <LockOpenIcon
                height={30}
                width={30}
                color={item.isLockRequired ? "#9CA3AF" : "#9CA3AF"}
              />
              {!item.isLockRequired && (
                <View
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: "#EF4444",
                    transform: [{ rotate: "-45deg" }],
                  }}
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAssemblyAction(item)}
            disabled={isUpdating}
          >
            <AssemblyIcon height={30} width={30} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleLoadAction(item)}
            disabled={isUpdating}
          >
            <LoadIcon height={30} width={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleOpenDetailModal(item)}>
            <InfoIcon height={30} width={30} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View className="bg-bg-tertiary px-4 py-2 border-b border-border-secondary">
      <Text className="text-sm font-bold text-text-secondary uppercase">
        {title}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-bg-surface p-4">
      <PdfViewerModal
        visible={pdfVisible}
        onClose={() => {
          setPdfVisible(false);
        }}
        source={pdfSource}
      />

      <ValidationModal
        visible={showValidation}
        message={validationMsg}
        onClose={() => setShowValidation(false)}
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
          isSealed={selectedPrepStatus.isSealed}
          isCompleted={selectedPrepStatus.isCompleted}
        />
      )}

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
