import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { BreadCrumb } from "../../components/common/BreadCrumbs";
import {
  CompletedCheckItem,
  CompletedCheckListItem,
} from "../../components/SpotCheck/CompletedCheckListItem";
import { SpotCheckHeader } from "../../components/SpotCheck/SpotCheckHeader";
import { MOCK_COMPLETED_CHECKS } from "../../const/spotChecks";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useFlightStore } from "../../store/useFlightStore";
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
  const { flightId } = route.params || {};

  const {
    selectedFlight,
    fetchFlightById,
    isLoading: isFlightLoading,
  } = useFlightStore();

  useEffect(() => {
    if (flightId) {
      if (!selectedFlight || selectedFlight.id !== flightId) {
        fetchFlightById(flightId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId]);

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
    ({ item, index }: { item: CompletedCheckItem; index: number }) => {
      return (
        <CompletedCheckListItem
          item={item}
          isLastItem={index === MOCK_COMPLETED_CHECKS.length - 1}
        />
      );
    },
    [],
  );

  const showLoading = flightId && isFlightLoading;

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <View className="flex-1 bg-bg-surface p-4">
        {showLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#602AF3" />
            <Text className="mt-4 text-text-secondary">
              Loading Flight Data...
            </Text>
          </View>
        ) : (
          <FlatList
            data={MOCK_COMPLETED_CHECKS}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
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
