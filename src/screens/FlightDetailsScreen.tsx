import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";

import { BreadCrumb } from "../components/common/BreadCrumbs";
import DeliveriesScreen from "./details/Deliveries";
import { PreparationsScreen } from "./details/Preparations";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useFlightStore } from "../store/useFlightStore";
import { formatDate } from "../utils/dateFormatter";
import { AppButton } from "../components/common/AppButton";

type FlightDetailTabParamList = {
  Preparations: undefined;
  FoodOrder: undefined;
  Deliveries: undefined;
  Invoice: undefined;
};

type Props = StackScreenProps<RootStackParamList, "FlightDetails">;

const Tab = createMaterialTopTabNavigator<FlightDetailTabParamList>();

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) => {
  const inactiveColor = "#8e8e93";

  return (
    <View className="flex-row px-3 pt-2.5 bg-bg-surface gap-2">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
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
          <AppButton
            key={route.key}
            title={label}
            onPress={onPress}
            type={isFocused ? "primary" : "secondary"}
            style={{
              flex: 1,
              paddingVertical: 16,
            }}
            textStyle={{
              fontSize: 20,
              fontWeight: "500",
              color: isFocused ? "#fff" : inactiveColor,
            }}
          />
        );
      })}
    </View>
  );
};

const FlightDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { flightId, route: flightRoute, flightNumber, date } = route.params;
  const selectFlightById = useFlightStore((state) => state.selectFlightById);

  const [currentTab, setCurrentTab] = useState("Preparations");

  useEffect(() => {
    if (flightId) {
      selectFlightById(flightId);
    }
  }, [flightId, selectFlightById]);

  const breadcrumbItems = useMemo(
    () => [
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
    ],
    [navigation, currentTab],
  );

  const formattedDateString = useMemo(() => {
    return date ? formatDate(date).split(" ").join(" ") : "";
  }, [date]);

  const handleStateChange = useCallback((e: any) => {
    const index = e.data.state.index;
    const routes = e.data.state.routes;
    const currentRouteName = routes[index].name;
    setCurrentTab(currentRouteName);
  }, []);

  return (
    <View className="flex-1 bg-bg-surface">
      <View className="bg-bg-surface border-b border-border-muted">
        <BreadCrumb items={breadcrumbItems} />

        <View className="flex-row p-4">
          <Text className="text-2xl font-semibold text-text-primary mr-5">
            FLIGHT:
            <Text className="text-text-secondary"> {flightNumber}</Text>
          </Text>
          <Text className="text-2xl font-semibold text-text-primary mr-5">
            ROUTE: <Text className="text-text-secondary"> {flightRoute}</Text>
          </Text>
          <Text className="text-2xl font-semibold text-text-primary mr-5">
            <Text className="text-text-secondary">{formattedDateString}</Text>
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
          state: handleStateChange,
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
