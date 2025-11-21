import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const FlightListHeader: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <View
        style={[styles.headerRow, styles.groupHeader, styles.horizontalPadding]}
      >
        <View style={[styles.groupCell, { flex: 57 }]}>
          <View style={styles.groupCellContent}>
            <Text style={styles.groupHeaderText}>Flight</Text>
          </View>
        </View>

        <View style={[styles.groupCell, { flex: 10 }]}>
          <View style={styles.groupCellContent}>
            <Text style={[styles.groupHeaderText, { paddingEnd: 22 }]}>
              Aircraft
            </Text>
          </View>
        </View>

        {/* PAX Group: flex 5 */}
        <View style={[styles.groupCell, { flex: 5 }]}>
          <View style={styles.groupCellContent}>
            <Text style={[styles.groupHeaderText, { paddingEnd: 22 }]}>
              PAX
            </Text>
          </View>
        </View>

        {/* Spot Group: flex 4 */}
        <View style={[styles.groupCell, styles.noBorder, { flex: 4 }]}>
          <View style={styles.groupCellContent}>
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
        {/* Flight columns */}
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
        <View style={[styles.columnCell, { flex: 7 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Date</Text>
          </View>
        </View>
        <View style={[styles.columnCell, { flex: 7 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Departure</Text>
          </View>
        </View>
        <View style={[styles.columnCell, { flex: 7 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Arrival</Text>
          </View>
        </View>
        <View style={[styles.columnCell, styles.rightBorder, { flex: 7 }]}>
          <View style={styles.columnCellContent}>
            <Text style={styles.columnHeaderText}>Status</Text>
          </View>
        </View>

        {/* Aircraft columns */}
        <View style={[styles.columnCell, styles.rightBorder, { flex: 10 }]}>
          <View style={styles.columnCellContent}>
            <Text style={[styles.columnHeaderText, { textAlign: "center" }]}>
              AC Type/Reg
            </Text>
          </View>
        </View>

        <View style={[styles.columnCell, styles.rightBorder, { flex: 5 }]}>
          <View style={styles.columnCellContent}>
            <Text style={[styles.columnHeaderText, { textAlign: "center" }]}>
              Total
            </Text>
          </View>
        </View>

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
    paddingHorizontal: 10,
  },
  groupHeader: {
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  groupCell: {
    // borderRightWidth: 1,
    // borderRightColor: "#7b7979ff",
  },
  groupCellContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10, // Increased vertical padding
  },
  groupHeaderText: {
    marginLeft: 6,
    fontSize: 16, // Increased from 14
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
    fontSize: 14, // Increased from 12
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
