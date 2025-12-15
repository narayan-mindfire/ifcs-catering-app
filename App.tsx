import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import React from "react";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SpotCheckScreen from "./src/screens/spotCheck/SpotCheckScreen";
import SpotCheckDetailsScreen from "./src/screens/spotCheck/SpotCheckDetailsScreen";
import FlightsScreen from "./src/screens/FlightsScreen";
import MemosScreen from "./src/screens/MemosScreen";
import DocumentsScreen from "./src/screens/DocumentsScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import FlightDetailsScreen from "./src/screens/FlightDetailsScreen";
import { Header } from "./src/components/dashboard/Header";
import { ActivityIndicator } from "react-native";
import MemoDetailScreen from "./src/screens/memos/MemoDetails";
import CreateMemoScreen from "./src/screens/memos/CreateMemo";
import SpotCheckSelectionScreen from "./src/screens/spotCheck/SpotCheckSelectionScreen";
import QRCodeScannerScreen from "./src/screens/QRCodeScannerScreen";

export type RootStackParamList = {
  Dashboard: undefined;
  SpotCheck: { flightId: string };
  SpotCheckDetails: { checkId: string; title: string };
  Flights: { flightId: string };
  Memos: undefined;
  MemoDetail: { memoId: string };
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

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik: require("./assets/fonts/Rubik.ttf"),
    roboto: require("./assets/fonts/Roboto.ttf"),
  });
  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }
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
        <Stack.Screen name="CreateMemo" component={CreateMemoScreen} />
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
    </NavigationContainer>
  );
}
