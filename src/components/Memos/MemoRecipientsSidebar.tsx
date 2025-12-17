import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UserIcon } from "../../assets/icons";
import { formatDateDetail } from "../../utils/dateFormatter";

// UPDATE HERE: Allow picture to be string OR null
interface Recipient {
  userId: string;
  firstName: string;
  lastName: string;
  picture?: string | null; // <--- Added | null here
  isAcknowledge: boolean;
  acknowledgedAt?: string;
}

interface MemoRecipientsSidebarProps {
  recipients: Recipient[];
  currentUserId: string;
  onAcknowledge: () => void;
  isAckLoading: boolean;
}

export const MemoRecipientsSidebar: React.FC<MemoRecipientsSidebarProps> =
  React.memo(({ recipients, currentUserId, onAcknowledge, isAckLoading }) => {
    return (
      <View className="w-96 bg-white border-l border-gray-200 p-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-lg font-semibold text-gray-900">All Users</Text>
          <TouchableOpacity>
            <Text className="text-gray-400 text-xl">⋮</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {recipients.map((item) => {
            const hasAck = item.isAcknowledge;
            const timestamp = item.acknowledgedAt;
            const isCurrentUser = item.userId === currentUserId;

            return (
              <View key={item.userId} className="mb-6">
                <View className="flex-row items-center mb-1">
                  <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3">
                    {/* The check item.picture handles both null and undefined correctly */}
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
                    onPress={onAcknowledge}
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
                  <View className="flex-row-reverse items-end gap-2">
                    <View className="w-5 h-5 bg-bg-button rounded-full items-center justify-center">
                      <Text className="text-white text-xs">✓</Text>
                    </View>
                    <Text className="text-sm text-gray-600">
                      {timestamp ? formatDateDetail(timestamp) : ""}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-sm text-right text-gray-400">
                    Not yet acknowledged
                  </Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  });

MemoRecipientsSidebar.displayName = "MemoRecipientsSidebar";
