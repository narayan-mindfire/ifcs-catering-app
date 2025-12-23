import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { NoFlightsIcon, QrIcon } from "../../assets/icons";
import { BreadCrumb } from "../../components/common/BreadCrumbs";
import { RootStackParamList } from "../../navigation/AppNavigator";

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

// const TEST_FLIGHT_ID = "8548e2fd-e0d2-4e11-ab7e-d778274fe81d";

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
    navigation.navigate("QRCodeScanner");
  };
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
          {/* <Text className="text-gray-500 font-medium text-lg mx-6">Or</Text> */}

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
  );
};

export default SpotCheckSelectionScreen;
