import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { BreadCrumb } from "../components/common/BreadCrumbs";
import { FlightListHeader } from "../components/flight-list/FlightListHeader";
import { FlightRow } from "../components/flight-list/FlightRow";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useFlightStore } from "../store/useFlightStore";
import { Flight } from "../types/flight";
import { formatDate } from "../utils/dateFormatter";
import { log } from "../utils/logger";

type FlightsScreenRouteProp = RouteProp<RootStackParamList, "Flights">;
type FlightsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Flights"
>;

interface Props {
  navigation: FlightsScreenNavigationProp;
  route: FlightsScreenRouteProp;
}

type DateFieldType = "start" | "end" | null;

const formatDateToISO = (date: Date) => date.toISOString().split("T")[0];

const FlightsScreen: React.FC<Props> = ({ navigation }) => {
  const {
    flightGroups,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasNextPage,
    error,
    fetchFlights,
    loadMoreFlights,
    setFilters,
    filters,
  } = useFlightStore();

  const [localFlightNum, setLocalFlightNum] = useState(filters.flight || "");
  const [startDate, setStartDate] = useState<Date | null>(
    filters.startDate ? new Date(filters.startDate) : new Date(),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    filters.endDate ? new Date(filters.endDate) : new Date(),
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState<DateFieldType>(null);

  useEffect(() => {
    fetchFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const delayInput = setTimeout(() => {
      if (localFlightNum !== filters.flight) {
        setFilters({ flight: localFlightNum });
      }
    }, 500);
    return () => clearTimeout(delayInput);
  }, [localFlightNum, filters.flight, setFilters]);

  const openDatePicker = useCallback((field: "start" | "end") => {
    setActiveDateField(field);
    setShowDatePicker(true);
  }, []);

  const clearDateFilter = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setFilters({ startDate: undefined, endDate: undefined });
  }, [setFilters]);

  const applyDateChange = useCallback(
    (date: Date) => {
      let newStart = startDate;
      let newEnd = endDate;

      if (activeDateField === "start") {
        setStartDate(date);
        newStart = date;
        if (newEnd && date > newEnd) {
          setEndDate(date);
          newEnd = date;
        }
      } else if (activeDateField === "end") {
        setEndDate(date);
        newEnd = date;
        if (newStart && date < newStart) {
          setStartDate(date);
          newStart = date;
        }
      }

      setFilters({
        startDate: newStart ? formatDateToISO(newStart) : undefined,
        endDate: newEnd ? formatDateToISO(newEnd) : undefined,
      });

      setActiveDateField(null);
    },
    [activeDateField, startDate, endDate, setFilters],
  );

  const onDateChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS === "android") {
        setShowDatePicker(false);
        if (event.type === "set" && date) {
          applyDateChange(date);
        }
      } else {
        if (date) {
          if (activeDateField === "start") setStartDate(date);
          if (activeDateField === "end") setEndDate(date);
        }
      }
    },
    [activeDateField, applyDateChange],
  );

  const confirmDateIOS = useCallback(() => {
    setShowDatePicker(false);
    const targetDate = activeDateField === "start" ? startDate : endDate;
    if (targetDate) {
      applyDateChange(targetDate);
    }
  }, [activeDateField, startDate, endDate, applyDateChange]);

  const handleRetry = useCallback(() => {
    fetchFlights();
  }, [fetchFlights]);

  const handleLoadMore = useCallback(() => {
    log.info("LOADING MORE");
    if (!isLoadingMore && hasNextPage) {
      loadMoreFlights();
    }
  }, [isLoadingMore, hasNextPage, loadMoreFlights]);

  const renderFlightGroup: ListRenderItem<Flight[]> = useCallback(
    ({ item: group }) => {
      const isPaired = group.length > 1;
      const groupLength = group.length;

      return (
        <View className="mb-4 bg-bg-surface border-t border-border-secondary shadow-sm">
          {group.map((flight, flightIndex) => (
            <FlightRow
              key={flight.id}
              flight={flight}
              navigation={navigation}
              isLastInGroup={flightIndex === groupLength - 1}
              isFirstInGroup={flightIndex === 0}
              isPaired={isPaired}
              flightGroup={group}
            />
          ))}
        </View>
      );
    },
    [navigation],
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#00529b" />
      </View>
    );
  }, [isLoadingMore]);

  const breadcrumbs = useMemo(
    () => [
      { label: "Dashboard", onPress: () => navigation.navigate("Dashboard") },
      { label: "Flights" },
    ],
    [navigation],
  );

  const showLoading = isLoading && flightGroups.length === 0;

  return (
    <>
      <BreadCrumb items={breadcrumbs} />
      <View className="px-4 py-3 bg-bg-tertiary">
        <View className="flex-row items-center gap-2">
          <Text className="font-extrabold text-4xl text-text-primary">YUL</Text>
          <View className="flex-row items-center gap-2 ml-auto">
            <Pressable
              className="bg-bg-surface rounded-lg border border-border-secondary h-[40px] w-[120px] justify-center px-3"
              onPress={() => openDatePicker("start")}
            >
              <Text className="text-xs text-text-tertiary mb-0.5">From</Text>
              <Text
                className={`text-sm font-semibold ${
                  startDate ? "text-text-primary" : "text-text-muted"
                }`}
              >
                {startDate ? formatDate(String(startDate)) : "Select"}
              </Text>
            </Pressable>

            <Pressable
              className="bg-bg-surface rounded-lg border border-border-secondary h-[40px] w-[120px] justify-center px-3"
              onPress={() => openDatePicker("end")}
            >
              <Text className="text-xs text-text-tertiary mb-0.5">To</Text>
              <Text
                className={`text-sm font-semibold ${
                  endDate ? "text-text-primary" : "text-text-muted"
                }`}
              >
                {endDate ? formatDate(String(endDate)) : "Select"}
              </Text>
            </Pressable>

            {startDate || endDate ? (
              <Pressable
                className="bg-bg-button-secondary rounded-lg h-[40px] w-[40px] justify-center items-center border border-border-secondary"
                onPress={clearDateFilter}
              >
                <Text className="text-text-primary font-bold">✕</Text>
              </Pressable>
            ) : (
              <View className="h-[40px] w-[40px]" />
            )}

            <View className="bg-bg-surface rounded-lg border border-border-secondary w-[140px] h-[40px] flex-row items-center px-2">
              <TextInput
                className="flex-1 text-base text-text-primary h-full"
                placeholder="Flight #"
                placeholderTextColor="#999"
                value={localFlightNum}
                onChangeText={setLocalFlightNum}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>
      </View>

      {showDatePicker && (
        <View className="bg-black/50 absolute top-0 left-0 right-0 bottom-0 z-[1000] justify-center items-center">
          <View className="bg-bg-surface rounded-xl p-4 shadow-lg min-w-[300px]">
            <Text className="text-lg font-bold mb-4 text-center text-text-primary">
              Select {activeDateField === "start" ? "Start" : "End"} Date
            </Text>

            <DateTimePicker
              testID="dateTimePicker"
              value={
                (activeDateField === "start" ? startDate : endDate) ||
                new Date()
              }
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onDateChange}
              accentColor="#602AF3"
              textColor="#602AF3"
              style={{ height: Platform.OS === "ios" ? 300 : "auto" }}
            />

            {Platform.OS === "ios" && (
              <View className="flex-row justify-between mt-4 gap-3">
                <Pressable
                  className="flex-1 py-3 rounded-lg items-center bg-bg-tertiary"
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text className="text-text-primary text-base font-semibold">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  className="flex-1 py-3 rounded-lg items-center bg-bg-button"
                  onPress={confirmDateIOS}
                >
                  <Text className="text-text-surface text-base font-semibold">
                    Done
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      )}

      {showLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00529b" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-base">{error}</Text>
          <Pressable
            onPress={handleRetry}
            className="mt-4 p-2 bg-blue-100 rounded"
          >
            <Text>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={flightGroups}
          renderItem={renderFlightGroup}
          keyExtractor={(group, index) => {
            const groupKey = group.map((f) => f.id).join("-");
            return groupKey || `group-${index}`;
          }}
          ListHeaderComponent={<FlightListHeader />}
          stickyHeaderIndices={[0]}
          onRefresh={() => fetchFlights(undefined, true)}
          refreshing={isRefreshing}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="justify-center items-center mt-10">
              <Text className="text-text-muted text-base">
                No flights found matching filters.
              </Text>
            </View>
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={3}
          ListFooterComponent={renderFooter}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          getItemLayout={undefined}
        />
      )}
    </>
  );
};

export default FlightsScreen;
