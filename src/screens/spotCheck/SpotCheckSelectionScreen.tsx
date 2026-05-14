import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { NoFlightsIcon, QrIcon } from "@/assets/icons";
import { AppButton } from "@/components/common/AppButton";
import { BreadCrumb } from "@/components/common/BreadCrumbs";
import { RootStackParamList } from "@/navigation/AppNavigator";

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

const SpotCheckSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const breadcrumbItems = [
    {
      label: "Dashboard",
      onPress: () => navigation.navigate("Dashboard"),
    },
    {
      label: "Spot Check",
    },
  ];

  const handleScanPress = () => {
    navigation.navigate("QRCodeScanner", { continuous: false });
  };

  const handleCompletedChecksPress = () => {
    navigation.navigate("SpotCheck", {
      flightId: "",
      initialTab: "completed",
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-start pr-4">
        <View className="flex-1">
          <BreadCrumb items={breadcrumbItems} />
        </View>
      </View>

      <View className="flex-1 px-6 relative">
        <View className="absolute top-4 right-6 z-10">
          <AppButton
            title="Completed Checks"
            type="accent"
            textStyle={{ color: "black" }}
            onPress={handleCompletedChecksPress}
          />
        </View>

        <View className="flex-1 justify-center items-center">
          <View className="items-center mb-8">
            <NoFlightsIcon width={100} height={100} />
          </View>

          <View className="flex-row items-center justify-center w-full max-w-lg gap-10">
            <TouchableOpacity
              className="flex-1/2 bg-bg-secondary rounded-2xl px-6 py-4 items-center justify-center aspect-square"
              activeOpacity={0.7}
              onPress={handleScanPress}
            >
              <QrIcon width={40} height={40} />
              <Text className="mt-3 text-gray-700 font-medium text-lg text-center">
                Scan a Flight
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SpotCheckSelectionScreen;
