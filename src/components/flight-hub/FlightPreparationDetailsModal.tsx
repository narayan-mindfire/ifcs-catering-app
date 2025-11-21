import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
} from "react-native";
// Ensure you import your icons here
import { LockIcon, CheckIcon, StringIcon } from "../../assets/icons"; // Replace SealIcon with whatever icon you use for "Sealed"
import { Checkbox } from "../flight-hub/SharedComponents"; // Reusing your existing Checkbox

interface FlightPreparationModalProps {
  visible: boolean;
  onClose: () => void;
  stowage?: string;
  carrier?: string;
  equipment?: string;
}

const DRAWER_ITEMS = [
  { qty: 1, item: "DRAWER LINER 10” X 14 1/2” ATLAS" },
  { qty: 3, item: "White Wine Montenero 187ml eco" },
  { qty: 1, item: "Red Wine Montenero 187ml eco" },
];

export const FlightPreparationDetailsModal: React.FC<
  FlightPreparationModalProps
> = ({
  visible,
  onClose,
  stowage = "1202",
  carrier = "Purser Kit",
  equipment = "Canister Small Square Atlas",
}) => {
  const [isLooseItems, setIsLooseItems] = useState(false);

  // State for the 3 checkboxes
  const [isLocked, setIsLocked] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* --- Header --- */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.title}>Flight Preparation Plan Details</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeX}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>
                Stowage: <Text style={styles.metaValue}>{stowage}</Text>
              </Text>
              <Text style={styles.metaLabel}>
                Carrier: <Text style={styles.metaValue}>{carrier}</Text>
              </Text>
              <Text style={styles.metaLabel}>
                Equipment: <Text style={styles.metaValue}>{equipment}</Text>
              </Text>
            </View>
          </View>

          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.scrollContent}
          >
            {/* --- STATUS ROW (UPDATED) --- */}
            <View style={styles.statusRowContainer}>
              {/* 1. Locked */}
              <TouchableOpacity
                style={styles.statusCheckboxItem}
                onPress={() => setIsLocked(!isLocked)}
                activeOpacity={0.7}
              >
                <View style={styles.statusLabelGroup}>
                  {/* Icon on the left */}
                  {LockIcon ? (
                    <LockIcon width={20} height={20} />
                  ) : (
                    <Text>🔒</Text>
                  )}
                  <Text style={styles.statusLabelText}>Locked</Text>
                </View>
                {/* Checkbox on the right */}
                <Checkbox checked={isLocked} onChange={setIsLocked} />
              </TouchableOpacity>

              {/* 2. Sealed */}
              <TouchableOpacity
                style={styles.statusCheckboxItem}
                onPress={() => setIsSealed(!isSealed)}
                activeOpacity={0.7}
              >
                <View style={styles.statusLabelGroup}>
                  <StringIcon />
                  <Text style={styles.statusLabelText}>Sealed</Text>
                </View>
                <Checkbox checked={isSealed} onChange={setIsSealed} />
              </TouchableOpacity>

              {/* 3. Completed */}
              <TouchableOpacity
                style={styles.statusCheckboxItem}
                onPress={() => setIsCompleted(!isCompleted)}
                activeOpacity={0.7}
              >
                <View style={styles.statusLabelGroup}>
                  <CheckIcon />
                  <Text style={styles.statusLabelText}>Completed</Text>
                </View>
                <Checkbox checked={isCompleted} onChange={setIsCompleted} />
              </TouchableOpacity>
            </View>

            {/* --- Main Grid --- */}
            <View style={styles.gridContainer}>
              {/* Left Column: Images */}
              <View style={styles.leftColumn}>
                <View style={styles.imageSection}>
                  <Text style={styles.imageTitle}>Position in Galley</Text>
                  <Image
                    source={require("../../assets/icons/preparations_details/galley0.png")}
                    style={styles.galleyImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.imageSection}>
                  <Text style={styles.imageTitle}>Ultralight bluedart</Text>
                  <Image
                    source={require("../../assets/icons/preparations_details/galley1.png")}
                    style={styles.cartImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Right Column: Table */}
              <View style={styles.rightColumn}>
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Loose Items</Text>
                  <Switch
                    value={isLooseItems}
                    onValueChange={setIsLooseItems}
                    trackColor={{ false: "#ccc", true: "#602AF3" }}
                  />
                </View>

                <View style={styles.tableContainer}>
                  <View style={styles.tableHeaderBar}>
                    <Text style={styles.tableHeaderTitle}>
                      Selected:{" "}
                      <Text style={{ color: "#27262C" }}>Drawer 3</Text>
                    </Text>
                  </View>
                  <View style={styles.tableHeadRow}>
                    <Text style={[styles.th, { flex: 1 }]}>Qty.</Text>
                    <Text style={[styles.th, { flex: 4 }]}>Item</Text>
                    <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>
                      Action
                    </Text>
                  </View>
                  {DRAWER_ITEMS.map((row, idx) => (
                    <View key={idx} style={styles.tableRow}>
                      <Text
                        style={[styles.td, { flex: 1, textAlign: "center" }]}
                      >
                        {row.qty}
                      </Text>
                      <Text style={[styles.td, { flex: 4 }]}>{row.item}</Text>
                      <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <View style={styles.iconPlaceholder}>
                          <Text>📷</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addImageButton}>
                    <Text style={styles.addImageText}>Add Image</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* --- Footer --- */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  modalContainer: {
    width: "90%",
    maxWidth: 1000,
    height: "85%",
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE9EC",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "500", color: "#4F4B58" },
  closeX: { fontSize: 24, color: "#999" },
  metaRow: { flexDirection: "row", gap: 24, flexWrap: "wrap" },
  metaLabel: { fontSize: 14, color: "#A09CAB" },
  metaValue: { fontSize: 16, color: "#4F4B58", fontWeight: "500" },
  contentScroll: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollContent: { padding: 24 },

  // --- NEW STATUS ROW STYLES ---
  statusRowContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    justifyContent: "space-around", // Spread items evenly
    alignItems: "center",
  },
  statusCheckboxItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // Space between (Icon+Text) and Checkbox
  },
  statusLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Space between Icon and Text
  },
  statusLabelText: {
    fontSize: 16,
    color: "#4F4B58",
    fontWeight: "500",
  },

  // ... grid and table styles remain the same ...
  gridContainer: { flexDirection: "row", gap: 24 },
  leftColumn: {
    flex: 2,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 16,
  },
  rightColumn: { flex: 1 },
  imageSection: { flex: 1, alignItems: "center", justifyContent: "flex-start" },
  imageTitle: { fontSize: 16, color: "#4F4B58", marginBottom: 12 },
  galleyImage: { width: "100%", height: 300 },
  cartImage: { width: "100%", height: 200, marginTop: 20 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  toggleLabel: { fontSize: 14, color: "#A09CAB" },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAE9EC",
    overflow: "hidden",
  },
  tableHeaderBar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE9EC",
  },
  tableHeaderTitle: { fontSize: 16, color: "#A09CAB" },
  tableHeadRow: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE9EC",
  },
  th: { fontWeight: "600", color: "#27262C", fontSize: 12 },
  tableRow: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE9EC",
    alignItems: "center",
  },
  td: { fontSize: 14, color: "#4F4B58" },
  iconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: "#eee",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageButton: {
    margin: 16,
    backgroundColor: "#dfdddd",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addImageText: { color: "#4F4B58", fontWeight: "500" },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EAE9EC",
    alignItems: "flex-end",
  },
  closeButton: {
    borderWidth: 1,
    borderColor: "#EAE9EC",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  closeButtonText: { color: "#4F4B58", fontSize: 14 },
});
