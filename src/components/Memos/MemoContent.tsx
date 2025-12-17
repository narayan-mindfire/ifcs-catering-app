import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SparkleIcon } from "../../assets/icons";
import { formatDateDetail } from "../../utils/dateFormatter";
import { Memo } from "../../types/memo";

interface MemoContentProps {
  memo: Memo;
  onDownload: (fileUrl: string, fileName: string, attachmentId: string) => void;
  downloadingId: string | null;
}

export const MemoContent: React.FC<MemoContentProps> = React.memo(
  ({ memo, onDownload, downloadingId }) => {
    const createdTime = formatDateDetail(memo.createdAt);
    const modifiedTime = memo.updatedAt
      ? formatDateDetail(memo.updatedAt)
      : createdTime;

    return (
      <View className="flex-1">
        <ScrollView className="flex-1">
          <View className="p-8">
            <View className="flex-row items-center justify-end mb-4">
              {memo.priority === 3 && (
                <View className="bg-yellow-100 px-3 py-1.5 rounded-lg flex-row items-center gap-1.5">
                  <SparkleIcon />
                  <Text className="text-sm font-medium text-yellow-700">
                    Important
                  </Text>
                </View>
              )}
            </View>

            <Text className="text-4xl font-bold text-gray-900 mb-3">
              {memo.subject}
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
                {memo.note}
              </Text>
            </View>

            {memo.attachments && memo.attachments.length > 0 && (
              <View>
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                  Attachments
                </Text>
                {memo.attachments.map((attachment) => (
                  <TouchableOpacity
                    key={attachment.id}
                    onPress={() =>
                      onDownload(
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
    );
  },
);
MemoContent.displayName = "MemoContent";
