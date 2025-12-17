import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { BreadCrumb } from "../../components/common/BreadCrumbs";

import { NoFlightsIcon, PlaneIcon, QrIcon } from "../../assets/icons";

type SpotCheckSelectionScreenRouteProp = RouteProp<
  RootStackParamList,
  "SpotCheckSelection"
>;
type SpotCheckScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpotCheckSelection"
>;

interface Props {
  route: SpotCheckSelectionScreenRouteProp;
  navigation: SpotCheckScreenNavigationProp;
}

const SpotCheckSelectionScreen: React.FC<Props> = ({ route, navigation }) => {
  const breadcrumbItems = [
    {
      label: "Dashboard",
      onPress: () => navigation.navigate("Dashboard"),
    },
    {
      label: "Spot Check",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <BreadCrumb items={breadcrumbItems} />

      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center mb-8">
          <NoFlightsIcon width={100} height={100} />
          <Text className="text-xl font-medium text-text-tertiary mt-6 text-center">
            No Flight Selected
          </Text>
        </View>

        <View className="flex-row items-center justify-center w-full max-w-lg gap-10">
          <TouchableOpacity
            className="flex-1 bg-bg-secondary rounded-2xl px-6 py-4 items-center justify-center aspect-square"
            activeOpacity={0.7}
            onPress={() =>
              navigation.push("SpotCheck", { flightId: "abc@123" })
            }
          >
            <PlaneIcon />
            <TouchableOpacity
              onPress={() => {
                console.log("Navigate to flight selection");
                navigation.push("SpotCheck", { flightId: "abc@123" });
              }}
            >
              <Text className="mt-3 text-gray-700 font-medium text-lg text-center">
                Select a Flight
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <Text className="text-gray-500 font-medium text-lg mx-6">Or</Text>

          <TouchableOpacity
            className="flex-1 bg-bg-secondary rounded-2xl px-6 py-4 items-center justify-center aspect-square"
            activeOpacity={0.7}
            onPress={() => {
              console.log("on to scanning");
              navigation.navigate("QRCodeScanner");
            }}
          >
            <QrIcon width={40} height={40} />
            <Text className="mt-3 text-gray-700 font-medium text-lg text-center">
              Scan a Flight
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SpotCheckSelectionScreen;
