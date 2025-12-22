import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Header } from "../components/dashboard/Header";

import DashboardScreen from "../screens/DashboardScreen";
import DocumentsScreen from "../screens/DocumentsScreen";
import FlightsScreen from "../screens/FlightsScreen";
import FlightDetailsScreen from "../screens/FlightDetailsScreen";
import MemosScreen from "../screens/MemosScreen";
import MemoDetailScreen from "../screens/memos/MemoDetails";
import QRCodeScannerScreen from "../screens/QRCodeScannerScreen";
import SpotCheckScreen from "../screens/spotCheck/SpotCheckScreen";
import SpotCheckDetailsScreen from "../screens/spotCheck/SpotCheckDetailsScreen";
import SpotCheckSelectionScreen from "../screens/spotCheck/SpotCheckSelectionScreen";

export type RootStackParamList = {
  Dashboard: undefined;
  SpotCheck: { flightId: string };
  SpotCheckDetails: { checkId: string; title: string; flightId: string };
  Flights: { flightId: string };
  Memos: undefined;
  MemoDetail: { memoId: string; showVersion?: boolean };
  Documents: undefined;
  CreateMemo: undefined;
  FlightDetails: {
    flightId: string;
    flightNumber: string;
    route: string;
    date: string;
  };
  SpotCheckSelection: undefined;
  QRCodeScanner: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const CustomHeader = () => {
  return <Header userName={"Shitanshu"} onUserPress={() => {}} />;
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: true,
        header: CustomHeader,
        cardStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Flights" component={FlightsScreen} />
      <Stack.Screen name="SpotCheck" component={SpotCheckScreen} />
      <Stack.Screen
        name="SpotCheckDetails"
        component={SpotCheckDetailsScreen}
      />
      <Stack.Screen name="Memos" component={MemosScreen} />
      <Stack.Screen name="MemoDetail" component={MemoDetailScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="FlightDetails" component={FlightDetailsScreen} />
      <Stack.Screen
        name="SpotCheckSelection"
        component={SpotCheckSelectionScreen}
      />
      <Stack.Screen
        name="QRCodeScanner"
        component={QRCodeScannerScreen}
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
};
