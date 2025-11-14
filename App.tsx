import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SpotCheckScreen from "./src/screens/SpotCheckScreen";
import FlightsScreen from "./src/screens/FlightsScreen";
import MemosScreen from "./src/screens/MemosScreen";
import DocumentsScreen from "./src/screens/DocumentsScreen";
import DashboardScreen from "./src/screens/DashboardScreen";

export type RootStackParamList = {
  Dashboard: undefined;
  SpotCheck: { flightId: string };
  Flights: { flightId: string };
  Memos: { flightId: string };
  Documents: { flightId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Flights" component={FlightsScreen} />
        <Stack.Screen name="SpotCheck" component={SpotCheckScreen} />
        <Stack.Screen name="Memos" component={MemosScreen} />
        <Stack.Screen name="Documents" component={DocumentsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
