import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
  TouchableOpacity,
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
import { stowageData, StowageItem } from "../../const/PreparationData";
import { FlightPreparationDetailsModal } from "../../components/flight-hub/FlightPreparationDetailsModal";
import { PdfViewerModal } from "../../components/flight-hub/PDFViewerModal";

const SAMPLE_PDF = require("../../assets/sample.pdf");

const PAX_DATA = [
  { label: "Business Studio", value: "" },
  { label: "Business", value: "17" },
  { label: "Economy", value: "243" },
  { label: "Crew", value: "14" },
];

export const PreparationsScreen: React.FC = () => {
  const [paxModalVisible, setPaxModalVisible] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StowageItem | null>(null);
  const [pdfVisible, setPdfVisible] = useState(false);

  const buttonRef = useRef<View>(null);

  const handleOpenPaxModal = () => {
    buttonRef.current?.measure((fx, fy, width, height, px, py) => {
      setDropdownPos({
        top: py + height + 5,
        left: px,
      });
      setPaxModalVisible(true);
    });
  };

  const handleOpenDetailModal = (item: StowageItem) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  const handleOpenPdf = () => {
    setPdfVisible(true);
  };

  const renderItem = ({ item }: { item: StowageItem }) => (
    <View className="flex-row items-center px-4 py-2 border-b border-bg-tertiary">
      <Text className="flex-1 text-lg text-text-primary font-semibold">
        {item.stowage}
      </Text>
      <Text className="flex-[3] text-lg text-text-primary">{item.carrier}</Text>

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
      {/* PDF Viewer Modal */}
      <PdfViewerModal
        visible={pdfVisible}
        onClose={() => setPdfVisible(false)}
        source={SAMPLE_PDF}
      />

      {/* Pax Count Dropdown Modal */}
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
            <View className="h-px bg-border-muted mb-2.5" />

            {PAX_DATA.map((item, index) => (
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

      {/* Details Modal */}
      <FlightPreparationDetailsModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        stowage={selectedItem?.stowage}
        carrier={selectedItem?.carrier}
      />

      {/* Top Button Row */}
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

      {/* Main List Table */}
      <View className="flex-1 border border-border-secondary rounded-[10px]">
        <View className="flex-row bg-bg-quaternary p-4 border-b border-border-muted rounded-t-[10px]">
          <Text className="flex-1 text-lg font-semibold text-text-secondary">
            Stowage
          </Text>
          <Text className="flex-[3] text-lg font-semibold text-text-secondary">
            Carrier
          </Text>
          <Text className="flex-[4] text-lg font-semibold text-text-secondary">
            <Text style={{ paddingLeft: 600, textAlign: "center" }}>
              Action
            </Text>
          </Text>
        </View>

        <FlatList
          style={{ flex: 1 }}
          data={[...stowageData, ...stowageData, ...stowageData]}
          removeClippedSubviews={false}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id + index}
          ListEmptyComponent={() => (
            <View className="p-4">
              <Text className="text-center text-text-muted mt-6">
                No stowage data found.
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};
