import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useFlightStore } from "../store/useFlightStore";

import { PreparationsScreen } from "./details/Preparations";
// import { FoodOrderScreen } from "./details/FoodOrder";
// import { InvoiceScreen } from "./details/Invoice";
import DeliveriesScreen from "./details/Deliveries";
import { BreadCrumb } from "../components/common/BreadCrumbs";
// import { formatDate } from "../utils/dateFormatter";

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
    <View className="flex-row px-3 pt-2.5 bg-bg-surface gap-2">
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
            className={`flex-1 py-4 rounded-lg flex-row items-center justify-center ${
              isFocused ? "bg-bg-button" : "bg-bg-tertiary"
            }`}
          >
            <Text
              className="text-xl font-medium"
              style={{ color: isFocused ? "#fff" : inactiveColor }}
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
  const { flightId, route: flightRoute, flightNumber, date } = route.params;
  const selectFlightById = useFlightStore((state) => state.selectFlightById);

  useEffect(() => {
    if (flightId) {
      selectFlightById(flightId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId]);

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
    <View className="flex-1 bg-bg-surface">
      <View className="bg-bg-surface border-b border-border-muted">
        <BreadCrumb items={breadcrumbItems} />

        <View className="flex-row p-4">
          <Text className="text-2xl font-semibold text-text-primary mr-5">
            FLIGHT:
            <Text className="text-text-secondary"> WY{flightNumber}</Text>
          </Text>
          <Text className="text-2xl font-semibold text-text-primary mr-5">
            ROUTE: <Text className="text-text-secondary">MCT-TRV-MCT</Text>
            <Text className="text-text-secondary">{flightRoute}</Text>
          </Text>
          <Text className="text-2xl font-semibold text-text-primary mr-5">
            DATE: <Text className="text-text-secondary">DEC 4, 2025</Text>
            {/* <Text className="text-text-secondary">
              {formatDate(date.split("T")[0])}
            </Text> */}
          </Text>
        </View>
      </View>

      <Tab.Navigator
        style={{ flex: 1 }}
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          animationEnabled: false,
          swipeEnabled: false,
          lazy: true,
          lazyPreloadDistance: 1,
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
        {/* <Tab.Screen name="FoodOrder" component={FoodOrderScreen} /> */}
        <Tab.Screen name="Deliveries" component={DeliveriesScreen} />
        {/* <Tab.Screen name="Invoice" component={InvoiceScreen} /> */}
      </Tab.Navigator>
    </View>
  );
};

export default FlightDetailsScreen;
