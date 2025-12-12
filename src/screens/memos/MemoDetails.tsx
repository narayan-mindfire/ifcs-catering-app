import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { RootStackParamList } from "../../../App";
import { BreadCrumb } from "../../components/common/BreadCrumbs";
import { useMemoStore } from "../../store/useMemosStore";
import { StarIcon, UserIcon } from "../../assets/icons";
import { formatDateDetail } from "../../utils/dateFormatter";

// --- Types ---
type MemoDetailScreenRouteProp = RouteProp<RootStackParamList, "MemoDetail">;
type MemoDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MemoDetail"
>;

interface Props {
  route: MemoDetailScreenRouteProp;
  navigation: MemoDetailScreenNavigationProp;
}

const getPriorityLabel = (p: number) => {
  if (p === 3) return "High";
  if (p === 2) return "Medium";
  return "Low";
};

const getPriorityColor = (p: number) => {
  if (p === 3) return "bg-red-100 text-red-700";
  if (p === 2) return "bg-orange-100 text-orange-700";
  return "bg-blue-100 text-blue-700";
};

// ------------------------------------------------------
// MAIN SCREEN
// ------------------------------------------------------
const MemoDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { memoId } = route.params;
  const { activeMemo, isLoading, fetchMemoById, acknowledgeMemo, markAsRead } =
    useMemoStore();

  const [isRecipientModalVisible, setRecipientModalVisible] = useState(false);
  const [isAckLoading, setIsAckLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const CURRENT_USER_ID = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";

  // Find current user's record
  const currentUserRecipientRecord = activeMemo?.recipients?.find(
    (r: { userId: string; isAcknowledge: boolean }) =>
      r.userId === CURRENT_USER_ID,
  );

  const isAcknowledged = currentUserRecipientRecord?.isAcknowledge || false;

  const userAcknowledgementTime =
    currentUserRecipientRecord?.acknowledgedAt || null;

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

  const visibleRecipients = recipients.slice(0, 5);
  const remainingCount = recipients.length - 5;

  // Fetch memo and mark as read when component mounts
  useEffect(() => {
    const loadMemo = async () => {
      await fetchMemoById(memoId);
    };
    loadMemo();
  }, [memoId, fetchMemoById]);

  // Mark as read after memo is loaded (only if it's unread)
  useEffect(() => {
    if (activeMemo && !activeMemo.isRead) {
      markAsRead(memoId);
    }
  }, [activeMemo?.id]); // Only run when activeMemo.id changes

  // --- Handlers ---

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
      <View className="flex-1 bg-bg-quaternary justify-center items-center">
        <ActivityIndicator size="large" color="#602AF3" />
      </View>
    );
  }

  const senderName = activeMemo.sender
    ? `${activeMemo.sender.firstName} ${activeMemo.sender.lastName}`
    : "Unknown";
  const priorityLabel = getPriorityLabel(activeMemo.priority);
  const priorityStyle = getPriorityColor(activeMemo.priority);
  const [bgClass, textClass] = priorityStyle.split(" ");

  return (
    <View className="flex-1 bg-bg-quaternary">
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

      <ScrollView className="flex-1">
        <Pressable className="p-5" onPress={() => {}}>
          <View className="bg-bg-surface rounded-lg p-5 mb-4 border border-border-muted">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-row items-center flex-1">
                <Text className="text-3xl font-bold text-text-primary mr-2">
                  {activeMemo.subject}
                </Text>
                {activeMemo.priority === 3 && (
                  <View className="opacity-100">
                    <StarIcon />
                  </View>
                )}
              </View>

              <View className="ml-4 items-end">
                {!isAcknowledged ? (
                  <TouchableOpacity
                    onPress={handleAcknowledge}
                    disabled={isAckLoading}
                    className="px-6 py-2 rounded-lg bg-bg-button"
                  >
                    {isAckLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text className="text-text-surface font-semibold text-base">
                        Acknowledge
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View className="items-end">
                    <View className="px-6 py-2 rounded-lg bg-bg-tertiary border border-border-muted">
                      <Text className="text-text-tertiary font-semibold text-base">
                        Acknowledged
                      </Text>
                    </View>
                    {userAcknowledgementTime && (
                      <Text className="text-xs text-text-tertiary mt-1.5 font-medium">
                        On {formatDateDetail(userAcknowledgementTime)}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* Tags */}
            <View className="flex-row items-center gap-2 flex-wrap mb-4">
              <View className={`px-3 py-1 rounded-full ${bgClass}`}>
                <Text className={`text-sm font-medium ${textClass}`}>
                  {priorityLabel} Priority
                </Text>
              </View>
            </View>

            <View className="border-t border-border-muted pt-4 mb-4">
              <View className="flex-row items-center mb-2">
                <Text className="text-text-tertiary text-base font-medium w-20">
                  From:
                </Text>
                <Text className="text-text-primary text-lg font-semibold">
                  {senderName}
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Text className="text-text-tertiary text-base font-medium w-20">
                  Date:
                </Text>
                <Text className="text-text-secondary text-lg">
                  {formatDateDetail(activeMemo.createdAt)}
                </Text>
              </View>

              {/* ------------------------------------------------ */}
              {/* ASSIGNED USERS (Triggers Modal)                  */}
              {/* ------------------------------------------------ */}
              <View className="flex-row items-center mt-2">
                <Text className="text-text-tertiary text-base font-medium w-32">
                  Assigned users:
                </Text>

                <TouchableOpacity
                  onPress={() => setRecipientModalVisible(true)}
                  className="flex-row items-center relative active:opacity-70"
                >
                  {visibleRecipients.map((rec, index) => (
                    <View
                      key={rec.userId || index}
                      style={{
                        marginLeft: index > 0 ? -12 : 0,
                        zIndex: 10 - index,
                      }}
                      className="w-9 h-9 rounded-full bg-bg-accent border-2 border-bg-surface flex items-center justify-center overflow-hidden"
                    >
                      {rec.picture ? (
                        <Text className="text-xs font-bold text-text-primary">
                          {rec.firstName.charAt(0)}
                        </Text>
                      ) : (
                        <UserIcon />
                      )}
                    </View>
                  ))}

                  {remainingCount > 0 && (
                    <View
                      className="w-9 h-9 rounded-full bg-bg-tertiary border-2 border-bg-surface flex items-center justify-center"
                      style={{ marginLeft: -12, zIndex: 0 }}
                    >
                      <Text className="text-xs text-text-secondary font-bold">
                        +{remainingCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* --- Content Card --- */}
          <View className="bg-bg-surface rounded-lg p-5 mb-4 border border-border-muted min-h-[200px]">
            <Text className="text-xl font-bold text-text-primary mb-4">
              Message Content
            </Text>
            <Text className="text-lg text-text-secondary leading-6">
              {activeMemo.note}
            </Text>
          </View>

          {/* --- Attachments Card --- */}
          {activeMemo.attachments && activeMemo.attachments.length > 0 && (
            <View className="bg-bg-surface rounded-lg p-5 border border-border-muted">
              <Text className="text-xl font-bold text-text-primary mb-4">
                Attachments ({activeMemo.attachments.length})
              </Text>
              {activeMemo.attachments.map((attachment) => (
                <View
                  key={attachment.id}
                  className="flex-row items-center justify-between p-3 mb-2 bg-bg-tertiary rounded-lg border border-border-muted"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-bg-accent rounded items-center justify-center mr-3">
                      <Text className="text-xl">📎</Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-lg font-medium text-text-primary"
                        numberOfLines={1}
                      >
                        {attachment.fileName}
                      </Text>
                      <Text className="text-sm text-text-tertiary">
                        {(parseInt(attachment.fileSize) / 1024).toFixed(1)} KB
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      handleDownload(
                        attachment.fileUrl,
                        attachment.fileName,
                        attachment.id,
                      )
                    }
                    disabled={downloadingId === attachment.id}
                    className="bg-bg-button px-4 py-2 rounded-lg ml-2 min-w-[100px] items-center"
                  >
                    {downloadingId === attachment.id ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text className="text-text-surface font-medium text-sm">
                        Download
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </Pressable>
      </ScrollView>

      {/* ------------------------------------------------ */}
      {/* RECIPIENT LIST MODAL                             */}
      {/* ------------------------------------------------ */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isRecipientModalVisible}
        onRequestClose={() => setRecipientModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setRecipientModalVisible(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-5">
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="bg-bg-surface w-full max-h-[80%] rounded-2xl p-5 shadow-xl">
                {/* Modal Header */}
                <View className="flex-row justify-between items-center mb-4 border-b border-border-muted pb-4">
                  <Text className="text-xl font-bold text-text-primary">
                    Assigned Users ({recipients.length})
                  </Text>
                  <TouchableOpacity
                    onPress={() => setRecipientModalVisible(false)}
                    className="p-2 bg-bg-tertiary rounded-full"
                  >
                    <Text className="text-text-secondary font-bold text-xs">
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Recipient List */}
                <FlatList
                  data={sortedRecipients}
                  keyExtractor={(item) => item.userId}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const hasAck = item.isAcknowledge;
                    const timestamp = item.acknowledgedAt;
                    const isCurrentUser = item.userId === CURRENT_USER_ID;

                    return (
                      <View className="flex-row items-center py-3 border-b border-border-muted">
                        {/* Avatar */}
                        <View className="w-10 h-10 rounded-full bg-bg-accent items-center justify-center mr-3">
                          {item.picture ? (
                            <Text className="text-sm font-bold text-text-primary">
                              {item.firstName.charAt(0)}
                            </Text>
                          ) : (
                            <UserIcon />
                          )}
                        </View>

                        {/* Details */}
                        <View className="flex-1">
                          <Text className="text-base font-bold text-text-primary">
                            {item.firstName} {item.lastName}{" "}
                            {isCurrentUser ? "(You)" : ""}
                          </Text>
                          <Text
                            className={`text-sm mt-0.5 ${
                              hasAck
                                ? "text-green-600 font-medium"
                                : "text-amber-600"
                            }`}
                          >
                            {hasAck
                              ? `Acknowledged: ${formatDateDetail(timestamp)}`
                              : "Not yet acknowledged"}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default MemoDetailScreen;
