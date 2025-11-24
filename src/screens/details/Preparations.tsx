import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  BoxIcon,
  CheckIcon,
  DeliveryIcon,
  InfoIcon,
  LockOpenIcon,
  PrintIcon,
  QrIcon,
  ScanIcon,
  SeatIcon,
  StringIcon,
} from "../../assets/icons";

import { FlightPreparationDetailsModal } from "../../components/flight-hub/FlightPreparationDetailsModal";
import { PdfViewerModal } from "../../components/flight-hub/PDFViewerModal";
import { useFlightStore } from "../../store/useFlightStore";
import { Preparation } from "../../types/preparations";

const SAMPLE_PDF = require("../../assets/sample.pdf");

export const PreparationsScreen: React.FC = () => {
  const [paxModalVisible, setPaxModalVisible] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Preparation | null>(null);
  const [pdfVisible, setPdfVisible] = useState(false);
  const buttonRef = useRef<View>(null);

  // Split selectors to avoid infinite loops
  const selectedFlight = useFlightStore((state) => state.selectedFlight);
  const preparations = useFlightStore((state) => state.preparations);
  const isPrepLoading = useFlightStore((state) => state.isPrepLoading);

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
      {
        label: "Crew",
        value: p.crewCount ? String(p.crewCount) : "0",
      },
    ];
  }, [selectedFlight]);

  const handleOpenPaxModal = () => {
    buttonRef.current?.measure((fx, fy, width, height, px, py) => {
      setDropdownPos({
        top: py + height + 5,
        left: px,
      });
      setPaxModalVisible(true);
    });
  };

  const handleOpenDetailModal = (item: Preparation) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  const handleOpenPdf = () => {
    setPdfVisible(true);
  };

  // --- RENDER ITEM ---
  const renderItem = ({ item }: { item: Preparation }) => (
    <View className="flex-row items-center px-4 py-2 border-b border-bg-tertiary">
      {/* Column 1: Stowage (Double Width) */}
      <View className="flex-[2] justify-center">
        <Text className="text-lg text-text-primary font-semibold">
          {item.name}
        </Text>
      </View>

      {/* Column 2: Carrier */}
      <View className="flex-[3] justify-center">
        <Text className="text-lg text-text-primary">
          {item.equipment || "N/A"}
        </Text>
      </View>

      {/* Column 3: Action Icons */}
      <View className="flex-[4] flex-row justify-end items-center gap-5">
        <TouchableOpacity onPress={handleOpenPdf}>
          <QrIcon height={30} width={30} />
        </TouchableOpacity>
        <BoxIcon height={30} width={30} />
        <StringIcon height={30} width={30} />
        <LockOpenIcon height={30} width={30} />
        <CheckIcon height={30} width={30} />
        <DeliveryIcon height={30} width={30} />

        <TouchableOpacity onPress={() => handleOpenDetailModal(item)}>
          <InfoIcon height={30} width={30} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-bg-surface p-4">
      <PdfViewerModal
        visible={pdfVisible}
        onClose={() => setPdfVisible(false)}
        source={SAMPLE_PDF}
      />

      {/* Pax Modal */}
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
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
            }}
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

      {/* Buttons Row */}
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

          <Pressable className="flex-row items-center bg-bg-tertiary py-2.5 px-4 rounded-md mr-3">
            <PrintIcon />
            <Text className="text-xl font-normal m-0.5 text-text-primary">
              Print
            </Text>
          </Pressable>
        </View>
      </View>

      {/* --- TABLE HEADER AND LIST --- */}
      <View className="flex-1 border border-border-secondary rounded-[10px]">
        {/* Header */}
        <View className="flex-row bg-bg-quaternary p-4 border-b border-border-muted rounded-t-[10px]">
          {/* Col 1 */}
          <View className="flex-[2]">
            <Text className="text-lg font-semibold text-text-secondary">
              Stowage
            </Text>
          </View>

          {/* Col 2 */}
          <View className="flex-[3]">
            <Text className="text-lg font-semibold text-text-secondary">
              Carrier
            </Text>
          </View>

          {/* Col 3 - Aligned to End to match Icons */}
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
          <FlatList
            style={{ flex: 1 }}
            data={preparations}
            removeClippedSubviews={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <View className="p-4">
                <Text className="text-center text-text-muted mt-6">
                  No preparations found for this flight.
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};
