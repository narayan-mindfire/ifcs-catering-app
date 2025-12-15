import React, { useEffect, useState } from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { BreadCrumb } from "../components/common/BreadCrumbs";
import { FlightRow } from "../components/flight-list/FlightRow";
import { FlightListHeader } from "../components/flight-list/FlightListHeader";
import { useFlightStore } from "../store/useFlightStore";
import { Flight } from "../types/flight";
import { formatDate } from "../utils/dateFormatter";

type FlightsScreenRouteProp = RouteProp<RootStackParamList, "Flights">;
type FlightsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Flights"
>;

interface Props {
  navigation: FlightsScreenNavigationProp;
  route: FlightsScreenRouteProp;
}

const FlightsScreen: React.FC<Props> = ({ navigation }) => {
  const { flightGroups, isLoading, error, fetchFlights, setFilters, filters } =
    useFlightStore();

  const [localFlightNum, setLocalFlightNum] = useState(filters.flight || "");

  const [startDate, setStartDate] = useState<Date | null>(
    filters.startDate ? new Date(filters.startDate) : new Date(),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    filters.endDate ? new Date(filters.endDate) : new Date(),
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState<
    "start" | "end" | null
  >(null);

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

  const formatDateToISO = (date: Date) => date.toISOString().split("T")[0];

  const openDatePicker = (field: "start" | "end") => {
    setActiveDateField(field);
    setShowDatePicker(true);
  };

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setFilters({ startDate: undefined, endDate: undefined });
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
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
  };

  const applyDateChange = (date: Date) => {
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
  };

  const confirmDateIOS = () => {
    setShowDatePicker(false);
    const targetDate = activeDateField === "start" ? startDate : endDate;
    if (targetDate) {
      applyDateChange(targetDate);
    }
  };

  const renderFlightGroup = ({ item: group }: { item: Flight[] }) => {
    const isPaired = group.length > 1;
    return (
      <View className="mb-4 bg-bg-surface border-t border-border-secondary shadow-sm">
        {group.map((flight, index) => (
          <FlightRow
            key={flight.id}
            flight={flight}
            navigation={navigation}
            isLastInGroup={index === group.length - 1}
            isFirstInGroup={index === 0}
            isPaired={isPaired}
            flightGroup={group}
          />
        ))}
      </View>
    );
  };

  const breadcrumbItems = [
    { label: "Dashboard", onPress: () => navigation.navigate("Dashboard") },
    { label: "Flights" },
  ];

  const showLoading = isLoading && flightGroups.length === 0;

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />

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
              <View className="h-[40px] w-[40px]"></View>
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
            onPress={() => fetchFlights()}
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
          keyExtractor={(group, index) => group[0]?.id || index.toString()}
          ListHeaderComponent={<FlightListHeader />}
          stickyHeaderIndices={[0]}
          onRefresh={() => fetchFlights()}
          refreshing={isLoading}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="justify-center items-center mt-10">
              <Text className="text-text-muted text-base">
                No flights found matching filters.
              </Text>
            </View>
          }
        />
      )}
    </>
  );
};

export default FlightsScreen;
