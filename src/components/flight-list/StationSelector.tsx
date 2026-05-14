import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { DropdownIcon } from "@/assets/icons";
import { useFlightStore } from "@/store/useFlightStore";

interface Props {
  currentStation: string;
}

export const StationSelector: React.FC<Props> = ({ currentStation }) => {
  const { destinations, fetchDestinations, isDestinationsLoading, setFilters } =
    useFlightStore();

  const [query, setQuery] = useState(currentStation);
  const [showDropdown, setShowDropdown] = useState(false);

  // Sync internal state if external filter changes
  useEffect(() => {
    setQuery(currentStation);
  }, [currentStation]);

  // Debounced Search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Avoid fetching if the query matches the selected station exactly (initial load)
      // or if the dropdown isn't open
      if (showDropdown) {
        fetchDestinations(query);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, showDropdown, fetchDestinations]);

  const handleFocus = () => {
    setShowDropdown(true);
    fetchDestinations("");
  };

  const handleSelect = (code: string) => {
    setQuery(code);
    setShowDropdown(false);
    setFilters({ station: code });
  };

  return (
    <View className="relative z-50">
      {/* Input Container */}
      <View className="flex-row items-center justify-between border-b-2 border-text-primary pb-1 min-w-[120px] px-2">
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text.toUpperCase());
            setShowDropdown(true);
          }}
          onFocus={handleFocus}
          placeholder="STN"
          placeholderTextColor="#999"
          className="font-extrabold text-4xl text-text-primary flex-1 p-0 m-0 leading-tight tracking-tight"
          maxLength={3}
          autoCapitalize="characters"
          selectTextOnFocus
        />
        <Pressable onPress={() => setShowDropdown(!showDropdown)} hitSlop={10}>
          <DropdownIcon />
        </Pressable>
      </View>

      {showDropdown && (
        <>
          <Pressable
            className="absolute -top-[1000px] -left-[1000px] -right-[1000px] -bottom-[1000px] z-40 bg-transparent"
            onPress={() => setShowDropdown(false)}
          />

          <View
            className="absolute left-0 w-[280px] bg-bg-surface border border-border-secondary rounded-lg shadow-xl z-50 max-h-[300px] top-[100%] mt-2"
            style={{ elevation: 5 }}
          >
            {isDestinationsLoading ? (
              <View className="p-4 items-center justify-center">
                <ActivityIndicator size="small" color="#00529b" />
              </View>
            ) : (
              <FlatList
                data={destinations}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                ListEmptyComponent={
                  <View className="p-4 items-center">
                    <Text className="text-text-muted text-sm">
                      No stations found
                    </Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <Pressable
                    className={`px-4 py-3 border-b border-border-secondary flex-row justify-between items-center active:bg-bg-tertiary ${
                      item.code === currentStation ? "bg-blue-50/50" : ""
                    }`}
                    onPress={() => handleSelect(item.code)}
                  >
                    <View>
                      <Text className="text-text-primary font-bold text-lg">
                        {item.code}
                      </Text>
                      <Text className="text-text-tertiary text-xs">
                        {item.city}, {item.country}
                      </Text>
                    </View>
                    {item.code === currentStation && (
                      <Text className="text-blue-600 font-bold text-lg">✓</Text>
                    )}
                  </Pressable>
                )}
              />
            )}
          </View>
        </>
      )}
    </View>
  );
};
