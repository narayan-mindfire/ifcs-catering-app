import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

import { PreparationsScreen } from "./details/Preparations";
import { FoodOrderScreen } from "./details/FoodOrder";
import { InvoiceScreen } from "./details/Invoice";
import { DeliveriesScreen } from "./details/Deliveries";
import { BreadCrumb } from "../components/common/BreadCrumbs";

type FlightDetailTabParamList = {
  Preparations: undefined;
  FoodOrder: undefined;
  Deliveries: undefined;
  Invoice: undefined;
};

const Tab = createMaterialTopTabNavigator<FlightDetailTabParamList>();

type Props = StackScreenProps<RootStackParamList, "FlightDetails">;

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const inactiveColor = "#8e8e93";

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabButton,
              isFocused ? styles.tabButtonActive : styles.tabButtonInactive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: isFocused ? "#fff" : inactiveColor },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const FlightDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { flightId, route: flightRoute, date } = route.params;

  const [currentTab, setCurrentTab] = React.useState("Preparations");
  const breadcrumbItems = [
    {
      label: "Flights",
      onPress: () => navigation.navigate("Flights", {} as any),
    },
    {
      label: `Flight Details`,
      onPress: () => {},
    },
    {
      label: currentTab,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BreadCrumb items={breadcrumbItems} />

        <View style={styles.flightInfo}>
          <Text style={styles.infoText}>FLIGHT: {flightId}</Text>
          <Text style={styles.infoText}>ROUTE: {flightRoute}</Text>
          <Text style={styles.infoText}>DATE: {date}</Text>
        </View>
      </View>

      <Tab.Navigator
        style={{ flex: 1 }}
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          animationEnabled: false,
          swipeEnabled: false,
          lazy: true,
        }}
        screenListeners={{
          state: (e) => {
            const index = e.data.state.index;
            const routes = e.data.state.routes;
            const currentRouteName = routes[index].name;
            setCurrentTab(currentRouteName);
          },
        }}
      >
        <Tab.Screen name="Preparations" component={PreparationsScreen} />
        <Tab.Screen name="FoodOrder" component={FoodOrderScreen} />
        <Tab.Screen name="Deliveries" component={DeliveriesScreen} />
        <Tab.Screen name="Invoice" component={InvoiceScreen} />
      </Tab.Navigator>
    </View>
  );
};

export default FlightDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  flightInfo: {
    flexDirection: "row",
    padding: 16,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 20,
  },
  tabBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: "#fff",
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: "#602AF3",
  },
  tabButtonInactive: {
    backgroundColor: "#f0f0f0",
  },
  tabText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
