import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
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
// Custom Components
import { FlightPreparationDetailsModal } from "../../components/flight-hub/FlightPreparationDetailsModal";
import { PdfViewerModal } from "../../components/flight-hub/PDFViewerModal";
// Import your PDF file here
// Ensure 'sample.pdf' exists in your assets folder
const SAMPLE_PDF = require("../../assets/sample.pdf");

const PAX_DATA = [
  { label: "Business Studio", value: "" },
  { label: "Business", value: "17" },
  { label: "Economy", value: "243" },
  { label: "Crew", value: "14" },
];

export const PreparationsScreen: React.FC = () => {
  // --- State: Pax Modal ---
  const [paxModalVisible, setPaxModalVisible] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // --- State: Detail Modal ---
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StowageItem | null>(null);

  // --- State: PDF Modal ---
  const [pdfVisible, setPdfVisible] = useState(false);

  // Ref for positioning Pax Modal
  const buttonRef = useRef<View>(null);

  // --- Handlers ---

  const handleOpenPaxModal = () => {
    buttonRef.current?.measure((fx, fy, width, height, px, py) => {
      setDropdownPos({
        top: py + height + 5, // Position slightly below button
        left: px, // Align left edge
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
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 1, fontWeight: "600" }]}>
        {item.stowage}
      </Text>
      <Text style={[styles.tableCell, { flex: 3 }]}>{item.carrier}</Text>

      <View style={[styles.actionCell, { flex: 4 }]}>
        {/* 1. PDF Trigger */}
        <TouchableOpacity onPress={handleOpenPdf}>
          <QrIcon height={30} width={30} />
        </TouchableOpacity>

        <BoxIcon height={30} width={30} />
        <StringIcon height={30} width={30} />
        <LockOpenIcon height={30} width={30} />
        <CheckIcon height={30} width={30} />
        <DeliveryIcon height={30} width={30} />

        {/* 2. Details Modal Trigger */}
        <TouchableOpacity onPress={() => handleOpenDetailModal(item)}>
          <InfoIcon height={30} width={30} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* --- 1. PDF Viewer Modal --- */}
      <PdfViewerModal
        visible={pdfVisible}
        onClose={() => setPdfVisible(false)}
        source={SAMPLE_PDF}
      />

      {/* --- 2. Pax Count Dropdown Modal --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={paxModalVisible}
        onRequestClose={() => setPaxModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPaxModalVisible(false)}
        >
          <View
            style={[
              styles.paxModalContent,
              {
                top: dropdownPos.top,
                left: dropdownPos.left,
              },
            ]}
          >
            <Text style={styles.modalTitle}>Passenger Count</Text>
            <View style={styles.modalDivider} />

            {PAX_DATA.map((item, index) => (
              <View key={index} style={styles.modalRow}>
                <Text style={styles.modalLabel}>{item.label}</Text>
                <Text style={styles.modalValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- 3. Details Modal --- */}
      <FlightPreparationDetailsModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        stowage={selectedItem?.stowage}
        carrier={selectedItem?.carrier}
      />

      {/* --- Top Button Row --- */}
      <View style={styles.buttonRow}>
        <View style={styles.leftButton}>
          <Pressable style={styles.actionButton}>
            <ScanIcon height={28} width={28} />
            <Text style={styles.actionButtonText}>Prep Scan</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <ScanIcon height={28} width={28} />
            <Text style={styles.actionButtonText}>Verify Seal</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <ScanIcon height={28} width={28} />
            <Text style={styles.actionButtonText}>Assemble Scan</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <ScanIcon height={28} width={28} />
            <Text style={styles.actionButtonText}>Load Scan</Text>
          </Pressable>
        </View>

        <View style={styles.rightButton}>
          {/* Ref attached here for measurement */}
          <View ref={buttonRef} collapsable={false}>
            <Pressable style={styles.actionButton} onPress={handleOpenPaxModal}>
              <SeatIcon />
              <Text style={styles.actionButtonText}>PAX Count</Text>
            </Pressable>
          </View>

          <Pressable style={styles.actionButton}>
            <PrintIcon />
            <Text style={styles.actionButtonText}>Print</Text>
          </Pressable>
        </View>
      </View>

      {/* --- Main List Table --- */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Stowage</Text>
          <Text style={[styles.tableHeaderText, { flex: 3 }]}>Carrier</Text>
          <Text style={[styles.tableHeaderText, { flex: 4 }]}>
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
            <View style={styles.tableBody}>
              <Text style={styles.emptyText}>No stowage data found.</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 20,
    zIndex: 1,
  },
  leftButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  rightButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: "400",
    margin: 2,
    color: "#333",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderRadius: 10,
  },
  tableHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#a09e9eff",
    borderRadius: 10,
  },
  tableBody: {
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 24,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tableCell: {
    fontSize: 18,
    color: "#333",
  },
  actionCell: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent", // Allows clicking outside to close
  },
  paxModalContent: {
    position: "absolute",
    width: 250,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    // Drop Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 10,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalLabel: {
    fontSize: 18,
    color: "#555",
    flex: 1,
  },
  modalValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
