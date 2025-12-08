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
  BoxInactiveIcon,
  StringInactiveIcon,
  DeliveryInactiveIcon,
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
import { useFlightStore } from "../../store/useFlightStore";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { PreparationItem } from "../../types/preparations";

// --- Helper to assign icons to dynamic names ---
const getIconForPreparationType = (type: string) => {
  const lowerType = type?.toLowerCase() || "";
  if (lowerType.includes("bond")) return <ArchiveIcon width={20} height={20} />;
  if (lowerType.includes("dry")) return <BracketIcon width={20} height={20} />;
  if (lowerType.includes("laundry"))
    return <WashingMachineIcon width={20} height={20} />;
  if (lowerType.includes("loading"))
    return <DresserIcon width={20} height={20} />;
  if (lowerType.includes("tray")) return <TrayIcon width={20} height={20} />;
  return <DresserIcon width={20} height={20} />; // Default
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
          Sequence Required
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

// Updated Filter Component to accept dynamic data
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
  // New state to hold dynamic PDF source
  const [pdfSource, setPdfSource] = useState<any>(null);

  const [validationMsg, setValidationMsg] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<PreparationItem | null>(
    null,
  );
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // Status state for Modal
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
  } = useFlightPreparationStore();

  // --- Fetch Data ---
  useEffect(() => {
    if (selectedFlight?.id) {
      console.log("Fetching preparations for flight:", selectedFlight.id);
      fetchPreparations(selectedFlight.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlight?.id]);

  // --- Dynamic Filters Logic ---
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

  // --- Logic ---
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

  const handleSequenceCheck = (
    stepName: "prepared" | "sealed" | "locked" | "verify" | "delivery",
    item: PreparationItem,
  ) => {
    const isPrepared = !!item.isContentPrepared;
    const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";
    const isLocked =
      item.assemblyProcessFlag === "inprogress" ||
      item.assemblyProcessFlag === "completed";
    const isVerified = item.assemblyProcessFlag === "completed";

    let error = "";
    switch (stepName) {
      case "prepared":
        break;
      case "sealed":
        if (!isPrepared) error = "Please complete Preparation first.";
        break;
      case "locked":
        if (!isSealed) error = "Please complete Sealing first.";
        break;
      case "verify":
        if (!isLocked) error = "Please complete Locking first.";
        break;
      case "delivery":
        if (!isVerified) error = "Please complete Verification first.";
        break;
    }

    if (error) {
      setValidationMsg(error);
      setShowValidation(true);
    } else {
      console.log(`Step ${stepName} clicked successfully.`);
    }
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

  // --- Render Item with Highlighted Icons ---
  const renderItem = ({ item }: { item: PreparationItem }) => {
    // 1. Calculate Status
    const isPrepared = !!item.isContentPrepared;
    const isSealed = !!item.sealTagNumber;
    const isLocked =
      item.assemblyProcessFlag === "inprogress" ||
      item.assemblyProcessFlag === "completed";
    const isVerified = item.assemblyProcessFlag === "completed";
    const isDelivered = item.loadedTruckFlag === "loaded";

    // 2. Select Icons
    const RenderBoxIcon = isPrepared ? BoxIcon : BoxInactiveIcon;
    const RenderStringIcon = isSealed ? StringIcon : StringInactiveIcon;
    const RenderDeliveryIcon = isDelivered
      ? DeliveryIcon
      : DeliveryInactiveIcon;

    // 3. Define Colors
    const lockColor = isLocked ? "#008000" : "#9CA3AF";
    const verifyColor = isVerified ? "#008000" : "#9CA3AF";

    return (
      <View className="flex-row items-center px-4 py-2 border-b border-bg-tertiary bg-bg-surface">
        <View className="flex-[2] justify-center">
          {/* UPDATED: Stowage mapping */}
          <Text className="text-lg text-text-primary font-semibold">
            {item.stowage || item.position || "N/A"}
          </Text>
        </View>
        <View className="flex-[3] justify-center">
          {/* UPDATED: Carrier mapping with fallbacks */}
          <Text className="text-lg text-text-primary">
            {item.carrier || item.name || item.nameDisplay || "N/A"}
          </Text>
        </View>
        <View className="flex-[4] flex-row justify-end items-center gap-5">
          {/* UPDATED: Open PDF from URL */}
          <TouchableOpacity onPress={() => handleOpenPdf(item)}>
            <QrIcon height={30} width={30} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSequenceCheck("prepared", item)}
          >
            <RenderBoxIcon height={30} width={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSequenceCheck("sealed", item)}>
            <RenderStringIcon height={30} width={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSequenceCheck("locked", item)}>
            <LockOpenIcon
              height={30}
              width={30}
              color={lockColor}
              style={{ opacity: isLocked ? 1 : 0.6 }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSequenceCheck("verify", item)}>
            <CheckIcon
              height={30}
              width={30}
              color={verifyColor}
              style={{ opacity: isVerified ? 1 : 0.6 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSequenceCheck("delivery", item)}
          >
            <View style={{ position: "relative" }}>
              <RenderDeliveryIcon height={30} width={30} />
              <View
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  backgroundColor: isDelivered ? "#008000" : "#602AF3",
                  borderRadius: 10,
                  height: 18,
                  minWidth: 18,
                  paddingHorizontal: 3,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
                >
                  n/a
                </Text>
              </View>
            </View>
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
          // Removed setPdfSource(null) to fix crash: [TypeError: Cannot read property 'uri' of null]
        }}
        source={pdfSource}
      />

      <ValidationModal
        visible={showValidation}
        message={validationMsg}
        onClose={() => setShowValidation(false)}
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
          // Use dynamic flight ID, fallback to empty string if not available
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
