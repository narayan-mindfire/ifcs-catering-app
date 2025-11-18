import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
// Assuming these icons exist in your project based on previous code
import { FoodOrderItem, foodOrderData } from "../../const/foodOrderData";

export const FoodOrderScreen: React.FC = () => {
  const totals = foodOrderData.reduce(
    (acc, item) => {
      acc.ordered += Number(item.ordered) || 0;
      acc.distributed += Number(item.distributed) || 0;
      acc.loaded += Number(item.loaded) || 0;
      return acc;
    },
    { ordered: 0, distributed: 0, loaded: 0 },
  );
  // Helper to render the "Total" row
  const renderSummaryRow = () => (
    <View style={[styles.tableRow, { backgroundColor: "#fff" }]}>
      <Text style={[styles.tableCell, { flex: 1 }]}></Text>
      <Text style={[styles.tableCell, { flex: 1 }]}></Text>
      <Text style={[styles.tableCell, { flex: 1 }]}></Text>
      <Text style={[styles.tableCell, { flex: 2 }]}></Text>
      <Text style={[styles.tableCell, { flex: 1 }]}></Text>
      <Text style={[styles.tableCell, { flex: 1 }]}></Text>
      <Text
        style={[
          styles.tableCell,
          { flex: 3, textAlign: "right", paddingRight: 20, color: "#888" },
        ]}
      >
        Total
      </Text>
      <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
        {totals.ordered}
      </Text>
      <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
        {totals.distributed}
      </Text>
      <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
        {totals.loaded}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: FoodOrderItem }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.station}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.flightNumber}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.sku}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.cabin}</Text>
      <Text style={[styles.tableCell, { flex: 3 }]}>{item.mealName}</Text>
      <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
        {item.ordered}
      </Text>
      <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
        {item.distributed}
      </Text>
      <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
        {item.loaded}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Table Area */}
      <View style={styles.tableContainer}>
        {/* Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Station</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>FLT #</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>SKU</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Cabin</Text>
          <Text style={[styles.tableHeaderText, { flex: 3 }]}>Name Y</Text>
          {/* Added Y to simulate the filter icon in your image */}
          <Text
            style={[styles.tableHeaderText, { flex: 1, textAlign: "center" }]}
          >
            Ordered
          </Text>
          <Text
            style={[styles.tableHeaderText, { flex: 1, textAlign: "center" }]}
          >
            Distributed
          </Text>
          <Text
            style={[styles.tableHeaderText, { flex: 1, textAlign: "center" }]}
          >
            Loaded
          </Text>
        </View>

        {/* Summary Row (Total) */}
        {renderSummaryRow()}

        {/* List */}
        <FlatList
          style={{ flex: 1 }}
          data={[
            ...foodOrderData,
            ...foodOrderData,
            ...foodOrderData,
            ...foodOrderData,
          ]}
          keyExtractor={(item, index) => item.id + index}
          removeClippedSubviews={false}
          onLayout={() => {}}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View style={styles.tableBody}>
              <Text style={styles.emptyText}>No food orders found.</Text>
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
    gap: 12,
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
    fontSize: 18,
    fontWeight: "400",
    marginLeft: 8,
    color: "#333",
  },
  tableContainer: {
    flex: 1, // Ensure it fills space
    borderWidth: 1,
    borderColor: "#a09e9eff",
    borderRadius: 10,
    overflow: "hidden", // Keeps the header inside the border radius
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2", // Slightly darker grey as per image
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
  tableBody: {
    padding: 16,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tableCell: {
    fontSize: 18,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 24,
  },
});
