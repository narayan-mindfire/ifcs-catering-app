import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { BreadCrumb } from "../components/common/BreadCrumbs";
import { useMemoStore } from "../store/useMemosStore";
import { MemoTab } from "../types/memo";
import { ArrowIcon, StarIcon } from "../assets/icons";

type Props = StackScreenProps<RootStackParamList, "Memos">;
type FilterType = "All" | "Unread" | "Read";

const MemosScreen: React.FC<Props> = ({ navigation }) => {
  const { memos, fetchMemos } = useMemoStore();
  const [activeTab, setActiveTab] = useState<MemoTab>("Inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterType>("All");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  const currentMemos = useMemo(() => {
    let data = memos;
    const currentUserId = "me";

    // 1. Filter by Tab
    switch (activeTab) {
      case "Inbox":
        data = data.filter((m) => m.sender.id !== currentUserId && !m.isDraft);
        break;
      case "Draft":
        data = data.filter((m) => m.sender.id === currentUserId && m.isDraft);
        break;
      case "Sent":
        data = data.filter((m) => m.sender.id === currentUserId && !m.isDraft);
        break;
      case "Acknowledged By Me":
        data = data.filter(
          (m) =>
            m.sender.id !== currentUserId &&
            !m.isDraft &&
            m.isAcknowledged === true,
        );
        break;
    }

    // 2. Filter by Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      data = data.filter(
        (m) =>
          m.sender.name.toLowerCase().includes(lowerQuery) ||
          m.subject.toLowerCase().includes(lowerQuery),
      );
    }

    // 3. Filter by Read/Unread Status (only applies to Inbox)
    if (activeTab === "Inbox" && filterStatus !== "All") {
      if (filterStatus === "Unread") data = data.filter((m) => !m.isRead);
      if (filterStatus === "Read") data = data.filter((m) => m.isRead);
    }

    return data;
  }, [activeTab, searchQuery, filterStatus, memos]);

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
      <View className="px-5 py-4 bg-bg-surface z-10">
        <View className="flex-row items-center gap-3">
          {activeTab === "Inbox" && (
            <View className="relative z-50">
              <TouchableOpacity
                onPress={() => setIsDropdownVisible(!isDropdownVisible)}
                className={`border rounded-lg px-4 py-3 min-w-[120px] items-center ${
                  filterStatus !== "All"
                    ? "bg-bg-tertiary border-bg-button"
                    : "border-border-secondary"
                }`}
              >
                {/* Increased to text-lg (16px) */}
                <Text
                  className={
                    filterStatus !== "All"
                      ? "text-bg-button font-medium text-lg"
                      : "text-text-secondary text-lg"
                  }
                >
                  {filterStatus} ▼
                </Text>
              </TouchableOpacity>
              {isDropdownVisible && (
                <View className="absolute top-14 left-0 w-[140px] bg-bg-surface border border-border-muted rounded-lg shadow-lg z-50">
                  {(["All", "Unread", "Read"] as FilterType[]).map(
                    (opt, index) => (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => {
                          setFilterStatus(opt);
                          setIsDropdownVisible(false);
                        }}
                        className={`p-3 ${
                          index !== 2 ? "border-b border-border-muted" : ""
                        }`}
                      >
                        {/* Increased to text-lg (16px) */}
                        <Text
                          className={`font-medium text-lg ${
                            filterStatus === opt
                              ? "text-bg-button"
                              : "text-text-primary"
                          }`}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              )}
            </View>
          )}
          <View className="flex-1 flex-row items-center bg-bg-tertiary rounded-lg px-4 py-3">
            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              // Increased to text-lg (16px)
              className="flex-1 text-text-primary text-lg"
              placeholderTextColor="#A09CAB"
            />
          </View>
        </View>
      </View>

      <View className="flex-row items-center bg-bg-surface border-b border-border-muted z-0">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {(["Inbox", "Draft", "Acknowledged By Me", "Sent"] as MemoTab[]).map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => {
                  setActiveTab(tab);
                  setFilterStatus("All");
                  setIsDropdownVisible(false);
                }}
                className={`px-6 py-3 rounded-t-lg ${
                  activeTab === tab
                    ? "bg-bg-accent border-bg-button border-t-1 border-l-1 border-r-1 "
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-lg font-medium ${
                    activeTab === tab
                      ? "text-text-primary"
                      : "text-text-tertiary"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
        <View className="pr-5 pl-2">
          <View className="bg-bg-button/10 px-3 py-1 rounded-full border border-bg-button/20">
            {/* Kept as text-sm (14px) for record count to be smaller */}
            <Text className="text-bg-button text-sm font-semibold">
              {currentMemos.length} records
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 z-0">
        {currentMemos.length === 0 ? (
          <View className="p-10 items-center">
            {/* Increased to text-base (16px) */}
            <Text className="text-text-tertiary text-base">No Memos Found</Text>
          </View>
        ) : (
          currentMemos.map((memo) => (
            <TouchableOpacity
              key={memo.id}
              onPress={() =>
                navigation.navigate("MemoDetail", {
                  memoId: memo.id,
                })
              }
              className={`flex-row items-center px-4 py-4 border-b border-border-muted ${
                !memo.isRead ? "bg-bg-quaternary" : "bg-bg-surface"
              }`}
            >
              <View className="w-12 items-center">
                <View
                  className={`w-3 h-3 rounded-full ${
                    !memo.isRead
                      ? "bg-red-500"
                      : "bg-transparent border border-border-muted"
                  }`}
                />
              </View>
              <View className="flex-1">
                {/* Increased to text-lg (16px) */}
                <Text
                  className={`text-lg ${
                    !memo.isRead ? "font-bold" : "text-text-secondary"
                  }`}
                >
                  {memo.sender.name}
                </Text>
                {/* Increased to text-base (16px) */}
                <Text
                  className="text-base text-text-tertiary mt-1"
                  numberOfLines={1}
                >
                  {memo.subject}
                </Text>
              </View>
              {memo.priority === "High" && (
                <View className="mr-2">
                  <StarIcon />
                </View>
              )}
              <View className="w-8">
                <ArrowIcon />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default MemosScreen;
