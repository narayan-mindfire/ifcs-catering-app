import "react-native-gesture-handler";
import "./global.css";

import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppNavigator } from "./src/navigation/AppNavigator";
import { useAuthStore } from "./src/store/useAuthStore";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const { restoreSession, isLoading } = useAuthStore();

  const [fontsLoaded] = useFonts({
    Rubik: require("./assets/fonts/Rubik.ttf"),
    roboto: require("./assets/fonts/Roboto.ttf"),
  });

  useEffect(() => {
    Notifications.setBadgeCountAsync(0);
    restoreSession();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0f172a",
          justifyContent: "center",
          alignItems: "center",
        }}
        onLayout={onLayoutRootView}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const prefix = Linking.createURL("/");

  const linking = {
    prefixes: [
      prefix,
      "ifcs-catering-app://",
      "msauth.com.ifcs-catering.app://",
    ],
    config: {
      screens: {
        Dashboard: "dashboard",
        Login: "login",
        SSOCallback: "auth",
      },
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
