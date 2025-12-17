import React, { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { BreadCrumb } from "../../components/common/BreadCrumbs";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { SpotCheckHeader } from "../../components/SpotCheck/SpotCheckHeader";
import { SpotCheckListItem } from "../../components/SpotCheck/SpotCheckItemList";

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

const SpotCheckScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<"required" | "completed">(
    "required",
  );
  const listData = useMemo(() => {
    return CHECKS_DATA.filter((item) => {
      if (activeTab === "required") return item.status === "Pending";
      return item.status !== "Pending";
    });
  }, [activeTab]);

  const breadcrumbItems = useMemo(
    () => [
      {
        label: "Dashboard",
        onPress: () => navigation.navigate("Dashboard"),
      },
      {
        label: "Spot Check",
      },
      {
        label:
          activeTab === "required" ? "Required Checks" : "Completed Checks",
      },
    ],
    [activeTab, navigation],
  );

  const handleNavigateToDetails = useCallback(
    (item: (typeof CHECKS_DATA)[0]) => {
      navigation.navigate("SpotCheckDetails", {
        checkId: item.id,
        title: item.name,
      });
    },
    [navigation],
  );

  const handleTabChange = useCallback((tab: "required" | "completed") => {
    setActiveTab(tab);
  }, []);

  const renderHeader = useCallback(
    () => (
      <SpotCheckHeader
        flightInfo={FLIGHT_INFO}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    ),
    [activeTab, handleTabChange],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: (typeof CHECKS_DATA)[0]; index: number }) => (
      <SpotCheckListItem
        item={item}
        isLastItem={index === listData.length - 1}
        onPress={handleNavigateToDetails}
      />
    ),
    [listData.length, handleNavigateToDetails],
  );

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
