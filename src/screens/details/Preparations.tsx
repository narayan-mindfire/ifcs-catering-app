import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const ScanIcon = () => <Text style={styles.icon}>[📷]</Text>;

export const PreparationsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Sub-buttons */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.actionButton}>
          <ScanIcon />
          <Text style={styles.actionButtonText}>Prep Scan</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <ScanIcon />
          <Text style={styles.actionButtonText}>Verify Seal</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <ScanIcon />
          <Text style={styles.actionButtonText}>Assemble Scan</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <ScanIcon />
          <Text style={styles.actionButtonText}>Load Scan</Text>
        </Pressable>
      </View>

      {/* Content Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Stowage</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Carrier</Text>
        <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>
          Action
        </Text>
      </View>
      {/* Content Table Body (empty for now) */}
      <View style={styles.tableBody}>
        <Text style={styles.emptyText}>No stowage data found.</Text>
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
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  tableBody: {
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
