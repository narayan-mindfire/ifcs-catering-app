import { StackScreenProps } from "@react-navigation/stack";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  CheckIcon,
  CheckIconActive,
  DocsIconDark,
  ListChecksIcon,
  NoMemoIcon,
  SparkleIcon,
  SquaresIcon,
  TrayIcon,
  TrayIconActive,
} from "../assets/icons";
import { AppButton } from "../components/common/AppButton";
import { BreadCrumb } from "../components/common/BreadCrumbs";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuthStore } from "../store/useAuthStore";
import { useMemoStore } from "../store/useMemosStore";
import { MemoTab } from "../types/memo";

type Props = StackScreenProps<RootStackParamList, "Memos">;

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

const TABS: MemoTab[] = ["Inbox", "Acknowledged"];

type ViewMode = "grid" | "list";

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent) => {
  const paddingToBottom = 50;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const MemosScreen: React.FC<Props> = ({ navigation }) => {
  const { memos, fetchMemos, isLoading, isLoadingMore, hasMore } =
    useMemoStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<MemoTab>("Inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

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
    if (user?.id) {
      fetchMemos(user.id, activeTab, debouncedSearch);
    }
  }, [activeTab, user?.id, debouncedSearch, fetchMemos]);

  const onRefresh = useCallback(() => {
    if (user?.id) {
      fetchMemos(user.id, activeTab, debouncedSearch);
    }
  }, [activeTab, user?.id, debouncedSearch, fetchMemos]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore && user?.id) {
      fetchMemos(user.id, activeTab, debouncedSearch, true);
    }
  }, [
    isLoading,
    isLoadingMore,
    hasMore,
    user?.id,
    fetchMemos,
    activeTab,
    debouncedSearch,
  ]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isCloseToBottom(event.nativeEvent)) {
      handleLoadMore();
    }
  };

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleTabChange = useCallback((tab: MemoTab) => {
    setActiveTab(tab);
  }, []);

  const breadcrumbs = useMemo(
    () => [
      {
        label: "Dashboard",
        onPress: () => navigation.navigate("Dashboard"),
      },
      { label: "Memos" },
    ],
    [navigation],
  );

  return (
    <View className="flex-1 bg-bg-quaternary z-0">
      <BreadCrumb items={breadcrumbs} />

      {/* Search bar + View toggle */}
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
              <TouchableOpacity onPress={handleClearSearch} className="ml-2">
                <Text className="text-text-tertiary text-xl">✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row items-center bg-bg-tertiary rounded-lg overflow-hidden">
            <TouchableOpacity
              onPress={() => setViewMode("grid")}
              className={`p-3 ${
                viewMode === "grid" ? "bg-bg-accent" : "bg-transparent"
              }`}
            >
              <SquaresIcon
                width={22}
                height={22}
                color={viewMode === "grid" ? "#ffffff" : "#A09CAB"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode("list")}
              className={`p-3 ${
                viewMode === "list" ? "bg-bg-accent" : "bg-transparent"
              }`}
            >
              <ListChecksIcon
                width={22}
                height={22}
                color={viewMode === "list" ? "#ffffff" : "#A09CAB"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {searchQuery !== debouncedSearch && (
          <View className="absolute right-8 top-7">
            <ActivityIndicator size="small" color="#602AF3" />
          </View>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row items-center bg-bg-surface border-b border-border-muted">
        <View className="flex-row flex-1 bg-bg-tertiary rounded-full mx-5 my-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const icon =
              tab === "Inbox" ? (
                isActive ? (
                  <TrayIconActive height={30} width={30} />
                ) : (
                  <TrayIcon height={30} width={30} />
                )
              ) : isActive ? (
                <CheckIconActive height={30} width={30} />
              ) : (
                <CheckIcon height={30} width={30} />
              );

            return (
              <AppButton
                key={tab}
                title={tab}
                onPress={() => handleTabChange(tab)}
                type={isActive ? "primary" : "secondary"}
                IconComponent={icon}
                style={{
                  flex: 1,
                  marginHorizontal: 4,
                  paddingVertical: 4,
                  borderRadius: 999,
                }}
                textStyle={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: isActive ? "#fff" : undefined,
                }}
              />
            );
          })}
        </View>

        <View className="pr-5 hidden sm:flex">
          <View className="bg-bg-button/10 px-3 py-1 rounded-full border border-bg-button/20">
            <Text className="text-bg-button text-sm font-semibold">
              {memos.length} memos
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      {isLoading && memos.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#602AF3" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 z-0"
          onScroll={handleScroll}
          scrollEventThrottle={400}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
        >
          {memos.length === 0 ? (
            <View className="p-10 mt-40 items-center">
              <NoMemoIcon />
              <Text className="text-text-tertiary mt-2 text-base">
                {searchQuery
                  ? `No memos found matching "${searchQuery}"`
                  : "No Memos Found"}
              </Text>
            </View>
          ) : viewMode === "grid" ? (
            /* ── GRID VIEW ── */
            <View className="flex-row flex-wrap px-3 py-4">
              {memos.map((memo) => {
                const formattedDate = formatDate(memo.createdAt);
                const isPriority = memo.priority === 3;
                const displayIsRead = memo.isRead ?? true;

                return (
                  <TouchableOpacity
                    key={memo.id}
                    onPress={() =>
                      navigation.navigate("MemoDetail", { memoId: memo.id })
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
                            displayIsRead ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              displayIsRead ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {displayIsRead ? "Read" : "Unread"}
                          </Text>
                        </View>
                      </View>

                      <Text
                        className="text-sm text-gray-600 mb-3 leading-5"
                        numberOfLines={1}
                      >
                        {memo.note}
                      </Text>

                      <View className="flex-row justify-between items-center">
                        <Text className="text-xs text-gray-400">
                          {formattedDate}
                        </Text>
                        {memo.version && (
                          <Text className="text-xs text-gray-400 bg-gray-100 px-1.5 rounded">
                            v{memo.version}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            /* ── LIST VIEW ── */
            <View className="px-3 py-4 gap-2">
              {memos.map((memo) => {
                const formattedDate = formatDate(memo.createdAt);
                const isPriority = memo.priority === 3;
                const displayIsRead = memo.isRead ?? true;

                return (
                  <TouchableOpacity
                    key={memo.id}
                    onPress={() =>
                      navigation.navigate("MemoDetail", { memoId: memo.id })
                    }
                    className="w-full"
                  >
                    <View
                      className={`rounded-xl px-4 py-3 flex-row items-center gap-3 ${
                        isPriority
                          ? "bg-[#FFDD99]/40 border-2 border-[#FFDD99]"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      {/* Icon */}
                      <View className="shrink-0">
                        {isPriority ? <SparkleIcon /> : <DocsIconDark />}
                      </View>

                      {/* Subject + note */}
                      <View className="flex-1 min-w-0">
                        <Text
                          className="text-sm font-semibold text-gray-900"
                          numberOfLines={1}
                        >
                          {memo.subject}
                        </Text>
                        <Text
                          className="text-xs text-gray-500 mt-0.5"
                          numberOfLines={1}
                        >
                          {memo.note}
                        </Text>
                      </View>

                      {/* Date + version */}
                      <View className="items-end shrink-0 gap-1">
                        <Text className="text-xs text-gray-400">
                          {formattedDate}
                        </Text>
                        {memo.version && (
                          <Text className="text-xs text-gray-400 bg-gray-100 px-1.5 rounded">
                            v{memo.version}
                          </Text>
                        )}
                      </View>

                      {/* Read badge */}
                      <View
                        className={`px-2.5 py-1 rounded-md shrink-0 ${
                          displayIsRead ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            displayIsRead ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {displayIsRead ? "Read" : "Unread"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {isLoadingMore && (
            <View className="py-5 items-center">
              <ActivityIndicator size="small" color="#602AF3" />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default MemosScreen;
