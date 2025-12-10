import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { ArrowIcon, QrIcon } from "../assets/icons";
import { BreadCrumb } from "../components/common/BreadCrumbs";

type SpotCheckScreenRouteProp = RouteProp<RootStackParamList, "SpotCheck">;
type SpotCheckScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpotCheck"
>;

interface Props {
  route: SpotCheckScreenRouteProp;
  navigation: SpotCheckScreenNavigationProp;
}

const FLIGHT_INFO = {
  flight: "WY913",
  route: "MCT-SLL",
  date: "Aug 13, 2025",
  aircraft: "A380",
  acReg: "STC",
  destination: "SLL",
};

const CHECKS_DATA = [
  {
    id: "1",
    code: "BU001",
    name: "Eco Comfort Kits",
    category: "Bulk",
    status: "Pending",
  },
  {
    id: "2",
    code: "BU002",
    name: "Grooming Kit",
    category: "Bulk",
    status: "Pending",
  },
  {
    id: "3",
    code: "BU003",
    name: "Ice Bags",
    category: "Bulk",
    status: "Pending",
  },
  {
    id: "4",
    code: "BU004",
    name: "Glasses",
    category: "Bulk",
    status: "Passed",
  },
  {
    id: "5",
    code: "BU005",
    name: "Club items",
    category: "Bulk",
    status: "Passed",
  },
  {
    id: "6",
    code: "BU006",
    name: "Club Blanket",
    category: "Bulk",
    status: "Passed",
  },
  {
    id: "7",
    code: "BU007",
    name: "Small Ice Cubes",
    category: "Bulk",
    status: "Passed",
  },
  {
    id: "8",
    code: "BU008",
    name: "Napkins",
    category: "Bulk",
    status: "Failed",
  },
];

const SpotCheckScreen: React.FC<Props> = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState<"required" | "completed">(
    "required",
  );

  const listData = CHECKS_DATA.filter((item) => {
    if (activeTab === "required") return item.status === "Pending";
    return item.status !== "Pending";
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-orange-400";
      case "Passed":
        return "text-green-500";
      case "Failed":
        return "text-red-500";
      default:
        return "text-text-muted";
    }
  };

  const renderHeader = () => (
    <View className="my-6">
      <View className="flex-row flex-wrap gap-x-6 gap-y-2 mb-6 px-1">
        <View className="flex-row items-center">
          <Text className="text-text-muted text-sm mr-1">Flight:</Text>
          <Text className="text-text-primary font-bold text-sm">
            {FLIGHT_INFO.flight}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-text-muted text-sm mr-1">Route:</Text>
          <Text className="text-text-primary font-bold text-sm">
            {FLIGHT_INFO.route}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-text-muted text-sm mr-1">Date:</Text>
          <Text className="text-text-primary font-bold text-sm">
            {FLIGHT_INFO.date}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-text-muted text-sm mr-1">Aircraft:</Text>
          <Text className="text-text-primary font-bold text-sm">
            {FLIGHT_INFO.aircraft}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-text-muted text-sm mr-1">AC Reg:</Text>
          <Text className="text-text-primary font-bold text-sm">
            {FLIGHT_INFO.acReg}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-text-muted text-sm mr-1">Destination:</Text>
          <Text className="text-text-primary font-bold text-sm">
            {FLIGHT_INFO.destination}
          </Text>
        </View>
      </View>

      <View className="bg-bg-tertiary rounded-full p-1 flex-row h-12 mb-6">
        <TouchableOpacity
          className={`flex-1 rounded-full justify-center items-center ${activeTab === "required" ? "bg-bg-secondary shadow-sm" : ""}`}
          onPress={() => setActiveTab("required")}
        >
          <Text
            className={`font-medium ${activeTab === "required" ? "text-text-primary" : "text-text-muted"}`}
          >
            Required Checks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 rounded-full justify-center items-center ${activeTab === "completed" ? "bg-bg-secondary shadow-sm" : ""}`}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            className={`font-medium ${activeTab === "completed" ? "text-text-primary" : "text-text-muted"}`}
          >
            Completed Checks
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-bg-tertiary rounded-t-xl flex-row px-4 py-3 border-b border-border-muted">
        <Text className="flex-[0.5] text-xs font-semibold text-text-primary">
          Code
        </Text>
        <Text className="flex-[1.5] text-xs font-semibold text-text-primary">
          Name
        </Text>
        <Text className="flex-[0.8] text-xs font-semibold text-text-primary">
          Category
        </Text>
        <View className="flex-[0.8] flex-row items-center">
          <Text className="text-xs font-semibold text-text-primary mr-1">
            Status
          </Text>
          {activeTab === "completed"}
        </View>
        <Text className="flex-[0.5] text-xs font-semibold text-text-primary text-right">
          Action
        </Text>
      </View>
    </View>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof CHECKS_DATA)[0];
    index: number;
  }) => {
    const isLastItem = index === listData.length - 1;
    const rowStyle = isLastItem
      ? "rounded-b-xl border-b-0"
      : "border-b border-border-muted";

    return (
      <View
        className={`flex-row px-4 py-4 bg-bg-surface items-center ${rowStyle}`}
      >
        <Text className="flex-[0.5] text-sm text-text-secondary">
          {item.code}
        </Text>
        <Text className="flex-[1.5] text-sm text-text-secondary font-medium">
          {item.name}
        </Text>
        <Text className="flex-[0.8] text-sm text-text-secondary">
          {item.category}
        </Text>
        <Text
          className={`flex-[0.8] text-sm font-medium ${getStatusColor(item.status)}`}
        >
          {item.status}
        </Text>
        <View className="flex-[0.5] items-end">
          <TouchableOpacity>
            {activeTab === "required" ? <QrIcon /> : <ArrowIcon />}
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const breadcrumbItems = [
    {
      label: "Dashboard",
      onPress: () => navigation.navigate("Dashboard"),
    },
    {
      label: "Spot Check",
    },
    { label: activeTab + " Checks" },
  ];

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <View className="flex-1 bg-bg-surface p-4">
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </>
  );
};

export default SpotCheckScreen;
