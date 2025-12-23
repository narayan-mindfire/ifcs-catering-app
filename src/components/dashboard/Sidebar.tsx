import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

import {
  AirplaneIcon,
  DocsIcon,
  MemosIcon,
  SpotIcon,
} from "../../assets/icons";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { NavigationCard } from "../common/NavigationCard";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const useFlightData = () => ({
  selectedFlight: { id: "mock-flight-123" as string },
});

type SidebarScreenName = "SpotCheck" | "Flights" | "Memos" | "Documents";

interface SidebarProps {
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userName }) => {
  const navigation = useNavigation<NavigationProp>();
  const { selectedFlight } = useFlightData();

  const handleNavigate = (screen: SidebarScreenName) => {
    if (screen === "Flights") {
      navigation.navigate(screen, { flightId: selectedFlight?.id });
    } else if (screen === "SpotCheck") {
      navigation.navigate("SpotCheckSelection");
    } else if (screen === "Memos" || screen === "Documents") {
      navigation.navigate(screen);
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
            onPress={() => handleNavigate("Flights")}
          />
          <NavigationCard
            title="Spot Check"
            IconComponent={SpotIcon}
            onPress={() => handleNavigate("SpotCheck")}
          />
          <NavigationCard
            title="Memos"
            IconComponent={MemosIcon}
            onPress={() => handleNavigate("Memos")}
          />
          <NavigationCard
            title="Documents"
            IconComponent={DocsIcon}
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
