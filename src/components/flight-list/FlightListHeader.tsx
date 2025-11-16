import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const FlightListHeader: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      {/* Row 1: Grouped Header */}
      <View
        style={[styles.headerRow, styles.groupHeader, styles.horizontalPadding]}
      >
        {/* Flight Group: flex 53 (6+12+8+3+6+6+6+6) */}
        <View style={[styles.groupCell, { flex: 51 }]}>
          <View style={styles.groupCellContent}>
            {/* <Icon name="airplane" size={16} color="#555" /> */}
            <Text style={styles.groupHeaderText}>Flight</Text>
          </View>
        </View>

        {/* Aircraft Group: flex 15 (10+5) */}
        <View style={[styles.groupCell, { flex: 15 }]}>
          <View style={styles.groupCellContent}>
            {/* <Icon name="airplane-outline" size={16} color="#555" /> */}
            <Text style={styles.groupHeaderText}>Aircraft</Text>
          </View>
        </View>

        {/* PAX Group: flex 5 (5) */}
        <View style={[styles.groupCell, { flex: 5 }]}>
          <View style={styles.groupCellContent}>
            {/* <Icon name="people-outline" size={16} color="#555" /> */}
            <Text style={styles.groupHeaderText}>PAX</Text>
          </View>
        </View>

        {/* Spot Group: flex 4 (4) */}
        <View style={[styles.groupCell, styles.noBorder, { flex: 4 }]}>
          <View style={styles.groupCellContent}>
            {/* <Icon name="eye-outline" size={16} color="#555" /> */}
            <Text style={styles.groupHeaderText}>Spot</Text>
          </View>
        </View>
      </View>

      {/* Row 2: Column Header */}
      <View
        style={[
          styles.headerRow,
          styles.columnHeader,
          styles.horizontalPadding,
        ]}
      >
        {/* Flight columns: Total Flex 53 */}
        <View style={[styles.columnCell, { flex: 6 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Airline</Text>
          </View>
        </View>
        <View style={[styles.columnCell, { flex: 12 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Route</Text>
          </View>
        </View>
        <View style={[styles.columnCell, { flex: 8 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Flight #</Text>
          </View>
        </View>
        <View style={[styles.columnCell, { flex: 3 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Type</Text>
          </View>
        </View>
        <View style={[styles.columnCell, { flex: 6 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Date</Text>
          </View>
        </View>
        <View style={[styles.columnCell, { flex: 6 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Departure</Text>
          </View>
        </View>
        <View style={[styles.columnCell, { flex: 6 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Arrival</Text>
          </View>
        </View>
        <View style={[styles.columnCell, styles.rightBorder, { flex: 6 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Status</Text>
          </View>
        </View>

        {/* Aircraft columns: Total Flex 15 */}
        <View style={[styles.columnCell, styles.rightBorder, { flex: 10 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>AC Type/AC Reg</Text>
          </View>
        </View>
        <View style={[styles.columnCell, styles.rightBorder, { flex: 5 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Ground</Text>
          </View>
        </View>

        {/* PAX column: Total Flex 5 */}
        <View style={[styles.columnCell, styles.rightBorder, { flex: 5 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Total</Text>
          </View>
        </View>

        {/* Spot column: Total Flex 4 */}
        <View style={[styles.columnCell, { flex: 4 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}></Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  horizontalPadding: {
    // Moved padding here to affect the whole row consistently
    paddingHorizontal: 10,
  },
  groupHeader: {
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  groupCell: {
    // Only apply border to the right side of the cell
    // borderRightWidth: 1,
    // borderRightColor: "#7b7979ff",
  },
  groupCellContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  groupHeaderText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  noBorder: {
    borderRightWidth: 0,
  },
  columnHeader: {
    backgroundColor: "#b6b6b6ff",
  },
  columnCell: {
    paddingHorizontal: 4,
  },
  columnCellContent: {
    justifyContent: "center",
    paddingVertical: 12,
  },
  columnHeaderText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000000ff",
    textAlign: "left",
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    marginRight: 4,
  },
});
