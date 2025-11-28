import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";
import { BreadCrumb } from "../../components/common/BreadCrumbs";
import { useMemoStore } from "../../store/useMemosStore";
import { StarIcon } from "../../assets/icons";

type MemoDetailScreenRouteProp = RouteProp<RootStackParamList, "MemoDetail">;
type MemoDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MemoDetail"
>;

interface Props {
  route: MemoDetailScreenRouteProp;
  navigation: MemoDetailScreenNavigationProp;
}

const formatDateDetail = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const MemoDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { memoId } = route.params;
  const {
    activeMemo,
    isLoading,
    fetchMemoById,
    acknowledgeMemo,
    toggleImportant,
  } = useMemoStore();

  useEffect(() => {
    fetchMemoById(memoId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoId]);

  const breadcrumbItems = [
    { label: "Dashboard", onPress: () => navigation.navigate("Dashboard") },
    {
      label: "Memos",
      onPress: () => navigation.navigate("Memos"),
    },
    { label: "Memo Details" },
  ];

  const handleAcknowledge = async () => {
    if (activeMemo?.isAcknowledged) return;
    await acknowledgeMemo(memoId);
    Alert.alert("Success", "Memo acknowledged successfully.");
  };

  if (isLoading || !activeMemo) {
    return (
      <View className="flex-1 bg-bg-quaternary justify-center items-center">
        <ActivityIndicator size="large" color="#602AF3" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg-quaternary">
      <BreadCrumb items={breadcrumbItems} />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* Header Card */}
          <View className="bg-bg-surface rounded-lg p-5 mb-4 border border-border-muted">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-text-primary mb-2">
                  {activeMemo.subject}
                </Text>
                <View className="flex-row items-center gap-2 flex-wrap">
                  <View
                    className={`px-3 py-1 rounded-full ${
                      activeMemo.priority === "High"
                        ? "bg-red-100"
                        : activeMemo.priority === "Medium"
                          ? "bg-orange-100"
                          : "bg-blue-100"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        activeMemo.priority === "High"
                          ? "text-red-700"
                          : activeMemo.priority === "Medium"
                            ? "text-orange-700"
                            : "text-blue-700"
                      }`}
                    >
                      {activeMemo.priority} Priority
                    </Text>
                  </View>
                  <View className="bg-bg-tertiary px-3 py-1 rounded-full">
                    <Text className="text-sm text-text-secondary">
                      {activeMemo.isRead ? "Read" : "Unread"}
                    </Text>
                  </View>
                  {activeMemo.isAcknowledged && (
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-sm text-green-700 font-medium">
                        Acknowledged
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity
                className="ml-4"
                onPress={() => toggleImportant(activeMemo.id)}
              >
                <Text
                  className={`text-2xl ${activeMemo.isImportant ? "opacity-100" : "opacity-30 grayscale"}`}
                >
                  <StarIcon />
                </Text>
              </TouchableOpacity>
            </View>

            <View className="border-t border-border-muted pt-4 mb-4">
              <View className="flex-row items-center mb-2">
                <Text className="text-text-tertiary text-sm font-medium w-20">
                  From:
                </Text>
                <Text className="text-text-primary text-base font-semibold">
                  {activeMemo.sender.name}{" "}
                  <Text className="text-text-tertiary font-normal">
                    ({activeMemo.sender.role})
                  </Text>
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-text-tertiary text-sm font-medium w-20">
                  Date:
                </Text>
                <Text className="text-text-secondary text-base">
                  {formatDateDetail(activeMemo.createdAt)}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              {activeMemo.requiresAcknowledgement && (
                <TouchableOpacity
                  onPress={handleAcknowledge}
                  disabled={activeMemo.isAcknowledged}
                  className={`flex-1 py-3 rounded-lg items-center ${activeMemo.isAcknowledged ? "bg-bg-tertiary opacity-50" : "bg-bg-button"}`}
                >
                  <Text
                    className={`${activeMemo.isAcknowledged ? "text-text-tertiary" : "text-text-surface"} font-semibold text-base`}
                  >
                    {activeMemo.isAcknowledged ? "Acknowledged" : "Acknowledge"}
                  </Text>
                </TouchableOpacity>
              )}

              {/* <TouchableOpacity className="flex-1 border border-border-secondary py-3 rounded-lg items-center">
                <Text className="text-text-secondary font-semibold text-base">
                  Reply
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 border border-border-secondary py-3 rounded-lg items-center">
                <Text className="text-text-secondary font-semibold text-base">
                  Forward
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>

          {/* Content Card */}
          <View className="bg-bg-surface rounded-lg p-5 mb-4 border border-border-muted min-h-[200px]">
            <Text className="text-lg font-bold text-text-primary mb-4">
              Message Content
            </Text>
            <Text className="text-base text-text-secondary leading-6">
              {activeMemo.content}
            </Text>
          </View>

          {/* Attachments Card */}
          {activeMemo.attachments.length > 0 && (
            <View className="bg-bg-surface rounded-lg p-5 border border-border-muted">
              <Text className="text-lg font-bold text-text-primary mb-4">
                Attachments ({activeMemo.attachments.length})
              </Text>
              {activeMemo.attachments.map((attachment) => (
                <TouchableOpacity
                  key={attachment.id}
                  className="flex-row items-center justify-between p-3 mb-2 bg-bg-tertiary rounded-lg border border-border-muted"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-bg-accent rounded items-center justify-center mr-3">
                      <Text className="text-lg">
                        {attachment.type === "pdf"
                          ? "📄"
                          : attachment.type === "excel"
                            ? "📊"
                            : "📎"}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-base font-medium text-text-primary"
                        numberOfLines={1}
                      >
                        {attachment.name}
                      </Text>
                      <Text className="text-sm text-text-tertiary">
                        {attachment.size}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity className="bg-bg-button px-4 py-2 rounded-lg ml-2">
                    <Text className="text-text-surface font-medium text-sm">
                      Download
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MemoDetailScreen;
