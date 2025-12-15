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
  CheckIcon,
  CheckIconActive,
  TrayIcon,
  TrayIconActive,
  DocsIconDark,
  SparkleIcon,
} from "../assets/icons";

type Props = StackScreenProps<RootStackParamList, "Memos">;

const MemosScreen: React.FC<Props> = ({ navigation }) => {
  const { memos, fetchMemos, isLoading } = useMemoStore();

  const [activeTab, setActiveTab] = useState<MemoTab>("Inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

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

        {searchQuery !== debouncedSearch && (
          <View className="absolute right-8 top-7">
            <ActivityIndicator size="small" color="#602AF3" />
          </View>
        )}
      </View>

      <View className="flex-row items-center bg-bg-surface border-b border-border-muted">
        <View className="flex-row flex-1 bg-bg-tertiary rounded-full mx-5 my-3">
          {(["Inbox", "Acknowledged By Me"] as MemoTab[]).map((tab) => {
            const isActive = activeTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 flex-row mx-1 rounded-full items-center justify-center 
                  ${isActive ? "bg-bg-button" : ""}
                `}
              >
                <View className="mr-2">
                  {tab === "Inbox" ? (
                    isActive ? (
                      <TrayIconActive height={40} width={40} />
                    ) : (
                      <TrayIcon height={40} width={40} />
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

      {/* Card Grid Content */}
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
            <View className="flex-row flex-wrap px-3 py-4">
              {memos.map((memo) => {
                const formattedDate = formatDate(memo.createdAt);
                const isPriority = memo.priority === 3;

                return (
                  <TouchableOpacity
                    key={memo.id}
                    onPress={() =>
                      navigation.navigate("MemoDetail", {
                        memoId: memo.id,
                      })
                    }
                    className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2"
                  >
                    <View
                      className={`rounded-xl p-4 ${
                        isPriority
                          ? "bg-[#FFDD99]/40 border-2 border-[#FFDD99]"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <View className="flex-row items-start justify-between mb-3">
                        <View className="flex-row items-center flex-1">
                          {isPriority ? (
                            <View className="mr-2">
                              <SparkleIcon />
                            </View>
                          ) : (
                            <View className="mr-2">
                              <DocsIconDark />
                              {/* <SparkleIcon /> */}
                            </View>
                          )}
                          <Text
                            className="text-base font-semibold text-gray-900 flex-1"
                            numberOfLines={1}
                          >
                            {memo.subject}
                          </Text>
                        </View>

                        <View
                          className={`px-3 py-1 rounded-md ml-2 ${
                            memo.isRead ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              memo.isRead ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {memo.isRead ? "Read" : "Unread"}
                          </Text>
                        </View>
                      </View>

                      {/* Note content */}
                      <Text
                        className="text-sm text-gray-600 mb-3 leading-5"
                        numberOfLines={1}
                      >
                        {memo.note}
                      </Text>

                      {/* Date */}
                      <Text className="text-xs text-gray-400">
                        {formattedDate}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default MemosScreen;
