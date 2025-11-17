// /screens/FlightsScreen.tsx

import React from "react";
import { View, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { Header } from "../components/dashboard/Header";
import { Breadcrumb } from "../components/common/BreadCrumbs";

import { flightsData, FlightListItem } from "../const/flightsData";
import { FlightRow } from "../components/flight-list/FlightRow"; // Check this path
import { FlightListHeader } from "../components/flight-list/FlightListHeader"; // Check this path

type FlightsScreenRouteProp = RouteProp<RootStackParamList, "Flights">;
type FlightsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Flights"
>;

interface Props {
  route: FlightsScreenRouteProp;
  navigation: FlightsScreenNavigationProp;
}

const FlightsScreen: React.FC<Props> = ({ route, navigation }) => {
  //
  // ▼▼▼ THIS FUNCTION MUST BE *INSIDE* THE COMPONENT ▼▼▼
  // This gives it access to the 'navigation' prop passed to FlightsScreen
  //
  const renderItem = ({ item }: { item: FlightListItem }) => {
    if (item.type === "separator") {
      return <View style={styles.separator} />;
    }
    // Now, 'navigation' is defined and will be passed to FlightRow
    return <FlightRow flight={item} navigation={navigation} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header userName={"Shitanshu"} onUserPress={() => {}} />
      <Breadcrumb currentScreen={"Flights"} />
      <FlatList
        style={{ flex: 1 }} // Add flex: 1 to fill remaining space
        data={flightsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<FlightListHeader />}
        stickyHeaderIndices={[0]}
      />
    </SafeAreaView>
  );
};

export default FlightsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  separator: {
    height: 24,
    backgroundColor: "#e1e1e1ff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
});