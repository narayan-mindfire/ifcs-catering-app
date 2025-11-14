import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import {
  AirplaneIcon,
  DocsIcon,
  MemosIcon,
  SpotIcon,
} from "../../assets/icons";
import { NavigationCard } from "../common/NavigationCard";

type RootStackParamList = { [key: string]: { flightId: string } | undefined };
type StackNavigationProp<T extends {}> = {
  navigate: (route: keyof T, params: any) => void;
};
type RootNavigationProp = StackNavigationProp<RootStackParamList>;
const useFlightData = () => ({
  selectedFlight: { id: "mock-flight-123" as string },
});
const useNavigation = () => ({
  navigate: (screen: string, params: any) =>
    console.log(`MOCK: Sidebar Navigation to ${screen}`),
});
interface NavigationCardProps {
  title: string;
  IconComponent: React.FC<any>;
  onPress: () => void;
  count?: string;
}

type SidebarScreenName = "SpotCheck" | "StowageLocator" | "Memos" | "Documents";

interface SidebarProps {
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userName }) => {
  const navigation = useNavigation() as RootNavigationProp;
  const { selectedFlight } = useFlightData();

  const handleNavigate = (screen: SidebarScreenName) => {
    if (screen === "Documents") {
      navigation.navigate(screen, { flightId: selectedFlight?.id });
    } else if (selectedFlight) {
      navigation.navigate(screen, { flightId: selectedFlight.id });
    } else {
      console.log(
        "MOCK ALERT: Please select a flight first to view its details."
      );
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/sidebar_bg.png")}
      style={styles.sidebar}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.9)", "rgba(0,0,0,0.3)", "rgba(0, 0, 0, 0.9)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.sidebarBackground}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.welcomeName}>{userName}</Text>
        </View>

        <View style={styles.navigationSection}>
          <NavigationCard
            title="Flights"
            IconComponent={AirplaneIcon}
            onPress={() => handleNavigate("SpotCheck")}
          />
          <NavigationCard
            title="Spot Check"
            IconComponent={SpotIcon}
            onPress={() => handleNavigate("StowageLocator")}
          />
          <NavigationCard
            title="Memos"
            IconComponent={MemosIcon}
            count="15"
            onPress={() => handleNavigate("Memos")}
          />
          <NavigationCard
            title="Documents"
            IconComponent={DocsIcon}
            count="08"
            onPress={() => handleNavigate("Documents")}
          />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },
  sidebarBackground: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  welcomeSection: {},
  welcomeText: {
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 5,
  },
  welcomeName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
  },
  navigationSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
});
