import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { BreadCrumb } from "../components/common/BreadCrumbs";
import { DropdownIcon } from "../assets/icons";
import { useMemoStore } from "../store/useMemosStore";
import { Memo, MemoTab } from "../types/memo";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

type MemosScreenRouteProp = RouteProp<RootStackParamList, "Memos">;
type MemosScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Memos"
>;

interface Props {
  route: MemosScreenRouteProp;
  navigation: MemosScreenNavigationProp;
}

type FilterType = "All" | "Unread" | "Read";

const MemosScreen: React.FC<Props> = ({ route, navigation }) => {
  // Store Hooks
  const { fetchMemos, getMemosByTab, isLoading, toggleImportant } =
    useMemoStore();

  // Local State
  const [activeTab, setActiveTab] = useState<MemoTab>("Inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  // Derive Data
  const rawMemos = getMemosByTab(activeTab);

  const filteredMemos = useMemo(() => {
    return rawMemos.filter((memo) => {
      // 1. Status Filter
      if (filter === "Read" && !memo.isRead) return false;
      if (filter === "Unread" && memo.isRead) return false;

      // 2. Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          memo.sender.name.toLowerCase().includes(query) ||
          memo.subject.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [rawMemos, filter, searchQuery]);

  const handleMemoPress = (memoId: string) => {
    navigation.navigate("MemoDetail", { memoId });
  };

  const breadcrumbItems = [
    { label: "Dashboard", onPress: () => navigation.navigate("Dashboard") },
    { label: "Memos" },
  ];

  return (
    <View className="flex-1 bg-bg-quaternary">
      <BreadCrumb items={breadcrumbItems} />

      {/* Header & Controls */}
      <View className="px-5 py-4 bg-bg-surface z-10">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-text-primary">Memos</Text>
          <TouchableOpacity className="bg-bg-button px-4 py-2 rounded-lg flex-row items-center">
            <Text className="text-base text-text-surface font-semibold mr-1">
              +
            </Text>
            <Text className="text-base text-text-surface font-semibold">
              Add Memo
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-3 relative">
          {/* Filter Dropdown */}
          <TouchableOpacity
            onPress={() => setShowFilterDropdown(true)}
            className="border border-border-secondary rounded-lg px-4 py-2 flex-row items-center gap-2"
          >
            <Text className="text-text-secondary">
              {filter === "All" ? "Filter: All" : filter}
            </Text>
            <View
              style={{
                transform: [{ rotate: showFilterDropdown ? "180deg" : "0deg" }],
              }}
            >
              <DropdownIcon width={12} height={12} />
            </View>
          </TouchableOpacity>

          {/* Search Bar */}
          <View className="flex-1 flex-row items-center bg-bg-tertiary rounded-lg px-4 py-2">
            <TextInput
              placeholder="Search subject or sender..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-text-primary"
              placeholderTextColor="#A09CAB"
            />
          </View>
          <TouchableOpacity className="bg-bg-button px-6 py-2 rounded-lg">
            <Text className="text-text-surface font-semibold">Search</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Modal */}
        <Modal
          visible={showFilterDropdown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFilterDropdown(false)}
        >
          <Pressable
            className="flex-1 bg-black/10"
            onPress={() => setShowFilterDropdown(false)}
          >
            <View className="absolute top-[180px] left-5 bg-bg-surface rounded-lg shadow-lg border border-border-muted w-40 overflow-hidden">
              {(["All", "Unread", "Read"] as FilterType[]).map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setFilter(option);
                    setShowFilterDropdown(false);
                  }}
                  className={`px-4 py-3 border-b border-border-muted ${filter === option ? "bg-bg-secondary" : ""}`}
                >
                  <Text
                    className={`text-base ${filter === option ? "text-text-primary font-semibold" : "text-text-secondary"}`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>

      {/* Tabs */}
      <View className="bg-bg-surface border-b border-border-muted">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
        >
          <View className="flex-row flex-1 items-center justify-between gap-5">
            {(
              ["Inbox", "Draft", "Acknowledged By Me", "Sent"] as MemoTab[]
            ).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-4 py-3 rounded-t-lg mr-2 ${
                  activeTab === tab
                    ? "bg-bg-accent border-l-1 border-r-1 border-t-1 border-border-accent"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-lg font-medium ${activeTab === tab ? "text-text-primary" : "text-text-tertiary"}`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
            <View className="ml-auto bg-bg-button px-4 py-2 rounded-full">
              <Text className="text-text-surface text-sm font-medium">
                Showing {filteredMemos.length} records
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* List Content */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchMemos()}
          />
        }
      >
        {filteredMemos.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            {isLoading ? (
              <ActivityIndicator size="large" color="#602AF3" />
            ) : (
              <Text className="text-text-tertiary text-base">
                No records found.
              </Text>
            )}
          </View>
        ) : (
          <View className="bg-bg-surface m-4 rounded-lg border border-border-muted overflow-hidden">
            {/* Header */}
            <View className="flex-row bg-bg-secondary px-4 py-3 border-b border-border-muted">
              <View className="w-12" />
              <View className="flex-1">
                <Text className="text-text-secondary font-semibold text-sm">
                  Sender
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-text-secondary font-semibold text-sm">
                  Date
                </Text>
              </View>
              <View className="w-20">
                <Text className="text-text-secondary font-semibold text-sm">
                  Actions
                </Text>
              </View>
            </View>

            {/* 2. Added the explicit type `: Memo` here */}
            {filteredMemos.map((memo: Memo, index: number) => (
              <TouchableOpacity
                key={memo.id}
                onPress={() => handleMemoPress(memo.id)}
                className={`flex-row items-center px-4 py-4 ${
                  index !== filteredMemos.length - 1
                    ? "border-b border-border-muted"
                    : ""
                } ${!memo.isRead ? "bg-bg-quaternary" : "bg-bg-surface"}`}
              >
                {/* Read Status Dot */}
                <View className="w-12 items-center">
                  <View
                    className={`w-3 h-3 rounded-full ${!memo.isRead ? "bg-red-500" : "bg-transparent border border-border-muted"}`}
                  />
                </View>

                {/* Sender & Subject */}
                <View className="flex-1 pr-2">
                  <Text
                    className={`text-base ${!memo.isRead ? "font-bold text-text-primary" : "text-text-secondary"}`}
                  >
                    {memo.sender.name}
                  </Text>
                  <Text
                    className="text-sm text-text-tertiary mt-1"
                    numberOfLines={1}
                  >
                    {memo.subject}
                  </Text>
                </View>

                {/* Date */}
                <View className="flex-1">
                  <Text className="text-text-tertiary text-sm">
                    {formatDate(memo.createdAt)}
                  </Text>
                </View>

                {/* Actions */}
                <View className="w-20 flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleImportant(memo.id);
                    }}
                  >
                    <Text
                      className={`text-lg ${memo.isImportant ? "opacity-100" : "opacity-20 grayscale"}`}
                    >
                      ⭐
                    </Text>
                  </TouchableOpacity>
                  <Text className="text-lg text-bg-button">›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MemosScreen;
