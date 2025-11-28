import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { BreadCrumb } from "../components/common/BreadCrumbs";

type MemosScreenRouteProp = RouteProp<RootStackParamList, "Memos">;
type MemosScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Memos"
>;

interface Props {
  route: MemosScreenRouteProp;
  navigation: MemosScreenNavigationProp;
}

type TabType = "Inbox" | "Draft" | "Acknowledged By Me" | "Sent";

interface Memo {
  id: string;
  sender: string;
  date: string;
  isImportant: boolean;
  isRead: boolean;
  subject?: string;
}

const MemosScreen: React.FC<Props> = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>("Inbox");
  const [searchQuery, setSearchQuery] = useState("");

  const mockMemos: Record<TabType, Memo[]> = {
    Inbox: [
      {
        id: "1",
        sender: "Shitanshu",
        date: "Nov 24, 2025",
        isImportant: true,
        isRead: false,
        subject: "Flight Safety Protocol Update",
      },
      {
        id: "2",
        sender: "John Doe",
        date: "Nov 23, 2025",
        isImportant: false,
        isRead: true,
        subject: "Weekly Maintenance Report",
      },
    ],
    Draft: [],
    "Acknowledged By Me": [],
    Sent: [],
  };

  const breadcrumbItems = [
    {
      label: "Dashboard",
      onPress: () => navigation.navigate("Dashboard"),
    },
    {
      label: "Memos",
    },
  ];

  const currentMemos = mockMemos[activeTab];
  const unreadFilter = "Unread";

  const handleMemoPress = (memoId: string) => {
    navigation.navigate("MemoDetail", { memoId });
  };

  const handleAddMemo = () => {
    navigation.navigate("CreateMemo");
  };

  return (
    <View className="flex-1 bg-bg-quaternary">
      <BreadCrumb items={breadcrumbItems} />

      <View className="px-5 py-4 bg-bg-surface">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-text-primary">Memos</Text>
          <TouchableOpacity
            onPress={handleAddMemo}
            className="bg-bg-button px-4 py-2 rounded-lg flex-row items-center"
          >
            <Text className="text-base text-text-surface font-semibold mr-1">
              +
            </Text>
            <Text className="text-base text-text-surface font-semibold">
              Add Memo
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="border border-border-secondary rounded-lg px-4 py-2">
            <Text className="text-text-secondary">{unreadFilter} ▼</Text>
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center bg-bg-tertiary rounded-lg px-4 py-2">
            <TextInput
              placeholder="Search..."
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
      </View>
      <View className="bg-bg-surface border-b border-border-muted">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5"
        >
          <View className="flex-row items-center gap-2">
            {(
              ["Inbox", "Draft", "Acknowledged By Me", "Sent"] as TabType[]
            ).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-t-lg ${
                  activeTab === tab ? "bg-bg-secondary" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-base font-medium ${
                    activeTab === tab
                      ? "text-text-primary"
                      : "text-text-tertiary"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
            <View className="ml-auto bg-bg-button px-4 py-2 rounded-full">
              <Text className="text-text-surface text-sm font-medium">
                Showing {currentMemos.length} records
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1">
        {currentMemos.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-text-tertiary text-base">
              No memos in {activeTab}
            </Text>
          </View>
        ) : (
          <View className="bg-bg-surface m-4 rounded-lg border border-border-muted overflow-hidden">
            {/* Table Header */}
            <View className="flex-row bg-bg-secondary px-4 py-3 border-b border-border-muted">
              <View className="w-12"></View>
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

            {/* Table Rows */}
            {currentMemos.map((memo, index) => (
              <TouchableOpacity
                key={memo.id}
                onPress={() => handleMemoPress(memo.id)}
                className={`flex-row items-center px-4 py-4 ${
                  index !== currentMemos.length - 1
                    ? "border-b border-border-muted"
                    : ""
                } ${!memo.isRead ? "bg-bg-quaternary" : "bg-bg-surface"}`}
              >
                {/* Status Indicator */}
                <View className="w-12 items-center">
                  <View
                    className={`w-3 h-3 rounded-full ${
                      !memo.isRead
                        ? "bg-red-500"
                        : "bg-transparent border border-border-muted"
                    }`}
                  />
                </View>

                {/* Sender */}
                <View className="flex-1">
                  <Text
                    className={`text-base ${
                      !memo.isRead
                        ? "font-bold text-text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {memo.sender}
                  </Text>
                  {memo.subject && (
                    <Text
                      className="text-sm text-text-tertiary mt-1"
                      numberOfLines={1}
                    >
                      {memo.subject}
                    </Text>
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-text-tertiary text-sm">
                    {memo.date}
                  </Text>
                </View>

                <View className="w-20 flex-row items-center gap-2">
                  {memo.isImportant && <Text className="text-lg">⭐</Text>}
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
