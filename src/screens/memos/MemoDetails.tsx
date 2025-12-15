import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { RootStackParamList } from "../../../App";
import { useMemoStore } from "../../store/useMemosStore";
import {
  GearIcon,
  SparkleIcon,
  UploadIcon,
  UserIcon,
} from "../../assets/icons";
import { formatDateDetail } from "../../utils/dateFormatter";
import { BreadCrumb } from "../../components/common/BreadCrumbs";

type MemoDetailScreenRouteProp = RouteProp<RootStackParamList, "MemoDetail">;
type MemoDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MemoDetail"
>;

interface Props {
  route: MemoDetailScreenRouteProp;
  navigation: MemoDetailScreenNavigationProp;
}

const MemoDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { memoId } = route.params;
  const { activeMemo, isLoading, fetchMemoById, acknowledgeMemo, markAsRead } =
    useMemoStore();

  const [isAckLoading, setIsAckLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const CURRENT_USER_ID = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";

  const currentUserRecipientRecord = activeMemo?.recipients?.find(
    (r: { userId: string; isAcknowledge: boolean }) =>
      r.userId === CURRENT_USER_ID,
  );

  const isAcknowledged = currentUserRecipientRecord?.isAcknowledge || false;

  const recipients = useMemo(
    () => activeMemo?.recipients || [],
    [activeMemo?.recipients],
  );

  const sortedRecipients = useMemo(() => {
    const list = [...recipients];
    return list.sort((a, b) => {
      if (a.userId === CURRENT_USER_ID) return -1;
      if (b.userId === CURRENT_USER_ID) return 1;
      return 0;
    });
  }, [recipients, CURRENT_USER_ID]);

  useEffect(() => {
    const loadMemo = async () => {
      await fetchMemoById(memoId);
    };
    loadMemo();
  }, [memoId, fetchMemoById]);

  useEffect(() => {
    if (activeMemo && !activeMemo.isRead) {
      markAsRead(memoId);
    }
  }, [activeMemo?.id]);

  const handleAcknowledge = async () => {
    if (isAcknowledged) return;
    setIsAckLoading(true);
    try {
      await acknowledgeMemo(memoId);
      Alert.alert("Success", "Memo acknowledged successfully.", [
        { text: "OK", onPress: () => fetchMemoById(memoId) },
      ]);
    } catch (e) {
      Alert.alert("Error", `Failed to acknowledge memo. ${e}`);
    } finally {
      setIsAckLoading(false);
    }
  };

  const handleDownload = async (
    fileUrl: string,
    fileName: string,
    attachmentId: string,
  ) => {
    setDownloadingId(attachmentId);
    try {
      const fileUri = FileSystem.documentDirectory + fileName;
      const downloadRes = await FileSystem.downloadAsync(fileUrl, fileUri);

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "Sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(downloadRes.uri);
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Could not download file.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading || !activeMemo) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#602AF3" />
      </View>
    );
  }

  const createdTime = formatDateDetail(activeMemo.createdAt);
  const modifiedTime = activeMemo.updatedAt
    ? formatDateDetail(activeMemo.updatedAt)
    : createdTime;

  return (
    <>
      <BreadCrumb
        items={[
          {
            label: "Dashboard",
            onPress: () => navigation.navigate("Dashboard"),
          },
          { label: "Memos", onPress: () => navigation.navigate("Memos") },
          { label: activeMemo.subject as string },
        ]}
      />
      <View className="flex-1 flex-row bg-white">
        <View className="w-72 bg-gray-50 border-r border-gray-200 p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Memos (4)
            </Text>
            <TouchableOpacity>
              <Text className="text-sm text-gray-600 underline">Show All</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2 mb-4">
            <View className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <TextInput
                placeholder="Search..."
                className="text-sm text-gray-600"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TouchableOpacity className="bg-white border border-gray-300 rounded-lg p-2 w-10 items-center justify-center">
              <GearIcon width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-white border border-gray-300 rounded-lg p-2 w-10 items-center justify-center">
              <UploadIcon />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity className="bg-bg-accent rounded-xl p-4 mb-2">
              {/* <Text className="text-sm font-medium text-gray-900">
                Memo xyz
              </Text> */}
            </TouchableOpacity>
            {/* <TouchableOpacity className="p-4 mb-2">
              <Text className="text-sm text-gray-500">Admin Memo</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 mb-2">
              <Text className="text-sm text-gray-500">Meal Planner Memo</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 mb-2">
              <Text className="text-sm text-gray-500">Loading Plan Change</Text>
            </TouchableOpacity> */}
          </ScrollView>
        </View>

        <View className="flex-1">
          <ScrollView className="flex-1">
            <View className="p-8">
              <View className="flex-row items-center justify-end mb-4">
                {activeMemo.priority === 3 && (
                  <View className="bg-yellow-100 px-3 py-1.5 rounded-lg flex-row items-center gap-1.5">
                    <SparkleIcon />
                    <Text className="text-sm font-medium text-yellow-700">
                      Important
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-4xl font-bold text-gray-900 mb-3">
                {activeMemo.subject}
              </Text>

              <View className="flex-row items-center gap-4 mb-8">
                <Text className="text-sm text-gray-500">
                  Created {createdTime}
                </Text>
                <Text className="text-sm text-gray-400">•</Text>
                <Text className="text-sm text-gray-500">
                  Last Modified {modifiedTime}
                </Text>
              </View>
              <View className="mb-8">
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                  Message
                </Text>
                <Text className="text-base text-gray-700 leading-6">
                  {activeMemo.note}
                </Text>
              </View>

              {activeMemo.attachments && activeMemo.attachments.length > 0 && (
                <View>
                  <Text className="text-lg font-semibold text-gray-900 mb-4">
                    Attachments
                  </Text>
                  {activeMemo.attachments.map((attachment) => (
                    <TouchableOpacity
                      key={attachment.id}
                      onPress={() =>
                        handleDownload(
                          attachment.fileUrl,
                          attachment.fileName,
                          attachment.id,
                        )
                      }
                      className="flex-row items-center justify-between p-4 mb-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <Text
                        className="text-base text-gray-700 flex-1"
                        numberOfLines={1}
                      >
                        {attachment.fileName}
                      </Text>
                      {downloadingId === attachment.id ? (
                        <ActivityIndicator color="#602AF3" size="small" />
                      ) : (
                        <Text className="text-gray-400 text-xl ml-2">↗</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        <View className="w-96 bg-white border-l border-gray-200 p-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-lg font-semibold text-gray-900">
              All Users
            </Text>
            <TouchableOpacity>
              <Text className="text-gray-400 text-xl">⋮</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {sortedRecipients.map((item) => {
              const hasAck = item.isAcknowledge;
              const timestamp = item.acknowledgedAt;
              const isCurrentUser = item.userId === CURRENT_USER_ID;

              return (
                <View key={item.userId} className="mb-6">
                  <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3">
                      {item.picture ? (
                        <Text className="text-sm font-bold text-gray-700">
                          {item.firstName.charAt(0)}
                        </Text>
                      ) : (
                        <UserIcon />
                      )}
                    </View>
                    <Text className="text-base font-medium text-gray-900">
                      {item.firstName} {item.lastName}
                      {isCurrentUser ? " (You)" : ""}
                    </Text>
                  </View>

                  {isCurrentUser && !hasAck ? (
                    <TouchableOpacity
                      onPress={handleAcknowledge}
                      disabled={isAckLoading}
                      className="bg-bg-button py-3 rounded-lg flex-row items-center justify-center gap-2"
                    >
                      {isAckLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <>
                          <Text className="text-white font-semibold text-base">
                            Acknowledge
                          </Text>
                          <Text className="text-white text-lg">✓</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  ) : hasAck ? (
                    <View className="flex-row items-center gap-2">
                      <View className="w-5 h-5 bg-bg-button rounded-full items-center justify-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                      <Text className="text-sm text-gray-600">
                        {formatDateDetail(timestamp)}
                      </Text>
                    </View>
                  ) : (
                    <View className="py-3">
                      <Text className="text-sm text-gray-400">
                        Not yet acknowledged
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default MemoDetailScreen;
