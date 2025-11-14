import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";

type BreadcrumbNavigationProp = StackNavigationProp<RootStackParamList>;

interface BreadcrumbProps {
  flightId?: string;
  currentScreen: keyof RootStackParamList;
  subItem?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  flightId,
  currentScreen,
  subItem,
}) => {
  const navigation = useNavigation<BreadcrumbNavigationProp>();

  const handleHomePress = () => {
    navigation.navigate("Dashboard");
  };

  const formatScreenName = (name: string) => {
    const screenNames: Record<string, string> = {
      Dashboard: "Dashboard",
      SpotCheck: "Spot Check",
      Flights: "flights",
      Memos: "Memos",
      Documents: "Documents",
    };

    return screenNames[name] || name.replace(/([A-Z])/g, " $1").trim();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleHomePress} style={styles.breadcrumbItem}>
        <Text style={styles.homeText}>Home</Text>
      </TouchableOpacity>

      <Text style={styles.separator}>›</Text>

      <Text style={[styles.breadcrumbItem, styles.currentText]}>
        {formatScreenName(currentScreen)}
      </Text>

      {subItem && (
        <>
          <Text style={styles.separator}>›</Text>
          <Text style={[styles.breadcrumbItem, styles.subItemText]}>
            {subItem}
          </Text>
        </>
      )}

      {flightId && (
        <>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.flightIdText}>Flight: {flightId}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  breadcrumbItem: {
    marginHorizontal: 4,
  },
  homeText: {
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "500",
  },
  currentText: {
    fontSize: 20,
    color: "#666666",
    fontWeight: "400",
  },
  subItemText: {
    fontSize: 22,
    color: "#3a3939ff",
    fontWeight: "500",
  },
  flightIdText: {
    fontSize: 12,
    color: "#999999",
    fontWeight: "400",
    fontStyle: "italic",
  },
  separator: {
    fontSize: 16,
    color: "#999999",
    marginHorizontal: 8,
  },
});
