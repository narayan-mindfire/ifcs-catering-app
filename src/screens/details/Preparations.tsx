import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  SectionList,
  FlatList,
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
import { Preparation } from "../../types/preparations";
import { Alert } from "react-native/Libraries/Alert/Alert";

const SAMPLE_PDF = require("../../assets/sample.pdf");

const PREPARED_BY_OPTIONS = [
  { label: "Bond Stores", icon: <ArchiveIcon /> },
  { label: "Dry Stores", icon: <BracketIcon /> },
  { label: "Laundry", icon: <WashingMachineIcon /> },
  { label: "Loading Bay", icon: <DresserIcon /> },
  { label: "Spare", icon: <DresserIcon /> },
  { label: "Tray Set Up", icon: <TrayIcon /> },
];

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

const MultiSelectFilter = ({
  selectedOptions,
  onToggleOption,
}: {
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
      : selectedOptions.length === PREPARED_BY_OPTIONS.length
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
              data={PREPARED_BY_OPTIONS}
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

  const [validationMsg, setValidationMsg] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [selectedItem, setSelectedItem] = useState<Preparation | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<View>(null);

  const selectedFlight = useFlightStore((state) => state.selectedFlight);
  const preparations = useFlightStore((state) => state.preparations);
  const isPrepLoading = useFlightStore((state) => state.isPrepLoading);

  const handleToggleFilter = (option: string) => {
    setSelectedFilters((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handlePrint = async () => {
    try {
      // Get filtered preparations (respecting current filters)
      let dataToPrint = preparations;

      if (selectedFilters.length > 0) {
        dataToPrint = preparations.filter((p) =>
          selectedFilters.includes(p.preparedBy || ""),
        );
      }

      if (dataToPrint.length === 0) {
        Alert.alert(
          "No Data",
          "There are no preparations to print with the current filters.",
        );
        return;
      }
    } catch (error) {
      console.error("Print error:", error);
      Alert.alert(
        "Print Error",
        "An error occurred while preparing the print document.",
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

    const grouped: Record<string, Preparation[]> = {};

    filtered.forEach((item) => {
      const key = item.preparedBy || "Unassigned";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    const sections = Object.keys(grouped)
      .sort()
      .map((key) => ({
        title: key,
        data: grouped[key],
      }));

    return sections;
  }, [preparations, selectedFilters]);

  const dynamicPaxData = React.useMemo(() => {
    if (!selectedFlight) return [];
    const p = selectedFlight.passengers || {};
    return [
      {
        label: "Business Studio",
        value: p.businessStudioCount ? String(p.businessStudioCount) : "0",
      },
      {
        label: "Business",
        value: p.businessCount ? String(p.businessCount) : "0",
      },
      {
        label: "Economy",
        value: p.economyCount ? String(p.economyCount) : "0",
      },
      { label: "Crew", value: p.crewCount ? String(p.crewCount) : "0" },
    ];
  }, [selectedFlight]);

  const handleOpenPaxModal = () => {
    buttonRef.current?.measure((fx, fy, width, height, px, py) => {
      setDropdownPos({ top: py + height + 5, left: px });
      setPaxModalVisible(true);
    });
  };

  const handleOpenDetailModal = (item: Preparation) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  const handleSequenceCheck = (
    stepName: "prepared" | "sealed" | "locked" | "verify" | "delivery",
    item: Preparation,
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

  const renderItem = ({ item }: { item: Preparation }) => {
    const isPrepared = !!item.isContentPrepared;
    const isSealed = !!item.sealTagNumber;
    const isDelivered = item.loadedTruckFlag === "loaded";

    const RenderBoxIcon = isPrepared ? BoxIcon : BoxInactiveIcon;
    const RenderStringIcon = isSealed ? StringIcon : StringInactiveIcon;
    const RenderDeliveryIcon = isDelivered
      ? DeliveryIcon
      : DeliveryInactiveIcon;

    return (
      <View className="flex-row items-center px-4 py-2 border-b border-bg-tertiary bg-bg-surface">
        <View className="flex-[2] justify-center">
          <Text className="text-lg text-text-primary font-semibold">
            {item.position}
          </Text>
        </View>
        <View className="flex-[3] justify-center">
          <Text className="text-lg text-text-primary">
            {item.nameDisplay || "N/A"}
          </Text>
        </View>
        <View className="flex-[4] flex-row justify-end items-center gap-5">
          <TouchableOpacity onPress={() => setPdfVisible(true)}>
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
            <LockOpenIcon height={30} width={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSequenceCheck("verify", item)}>
            <CheckIcon height={30} width={30} />
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
                  backgroundColor: "#602AF3",
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
                  {Math.floor(Math.random() * 3) + 1}
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

  return (
    <View className="flex-1 bg-bg-surface p-4">
      <PdfViewerModal
        visible={pdfVisible}
        onClose={() => setPdfVisible(false)}
        source={SAMPLE_PDF}
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
            <View className="h-px bg-border-muted mb-2.5" />
            {dynamicPaxData.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center mb-2"
              >
                <Text className="text-lg text-text-secondary flex-1">
                  {item.label}
                </Text>
                <Text className="text-sm font-semibold text-text-primary">
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <FlightPreparationDetailsModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        stowage={selectedItem?.name}
        carrier={selectedItem?.equipment}
      />

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
              Assemble Scan
            </Text>
          </Pressable>
          <Pressable className="flex-row items-center bg-bg-tertiary py-2.5 px-4 rounded-md mr-3">
            <ScanIcon height={28} width={28} />
            <Text className="text-xl font-normal m-0.5 text-text-primary">
              Load Scan
            </Text>
          </Pressable>
        </View>

        <View className="flex-1 flex-row justify-end">
          <MultiSelectFilter
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
          >
            <PrintIcon />
            <Text className="text-xl font-normal m-0.5 text-text-primary">
              Print
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

        {isPrepLoading ? (
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
