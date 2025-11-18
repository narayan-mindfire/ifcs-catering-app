import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
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

export const PreparationsScreen: React.FC = () => {
  const renderItem = ({ item }: { item: StowageItem }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 1, fontWeight: "600" }]}>
        {item.stowage}
      </Text>
      <Text style={[styles.tableCell, { flex: 3 }]}>{item.carrier}</Text>
      <View style={[styles.actionCell, { flex: 4 }]}>
        <QrIcon height={30} width={30} />
        <BoxIcon height={30} width={30} />
        <StringIcon height={30} width={30} />
        <LockOpenIcon height={30} width={30} />
        <CheckIcon height={30} width={30} />
        <DeliveryIcon height={30} width={30} />
        <InfoIcon height={30} width={30} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
          <Pressable style={styles.actionButton}>
            <SeatIcon />
            <Text style={styles.actionButtonText}>PAX Count</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <PrintIcon />
            <Text style={styles.actionButtonText}>Print</Text>
          </Pressable>
        </View>
      </View>

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
          onLayout={() => {}}
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
  icon: {
    marginRight: 8,
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

  // --- NEW STYLES ---
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
  actionIcon: {
    fontSize: 18,
    color: "#555",
    marginHorizontal: 4,
  },
});
