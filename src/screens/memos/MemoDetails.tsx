import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { DocsIconDark, SparkleIcon, UserIcon } from "../../assets/icons";
import { BreadCrumb } from "../../components/common/BreadCrumbs";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuthStore } from "../../store/useAuthStore";
import { useMemoStore } from "../../store/useMemosStore";
import { MemoVersion } from "../../types/memo";
import { formatDateDetail } from "../../utils/dateFormatter";
import { log } from "../../utils/logger";

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
  const { width } = useWindowDimensions();
  // Breakpoint for iPad Portrait (usually < 840px depending on model)
  const isPortrait = width < 1000;

  const { memoId } = route.params;
  const { activeMemo, isLoading, fetchMemoById, acknowledgeMemo, markAsRead } =
    useMemoStore();

  const [isAckLoading, setIsAckLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Modal states for Portrait mode
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false);
  const [isRecipientsModalOpen, setIsRecipientsModalOpen] = useState(false);

  const { userId } = useAuthStore();
  const currentUserRecipientRecord = activeMemo?.recipients?.find(
    (r: { userId: string; isAcknowledge: boolean }) => r.userId === userId,
  );

  const isRead = currentUserRecipientRecord?.isRead ?? true;
  const isAcknowledged = currentUserRecipientRecord?.isAcknowledge || false;

  const recipients = useMemo(
    () => activeMemo?.recipients || [],
    [activeMemo?.recipients],
  );

  const sortedRecipients = useMemo(() => {
    const list = [...recipients];
    return list.sort((a, b) => {
      if (a.userId === userId) return -1;
      if (b.userId === userId) return 1;
      return 0;
    });
  }, [recipients, userId]);

  log.info("Active Memo Versions:", activeMemo?.versions);
  const hasVersions = activeMemo?.versions && activeMemo.versions.length > 0;

  const sortedVersions = useMemo(() => {
    if (!activeMemo?.versions) return [];
    return [...activeMemo.versions].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [activeMemo?.versions]);

  useEffect(() => {
    const loadMemo = async () => {
      await fetchMemoById(userId, memoId);
    };
    loadMemo();
  }, [memoId, fetchMemoById, userId]);

  useEffect(() => {
    if (activeMemo && !isLoading && isRead === false) {
      log.info("Marking memo as read:", activeMemo.id);
      markAsRead(userId, activeMemo.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMemo?.id, isRead, isLoading, markAsRead]);

  const handleAcknowledge = async () => {
    if (isAcknowledged || !activeMemo) return;
    setIsAckLoading(true);
    try {
      await acknowledgeMemo(userId, activeMemo.id);
      Alert.alert("Success", "Memo acknowledged successfully.", [
        {
          text: "OK",
          onPress: () => fetchMemoById(userId, activeMemo.id),
        },
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
      log.error("Download error:", error);
      Alert.alert("Error", "Could not download file.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleVersionClick = (versionId: string) => {
    if (versionId === activeMemo?.id) return;
    fetchMemoById(userId, versionId);
    if (isPortrait) setIsVersionsModalOpen(false);
  };

  // --- Render Helpers to reuse code between Sidebar and Modal ---

  const renderVersionsList = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {sortedVersions.map((ver: MemoVersion) => {
        const isSelected = ver.id === activeMemo?.id;
        return (
          <TouchableOpacity
            key={ver.id}
            onPress={() => handleVersionClick(ver.id)}
            className={`mb-2 p-3 rounded-xl border ${
              isSelected
                ? "bg-bg-accent border-bg-button/30"
                : "bg-white border-gray-200"
            }`}
          >
            <View className="flex-row items-center justify-between mb-1">
              <Text
                className={`font-semibold ${
                  isSelected ? "text-bg-button" : "text-gray-700"
                }`}
              >
                Version {ver.version}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">
              {formatDateDetail(ver.createdAt)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderRecipientsList = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {sortedRecipients.map((item) => {
        const hasAck = item.isAcknowledge;
        const timestamp = item.acknowledgedAt;
        const isCurrentUser = item.userId === userId;

        return (
          <View key={item.userId} className="mb-6">
            <View className="flex-row items-center mb-1">
              <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3">
                {item.picture ? (
                  <Text className="text-sm font-bold text-gray-700">
                    {item.firstName.charAt(0)}
                  </Text>
                ) : (
                  <UserIcon />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  {item.firstName} {item.lastName}
                </Text>
                {isCurrentUser && (
                  <Text className="text-xs text-bg-button font-medium">
                    You
                  </Text>
                )}
              </View>
            </View>

            {isCurrentUser && !hasAck ? (
              <TouchableOpacity
                onPress={handleAcknowledge}
                disabled={isAckLoading}
                className="bg-bg-button py-3 rounded-lg flex-row items-center justify-center gap-2 mt-2"
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
              <View className="flex-row items-center gap-2 mt-1 ml-11">
                <View className="w-4 h-4 bg-green-100 rounded-full items-center justify-center border border-green-200">
                  <Text className="text-green-700 text-[10px]">✓</Text>
                </View>
                <Text className="text-xs text-gray-500">
                  Acknowledged on {formatDateDetail(timestamp)}
                </Text>
              </View>
            ) : (
              <Text className="text-xs text-gray-400 ml-11 mt-1">
                Pending acknowledgement
              </Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );

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
        {!isPortrait && hasVersions && (
          <View className="w-72 bg-gray-50 border-r border-gray-200 p-4">
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Version History
              </Text>
            </View>
            {renderVersionsList()}
          </View>
        )}

        <View className="flex-1">
          <ScrollView className="flex-1">
            <View className="p-8">
              {isPortrait && (
                <View className="flex-row gap-3 mb-6">
                  {hasVersions && (
                    <TouchableOpacity
                      onPress={() => setIsVersionsModalOpen(true)}
                      className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200"
                    >
                      <Text className="text-gray-700 font-medium">
                        History ({sortedVersions.length})
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => setIsRecipientsModalOpen(true)}
                    className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200"
                  >
                    <Text className="text-gray-700 font-medium">
                      Recipients ({sortedRecipients.length})
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  {activeMemo.version && (
                    <View className="bg-gray-100 px-2 py-1 rounded border border-gray-200">
                      <Text className="text-xs font-semibold text-gray-600">
                        v{activeMemo.version}
                      </Text>
                    </View>
                  )}
                </View>

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

              {activeMemo.memoHeaders && activeMemo.memoHeaders.length > 0 && (
                <View className="mb-6 gap-2">
                  {activeMemo.memoHeaders.map((header, index) => (
                    <View
                      key={index}
                      className="border border-bg-button p-3 rounded-lg"
                    >
                      <Text className="text-bg-button bg-bg-accent font-medium text-base">
                        {header}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View className="mb-8">
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                  Message
                </Text>
                <View className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <Text className="text-base text-gray-700 leading-7">
                    {activeMemo.note}
                  </Text>
                </View>
              </View>

              {/* Attachments */}
              {activeMemo.attachments && activeMemo.attachments.length > 0 && (
                <View>
                  <Text className="text-lg font-semibold text-gray-900 mb-4">
                    Attachments ({activeMemo.attachments.length})
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
                      className="flex-row items-center justify-between p-4 mb-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      <View className="flex-row items-center flex-1 gap-3">
                        <View className="bg-gray-100 p-2 rounded-lg">
                          <DocsIconDark width={20} height={20} />
                        </View>
                        <Text
                          className="text-base text-gray-700 flex-1 font-medium"
                          numberOfLines={1}
                        >
                          {attachment.fileName}
                        </Text>
                      </View>

                      {downloadingId === attachment.id ? (
                        <ActivityIndicator color="#602AF3" size="small" />
                      ) : (
                        <Text className="text-gray-400 text-sm ml-2 font-semibold">
                          Download ↗
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {/* RIGHT SIDEBAR - Only show if not portrait */}
        {!isPortrait && (
          <View className="w-96 bg-white border-l border-gray-200 p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-semibold text-gray-900">
                Recipients ({sortedRecipients.length})
              </Text>
            </View>
            {renderRecipientsList()}
          </View>
        )}
      </View>

      {/* --- MODALS FOR PORTRAIT MODE --- */}

      {/* Version History Modal */}
      <Modal
        visible={isVersionsModalOpen}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setIsVersionsModalOpen(false)}
      >
        <View className="flex-1 bg-gray-50 p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-900">
              Version History
            </Text>
            <TouchableOpacity onPress={() => setIsVersionsModalOpen(false)}>
              <Text className="text-bg-button font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
          {renderVersionsList()}
        </View>
      </Modal>

      {/* Recipients Modal */}
      <Modal
        visible={isRecipientsModalOpen}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setIsRecipientsModalOpen(false)}
      >
        <View className="flex-1 bg-white p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-900">
              Recipients ({sortedRecipients.length})
            </Text>
            <TouchableOpacity onPress={() => setIsRecipientsModalOpen(false)}>
              <Text className="text-bg-button font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
          {renderRecipientsList()}
        </View>
      </Modal>
    </>
  );
};

export default MemoDetailScreen;
