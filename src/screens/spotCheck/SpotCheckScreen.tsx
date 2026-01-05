import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

import { BreadCrumb } from "../../components/common/BreadCrumbs";
import {
  CompletedCheckItem,
  CompletedCheckListItem,
} from "../../components/SpotCheck/CompletedCheckListItem";
import { SpotCheckHeader } from "../../components/SpotCheck/SpotCheckHeader";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuthStore } from "../../store/useAuthStore";
import { useFlightStore } from "../../store/useFlightStore";
import { useSpotCheckStore } from "../../store/useSpotcheckStore";
import { formatDate, formatDateDetail } from "../../utils/dateFormatter";

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
  const { flightId } = route.params || {};
  const { userId } = useAuthStore();

  const { selectedFlight, isLoading: isFlightLoading } = useFlightStore();
  const { spotCheckLogs, fetchSpotCheckLogs, isLogsLoading } =
    useSpotCheckStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial fetch
  useEffect(() => {
    fetchSpotCheckLogs(userId);
  }, [userId, fetchSpotCheckLogs]);

  // Pull-to-refresh handler (iOS native)
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchSpotCheckLogs(userId);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchSpotCheckLogs, userId]);

  const flightInfo = useMemo(() => {
    if (!flightId) {
      return {
        flight: "General",
        route: "User Logs",
        date: formatDate(new Date().toISOString()),
        aircraft: "-",
        acReg: "-",
        destination: "-",
      };
    }

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
  }, [selectedFlight, flightId]);

  const breadcrumbItems = useMemo(
    () => [
      {
        label: "Dashboard",
        onPress: () => navigation.navigate("Dashboard"),
      },
      {
        label: "Spot Checks",
        onPress: flightId ? undefined : () => navigation.goBack(),
      },
      {
        label: "Completed",
      },
    ],
    [navigation, flightId],
  );

  const handleScanPress = useCallback(() => {
    navigation.navigate("QRCodeScanner");
  }, [navigation]);

  const renderHeader = useCallback(
    () => (
      <SpotCheckHeader flightInfo={flightInfo} onScanPress={handleScanPress} />
    ),
    [flightInfo, handleScanPress],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const mappedItem: CompletedCheckItem = {
        id: item.id,
        name: item.preparationName || item.equipment || "Unknown Item",
        status: item.isPass ? "Pass" : "Fail",
        info: `${item.carrier || "N/A"} | ${
          item.galleyDetails?.galleyPosition || "N/A"
        }`,
        time: formatDate(item.createdAt),
        flight: `${item.designator || ""}${item.flightNumber || ""}`,
        route:
          item.route || `${item.departure || "N/A"}-${item.arrival || "N/A"}`,
        departure: item.scheduledDeparture
          ? formatDateDetail(item.scheduledDeparture)
          : "N/A",
        galley: item.galleyDetails?.galleyPosition || "N/A",
        stowage: item.position || "N/A",
        category: item.equipment || "N/A",
        carrier: item.preparationCode || "N/A",
      };

      return (
        <CompletedCheckListItem
          item={mappedItem}
          isLastItem={index === spotCheckLogs.length - 1}
        />
      );
    },
    [spotCheckLogs.length],
  );

  const showLoading = (flightId && isFlightLoading) || isLogsLoading;

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <View className="flex-1 bg-bg-surface p-4">
        {showLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#602AF3" />
            <Text className="mt-4 text-text-secondary">Loading Data...</Text>
          </View>
        ) : (
          <FlatList
            data={spotCheckLogs}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#602AF3"
              />
            }
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Text className="text-text-tertiary">
                  No completed checks found.
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
