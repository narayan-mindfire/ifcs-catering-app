import "react-native-gesture-handler";
import "./global.css";

import { NavigationContainer } from "@react-navigation/native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import { View } from "react-native";

import { AppNavigator } from "./src/navigation/AppNavigator";
import { log } from "./src/utils/logger";

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
  const [fontsLoaded] = useFonts({
    Rubik: require("./assets/fonts/Rubik.ttf"),
    roboto: require("./assets/fonts/Roboto.ttf"),
  });

  useEffect(() => {
    async function registerForPushNotifications() {
      if (!Device.isDevice) {
        log.info("Must use physical device for Push Notifications");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        log.info("Failed to get push token for push notification!");
        return;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });

      log.info(tokenData.data);
    }

    registerForPushNotifications();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  const prefix = Linking.createURL("/");

  const linking = {
    prefixes: [prefix, "ifcs-catering-app://"],
    config: {
      screens: {
        Dashboard: "dashboard",
        SSOCallback: "oauthredirect", //fallback
      },
    },
  };

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
}
