import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { Header } from "../components/dashboard/Header";
import { Breadcrumb } from "../components/common/BreadCrumbs";

type MemosScreenRouteProp = RouteProp<RootStackParamList, "Memos">;
type MemosScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Memos"
>;

interface Props {
  route: MemosScreenRouteProp;
  navigation: MemosScreenNavigationProp;
}

const MemosScreen: React.FC<Props> = ({ route, navigation }) => {
  const { flightId } = route.params;

  return (
    <View style={styles.container}>
      <Header userName={"Shitanshu"} onUserPress={() => {}} />
      <Breadcrumb currentScreen={"Memos"} />
      <View style={styles.content}>
        <Text style={styles.title}>Memos Screen</Text>
        <Text style={styles.flightId}>Flight ID: {flightId}</Text>
        <Text style={styles.description}>
          This is the Memos screen. Add your content here.
        </Text>
      </View>
    </View>
  );
};

export default MemosScreen;

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
