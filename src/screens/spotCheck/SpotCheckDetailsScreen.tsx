import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";
import { BreadCrumb } from "../../components/common/BreadCrumbs";
import { FailReasonModal } from "../../components/SpotCheck/FailedReasonModal";

// Assuming you have these icons
import {
  ImageIcon,
  InfoIcon,
  // CheckCircleIcon,
  // XCircleIcon,
} from "../../assets/icons";

type SpotCheckDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "SpotCheckDetails"
>;
type SpotCheckDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpotCheckDetails"
>;

interface Props {
  route: SpotCheckDetailsScreenRouteProp;
  navigation: SpotCheckDetailsScreenNavigationProp;
}

// Mock Data
const FLIGHT_INFO = {
  flight: "WY913",
  route: "MCT-SLL",
  date: "Aug 13, 2025",
  aircraft: "A380",
  acReg: "STC",
  destination: "SLL",
};

const ITEMS_DATA = [
  { id: 1, qty: 1, item: 'DRAWER LINER 10" X 14 1/2" ATLAS', status: "Fail" },
  { id: 2, qty: 3, item: "White Wine Montenero 187ml eco", status: "Pass" },
  { id: 3, qty: 1, item: "Red Wine Montenero 187ml eco", status: "Fail" },
];

const SpotCheckDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title } = route.params;
  const [selectedGalley, setSelectedGalley] = useState("G200");

  // State for Modal
  const [isFailModalVisible, setIsFailModalVisible] = useState(false);

  const breadcrumbItems = [
    { label: "Home", onPress: () => navigation.navigate("Dashboard") },
    {
      label: "Spot Check",
      onPress: () => navigation.navigate("SpotCheck", { flightId: "WY913" }),
    },
    { label: "Required Checks", onPress: () => navigation.goBack() },
    { label: title || "Ultralight Double Cart" },
  ];

  const handleConfirmFail = (data: { reason: string; remarks: string }) => {
    console.log("Item Failed:", data);
    // Here you would implement the logic to update the item status in your backend/state
    setIsFailModalVisible(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <BreadCrumb items={breadcrumbItems} />

      {/* Flight Info Header */}
      <View className="px-6 py-2">
        <View className="flex-row flex-wrap gap-x-6 gap-y-2 mb-4">
          <InfoItem label="Flight" value={FLIGHT_INFO.flight} />
          <InfoItem label="Route" value={FLIGHT_INFO.route} />
          <InfoItem label="Date" value={FLIGHT_INFO.date} />
          <InfoItem label="Aircraft" value={FLIGHT_INFO.aircraft} />
          <InfoItem label="AC Reg" value={FLIGHT_INFO.acReg} />
          <InfoItem label="Destination" value={FLIGHT_INFO.destination} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} className="flex-1">
        <View className="flex-row gap-6 h-[600px]">
          {/* Column 1: Cart Image Area */}
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 justify-between">
            <Text className="text-lg font-medium text-text-primary mb-4">
              {title || "Ultralight Double Cart"} | G200 | F2001
            </Text>
            <View className="flex-1 items-center justify-center">
              <View className="w-48 h-32 bg-gray-200 border-2 border-gray-300 rounded-lg items-center justify-center">
                <Text className="text-gray-400">Cart Image</Text>
              </View>
            </View>
          </View>

          {/* Column 2: Items List */}
          <View className="flex-[1.5] bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-xl font-medium text-text-primary">
                Items
              </Text>
            </View>

            {/* Table Header */}
            <View className="flex-row bg-gray-50 px-4 py-3 border-b border-gray-100">
              <Text className="flex-[0.2] font-semibold text-text-primary">
                Qty.
              </Text>
              <Text className="flex-[1.5] font-semibold text-text-primary">
                Item
              </Text>
              <Text className="flex-[0.4] font-semibold text-text-primary">
                Status
              </Text>
              <Text className="flex-[0.3] font-semibold text-text-primary text-right">
                Action
              </Text>
            </View>

            {/* Table Body */}
            <View className="flex-1">
              {ITEMS_DATA.map((item) => (
                <View
                  key={item.id}
                  className="flex-row px-4 py-4 border-b border-gray-50 items-center hover:bg-gray-50"
                >
                  <Text className="flex-[0.2] text-text-secondary">
                    {item.qty}
                  </Text>
                  <Text className="flex-[1.5] text-text-secondary">
                    {item.item}
                  </Text>
                  <View className="flex-[0.4] flex-row items-center gap-1">
                    <Text
                      className={`${item.status === "Pass" ? "text-green-500" : "text-red-500"} font-medium`}
                    >
                      {item.status}
                    </Text>
                    <TouchableOpacity>
                      <InfoIcon width={16} height={16} color="#9ca3af" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-[0.3] items-end">
                    <TouchableOpacity>
                      <ImageIcon width={20} height={20} color="#4b5563" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View className="p-4 flex-row gap-4 border-t border-gray-100">
              <TouchableOpacity className="flex-1 bg-[#5046e5] rounded-xl py-3 flex-row items-center justify-center gap-2">
                <Text className="text-white font-medium text-lg">Pass</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsFailModalVisible(true)}
                className="flex-1 bg-[#ef4444] rounded-xl py-3 flex-row items-center justify-center gap-2"
              >
                {/* <XCircleIcon color="white" width={20} height={20} /> */}
                <Text className="text-white font-medium text-lg">Fail</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-[0.8] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <Text className="text-lg font-medium text-text-primary mb-6">
              Galley Locations in Aircraft
            </Text>
            <View className="flex-1 relative items-center">
              <View className="absolute inset-0 items-center justify-center opacity-10">
                <View className="w-20 h-full bg-gray-300 rounded-full" />
              </View>
              <View className="w-full h-full justify-between py-4 px-2">
                <View className="flex-row justify-between w-full mb-10">
                  <GalleyButton
                    label="G100"
                    selected={selectedGalley === "G100"}
                    onPress={() => setSelectedGalley("G100")}
                  />
                  <GalleyButton
                    label="G200"
                    selected={selectedGalley === "G200"}
                    onPress={() => setSelectedGalley("G200")}
                  />
                </View>
                <View className="flex-row justify-between w-full mt-auto mb-20">
                  <GalleyButton
                    label="G300"
                    selected={selectedGalley === "G300"}
                    onPress={() => setSelectedGalley("G300")}
                  />
                  <GalleyButton
                    label="G400"
                    selected={selectedGalley === "G400"}
                    onPress={() => setSelectedGalley("G400")}
                  />
                </View>
                <View className="flex-row justify-center gap-4">
                  <GalleyButton
                    label="Bulk"
                    selected={selectedGalley === "Bulk"}
                    onPress={() => setSelectedGalley("Bulk")}
                  />
                  <GalleyButton
                    label="Belly"
                    selected={selectedGalley === "Belly"}
                    onPress={() => setSelectedGalley("Belly")}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <FailReasonModal
        isVisible={isFailModalVisible}
        onClose={() => setIsFailModalVisible(false)}
        onConfirm={handleConfirmFail}
        itemName={title || "B737 Holloware ISC-MEA"}
      />
    </View>
  );
};
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row items-center">
    <Text className="text-text-muted text-base mr-1">{label}:</Text>
    <Text className="text-text-primary font-bold text-base">{value}</Text>
  </View>
);

const GalleyButton = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-lg border ${selected ? "bg-[#5046e5]/10 border-[#5046e5]" : "bg-gray-100 border-gray-200"}`}
  >
    <Text
      className={`font-medium ${selected ? "text-[#5046e5]" : "text-gray-500"}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default SpotCheckDetailsScreen;
