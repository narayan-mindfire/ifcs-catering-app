import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";
import { DropdownIcon, UserIcon } from "../../assets/icons";
import { EmairatesIcon } from "../../assets/logos";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

interface HeaderProps {
  userName: string;
  onUserPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, onUserPress }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.headerLeft}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Dashboard");
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
              <Text style={headerStyles.profileImageText}>
                <UserIcon />
              </Text>
            </View>
            <Text style={headerStyles.userName}>
              {userName} <DropdownIcon />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={headerStyles.airlineLogoWrapper}>
          <View style={headerStyles.airlineLogo}>
            <EmairatesIcon height={65} width={60} />
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
    marginTop: 10,
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
    width: width > 768 ? 60 : 65,
    height: width > 768 ? 65 : 60,
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
