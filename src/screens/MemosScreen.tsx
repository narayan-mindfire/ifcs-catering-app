import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { BreadCrumb } from "../components/common/BreadCrumbs";
import { useMemoStore } from "../store/useMemosStore";
import { MemoTab } from "../types/memo";
import {
  ArrowIcon,
  CheckIcon,
  CheckIconActive,
  StarIcon,
  TrayIcon,
  TrayIconActive,
} from "../assets/icons";

type Props = StackScreenProps<RootStackParamList, "Memos">;

const MemosScreen: React.FC<Props> = ({ navigation }) => {
  const { memos, fetchMemos, isLoading } = useMemoStore();

  const [activeTab, setActiveTab] = useState<MemoTab>("Inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Use ref to store the timeout ID
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // 1. Debounce the search input
  // This waits 500ms after the user stops typing before updating 'debouncedSearch'
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery]);
  useEffect(() => {
    fetchMemos(activeTab, debouncedSearch);
  }, [activeTab, debouncedSearch, fetchMemos]);

  const onRefresh = useCallback(() => {
    fetchMemos(activeTab, debouncedSearch);
  }, [activeTab, debouncedSearch, fetchMemos]);

  console.log("MEMOS LIST: ", memos);

  return (
    <View className="flex-1 bg-bg-quaternary z-0">
      <BreadCrumb
        items={[
          {
            label: "Dashboard",
            onPress: () => navigation.navigate("Dashboard"),
          },
          { label: "Memos" },
        ]}
      />

      {/* Search Bar */}
      <View className="px-5 py-4 bg-bg-surface z-10">
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center bg-bg-tertiary rounded-lg px-4 py-3">
            <TextInput
              placeholder="Search by subject..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-text-primary text-lg"
              placeholderTextColor="#A09CAB"
            />
            {/* Clear Button */}
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                className="ml-2"
              >
                <Text className="text-text-tertiary text-xl">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Visual feedback that search is "waiting" to trigger */}
        {searchQuery !== debouncedSearch && (
          <View className="absolute right-8 top-7">
            <ActivityIndicator size="small" color="#602AF3" />
          </View>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row items-center bg-bg-surface border-b border-border-muted">
        <View className="flex-row flex-1 bg-bg-tertiary rounded-full mx-5 my-3">
          {(["Inbox", "Acknowledged By Me"] as MemoTab[]).map((tab) => {
            const isActive = activeTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                // Added 'flex-row' to align icon and text
                className={`flex-1 flex-row py-2 mx-1 rounded-full items-center justify-center 
                  ${isActive ? "bg-bg-button" : ""}
                `}
              >
                {/* Icon Logic */}
                <View className="mr-2">
                  {tab === "Inbox" ? (
                    isActive ? (
                      <TrayIconActive />
                    ) : (
                      <TrayIcon />
                    )
                  ) : isActive ? (
                    <CheckIconActive />
                  ) : (
                    <CheckIcon height={40} width={40} />
                  )}
                </View>

                <Text
                  className={`text-base font-semibold py-1
                    ${isActive ? "text-white" : "text-text-tertiary"}
                  `}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="pr-5">
          <View className="bg-bg-button/10 px-3 py-1 rounded-full border border-bg-button/20">
            <Text className="text-bg-button text-sm font-semibold">
              {memos.length} records
            </Text>
          </View>
        </View>
      </View>

      {/* List Content */}
      {isLoading && memos.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#602AF3" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 z-0"
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
        >
          {memos.length === 0 ? (
            <View className="p-10 items-center">
              <Text className="text-text-tertiary text-base">
                {searchQuery
                  ? `No memos found matching "${searchQuery}"`
                  : "No Memos Found"}
              </Text>
            </View>
          ) : (
            // REMOVED filteredMemos, using memos directly from store
            memos.map((memo) => {
              const senderName = memo.sender
                ? `${memo.sender.firstName} ${memo.sender.lastName}`
                : "Unknown";

              return (
                <TouchableOpacity
                  key={memo.id}
                  onPress={() =>
                    navigation.navigate("MemoDetail", {
                      memoId: memo.id,
                    })
                  }
                  className="flex-row items-center px-4 py-4 border-b border-border-muted bg-bg-surface"
                >
                  <View className="w-12 h-12 rounded-full bg-bg-tertiary items-center justify-center mr-3">
                    <Text className="text-lg font-bold text-text-secondary">
                      {senderName.charAt(0)}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-lg font-bold text-text-primary">
                      {senderName}
                    </Text>
                    <Text
                      className="text-base text-text-tertiary mt-1"
                      numberOfLines={1}
                    >
                      {memo.subject}
                    </Text>
                  </View>

                  {memo.priority === 3 && (
                    <View className="mr-2">
                      <StarIcon />
                    </View>
                  )}
                  <View className="w-8">
                    <ArrowIcon />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default MemosScreen;
