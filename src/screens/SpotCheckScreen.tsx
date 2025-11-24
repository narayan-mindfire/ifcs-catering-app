import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { BreadCrumb } from "../components/common/BreadCrumbs";

type SpotCheckScreenRouteProp = RouteProp<RootStackParamList, "SpotCheck">;
type SpotCheckScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpotCheck"
>;

interface Props {
  route: SpotCheckScreenRouteProp;
  navigation: SpotCheckScreenNavigationProp;
}

const SpotCheckScreen: React.FC<Props> = ({ route, navigation }) => {
  const breadcrumbItems = [
    {
      label: "Dashboard",
      onPress: () => navigation.navigate("Dashboard"),
    },
    {
      label: "Spot Check",
    },
  ];

  return (
    <View style={styles.container}>
      <BreadCrumb items={breadcrumbItems} />

      <View style={styles.content}>
        <Text style={styles.title}>Spot Check Screen</Text>
        {/* <Text style={styles.flightId}>Flight ID: {flightId}</Text> */}
        <Text style={styles.description}>This is the Spot Check screen.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  flightId: {
    fontSize: 18,
    color: "#6b7280",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
  },
});

export default SpotCheckScreen;
