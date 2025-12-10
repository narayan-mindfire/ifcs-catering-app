import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { BreadCrumb } from "../components/common/BreadCrumbs";

import { NoFlightsIcon, PlaneIcon, QrIcon } from "../assets/icons";

type SpotCheckScreenRouteProp = RouteProp<RootStackParamList, "SpotCheck">;
type SpotCheckScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpotCheck"
>;

interface Props {
  route: SpotCheckScreenRouteProp;
  navigation: SpotCheckScreenNavigationProp;
}

const SpotCheckScreen: React.FC<Props> = ({ route, navigation }) => {
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

        <View className="flex-row items-center justify-center w-full max-w-md">
          <TouchableOpacity
            className="flex-1 bg-bg-secondary rounded-2xl p-6 items-center justify-center aspect-square"
            activeOpacity={0.7}
            onPress={() => console.log("Select Flight Pressed")}
          >
            <PlaneIcon />
            <Text className="mt-3 text-gray-700 font-medium text-lg text-center">
              Select a Flight
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-500 font-medium text-lg mx-6">Or</Text>

          <TouchableOpacity
            className="flex-1 bg-bg-secondary rounded-2xl p-6 items-center justify-center aspect-square"
            activeOpacity={0.7}
            onPress={() => console.log("Scan Flight Pressed")}
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

export default SpotCheckScreen;
