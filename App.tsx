import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SpotCheckScreen from "./src/screens/SpotCheckScreen";
import FlightsScreen from "./src/screens/FlightsScreen";
import MemosScreen from "./src/screens/MemosScreen";
import DocumentsScreen from "./src/screens/DocumentsScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import FlightDetailsScreen from "./src/screens/FlightDetailsScreen";
import { Header } from "./src/components/dashboard/Header";

export type RootStackParamList = {
  Dashboard: undefined;
  SpotCheck: { flightId: string };
  Flights: { flightId: string };
  Memos: { flightId: string };
  Documents: { flightId: string };
  FlightDetails: {
    flightId: string;
    route: string;
    date: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const CustomHeader = () => {
  return <Header userName={"Shitanshu"} onUserPress={() => {}} />;
};

export default function App() {
  return (
    <NavigationContainer>
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
        <Stack.Screen name="Memos" component={MemosScreen} />
        <Stack.Screen name="Documents" component={DocumentsScreen} />
        <Stack.Screen name="FlightDetails" component={FlightDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
