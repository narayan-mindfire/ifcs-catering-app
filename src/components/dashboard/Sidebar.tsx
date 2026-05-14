import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { AirplaneIcon, DocsIcon, MemosIcon, SpotIcon } from "@/assets/icons";
import { NavigationCard } from "@/components/common/NavigationCard";
import { RootStackParamList } from "@/navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const useFlightData = () => ({
  selectedFlight: { id: "mock-flight-123" as string },
});

type SidebarScreenName = "SpotCheck" | "Flights" | "Memos" | "Documents";

interface SidebarProps {
  userName: string;
  position?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userName, position }) => {
  const navigation = useNavigation<NavigationProp>();
  const { selectedFlight } = useFlightData();

  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

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
          {position && <Text style={styles.position}>{position}</Text>}
        </View>

        <View
          style={[
            styles.navigationSection,
            { marginBottom: isPortrait ? 75 : 0 },
          ]}
        >
          <NavigationCard
            title="Flight Hub"
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
  position: {
    fontSize: 18,
    paddingLeft: 8,
    fontWeight: "300",
    color: "#ffffff",
  },
  navigationSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
});
