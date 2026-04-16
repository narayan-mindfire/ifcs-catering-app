import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { View } from "react-native";

import { UserDropdown } from "../components/common/UserDropdown";
import { Header } from "../components/dashboard/Header";
import LoginScreen from "../screens/Auth/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import DocumentsScreen from "../screens/DocumentsScreen";
import FlightDetailsScreen from "../screens/FlightDetailsScreen";
import FlightsScreen from "../screens/FlightsScreen";
import MemoDetailScreen from "../screens/memos/MemoDetails";
import MemosScreen from "../screens/MemosScreen";
import QRCodeScannerScreen from "../screens/QRCodeScannerScreen";
import SpotCheckDetailsScreen from "../screens/spotCheck/SpotCheckDetailsScreen";
import SpotCheckScreen from "../screens/spotCheck/SpotCheckScreen";
import SpotCheckSelectionScreen from "../screens/spotCheck/SpotCheckSelectionScreen";
import { useAuthStore } from "../store/useAuthStore";
import { RootStackParamList } from "../types/navigation";

export type { RootStackParamList };

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { token, logout } = useAuthStore();
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);

  const CustomHeader = () => {
    return <Header onUserPress={() => setIsUserDropdownVisible(true)} />;
  };

  const handleLogout = async () => {
    setIsUserDropdownVisible(false);
    await logout();
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName={token ? "Dashboard" : "Login"}
        screenOptions={{
          headerShown: !!token,
          header: token ? CustomHeader : undefined,
          cardStyle: { backgroundColor: "#fff" },
        }}
      >
        {!token ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false, animationTypeForReplace: "pop" }}
          />
        ) : (
          <>
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
            <Stack.Screen
              name="FlightDetails"
              component={FlightDetailsScreen}
            />
            <Stack.Screen
              name="SpotCheckSelection"
              component={SpotCheckSelectionScreen}
            />
            <Stack.Screen
              name="QRCodeScanner"
              component={QRCodeScannerScreen}
              options={{
                headerShown: false,
                presentation: "transparentModal",
              }}
            />
          </>
        )}
      </Stack.Navigator>

      {token && (
        <DropdownController
          visible={isUserDropdownVisible}
          onClose={() => setIsUserDropdownVisible(false)}
          onLogout={handleLogout}
        />
      )}
    </View>
  );
};

const DropdownController = ({
  visible,
  onClose,
  onLogout,
}: {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}) => {
  return (
    <UserDropdown visible={visible} onClose={onClose} onLogout={onLogout} />
  );
};
