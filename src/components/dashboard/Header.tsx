import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

import { DropdownIcon } from "../../assets/icons";
import { EmairatesIcon } from "../../assets/logos";

type RootStackParamList = { Dashboard: { screen: string } };
type StackNavigationProp<T extends {}> = {
  navigate: (route: keyof T, params: any) => void;
};
type RootNavigationProp = StackNavigationProp<RootStackParamList>;

const useNavigation = () => ({
  navigate: (route: keyof RootStackParamList, params: any) =>
    console.log(`MOCK: Navigating to ${route}`),
});

const { width } = Dimensions.get("window");

interface HeaderProps {
  userName: string;
  onUserPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, onUserPress }) => {
  const navigation = useNavigation() as RootNavigationProp;
  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.headerLeft}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Dashboard", {
              screen: "DashboardHome",
            });
          }}
        >
          <View>
            <Image
              source={require("../../assets/images/galleyx.png")}
              style={headerStyles.logoImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={headerStyles.headerRight}>
        <View>
          <TouchableOpacity
            style={headerStyles.userProfile}
            onPress={onUserPress}
          >
            <View style={headerStyles.profileImage}>
              <Text style={headerStyles.profileImageText}>👤</Text>
            </View>
            <Text style={headerStyles.userName}>
              {userName} <DropdownIcon />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={headerStyles.airlineLogoWrapper}>
          <View style={headerStyles.airlineLogo}>
            <EmairatesIcon />
          </View>
        </View>
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
    elevation: 3,
    position: "relative",
    zIndex: 1,
  },
  headerLeft: { flex: 1 },
  logoImage: { height: width > 768 ? 40 : 35, width: width > 768 ? 200 : 180 },
  headerRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingEnd: 120,
  },
  userProfile: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  profileImageText: { fontSize: 18 },
  userName: {
    fontSize: width > 768 ? 18 : 16,
    fontWeight: "600",
    color: "#374151",
    marginRight: 5,
  },

  airlineLogoWrapper: {
    position: "absolute",
    right: 20,
    bottom: -30,
    zIndex: 10,
  },

  airlineLogo: {
    backgroundColor: "#D71921",
    width: width > 768 ? 90 : 95,
    height: width > 768 ? 95 : 90,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
});
