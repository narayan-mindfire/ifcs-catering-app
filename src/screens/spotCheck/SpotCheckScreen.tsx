import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { BreadCrumb } from "../../components/common/BreadCrumbs";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { SpotCheckHeader } from "../../components/SpotCheck/SpotCheckHeader";
import { SpotCheckListItem } from "../../components/SpotCheck/SpotCheckItemList";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { useFlightStore } from "../../store/useFlightStore";
import { PreparationItem } from "../../types/preparations";
import { formatDate } from "../../utils/dateFormatter";

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
  const { flightId } = route.params;

  // 1. Get Stores
  const { preparations, fetchPreparations, isLoading } =
    useFlightPreparationStore();
  const {
    selectedFlight,
    fetchFlightById,
    isLoading: isFlightLoading,
  } = useFlightStore();

  const [activeTab, setActiveTab] = useState<"required" | "completed">(
    "required",
  );

  // 2. Fetch Data (Flight Info + Preparations)
  useEffect(() => {
    if (flightId) {
      fetchPreparations(flightId);

      // Fetch flight details if not already loaded or if the ID differs
      if (!selectedFlight || selectedFlight.id !== flightId) {
        fetchFlightById(flightId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId]);

  const flightInfo = useMemo(() => {
    if (!selectedFlight) {
      return {
        flight: "Loading...",
        route: "...",
        date: "...",
        aircraft: "...",
        acReg: "...",
        destination: "...",
      };
    }

    return {
      flight: selectedFlight.flightNumber || "N/A",
      route: `${selectedFlight.departureStation?.code || ""} - ${
        selectedFlight.arrivalStation?.code || ""
      }`,
      date: formatDate(selectedFlight.scheduledDeparture) || "N/A",
      aircraft: selectedFlight.aircraft?.type || "N/A",
      acReg: selectedFlight.aircraft?.registration || "N/A",
      destination: selectedFlight.arrivalStation?.code || "N/A",
    };
  }, [selectedFlight]);

  const listData = useMemo(() => {
    if (activeTab === "required") {
      return preparations;
    }
    return [];
  }, [activeTab, preparations]);

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
    (item: PreparationItem) => {
      navigation.navigate("SpotCheckDetails", {
        checkId: item.id,
        title: item.name,
        flightId: flightId,
      });
    },
    [navigation, flightId],
  );

  const handleTabChange = useCallback((tab: "required" | "completed") => {
    setActiveTab(tab);
  }, []);

  const renderHeader = useCallback(
    () => (
      // ✅ Pass the dynamic flightInfo here
      <SpotCheckHeader
        flightInfo={flightInfo}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    ),
    [activeTab, handleTabChange, flightInfo], // Add flightInfo dependency
  );

  const renderItem = useCallback(
    ({ item, index }: { item: PreparationItem; index: number }) => (
      <SpotCheckListItem
        item={{
          id: item.id,
          name: item.name,
          code: item.code || "N/A",
          category: "Bulk",
          status: "Pending",
        }}
        isLastItem={index === listData.length - 1}
        onPress={() => handleNavigateToDetails(item)}
      />
    ),
    [listData.length, handleNavigateToDetails],
  );

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <View className="flex-1 bg-bg-surface p-4">
        {isLoading || isFlightLoading ? ( // Show loading if either is fetching
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#602AF3" />
            <Text className="mt-4 text-text-secondary">
              Loading Flight Data...
            </Text>
          </View>
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Text className="text-text-tertiary">
                  No preparations found.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </>
  );
};

export default SpotCheckScreen;
