import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";
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
  const { memoId, flightId } = route.params;
  const memoData = {
    id: memoId,
    subject: "Flight Safety Protocol Update",
    sender: "Shitanshu",
    date: "Nov 24, 2025",
    time: "10:30 AM",
    priority: "High",
    status: "Unread",
    content: `Dear Team,

This memo is to inform you about the updated safety protocols that will be effective from December 1st, 2025.

Key Changes:
1. Enhanced pre-flight checklist procedures
2. New communication protocols during emergencies
3. Updated weather assessment guidelines
4. Additional crew training requirements

Please review the attached documents and acknowledge receipt of this memo by November 30th, 2025.

If you have any questions or concerns, please don't hesitate to reach out.

Best regards,
Shitanshu
Flight Operations Manager`,
    attachments: [
      { id: "1", name: "Safety_Protocol_Update.pdf", size: "2.4 MB" },
      { id: "2", name: "Training_Schedule.xlsx", size: "156 KB" },
    ],
  };

  const breadcrumbItems = [
    {
      label: "Dashboard",
      onPress: () => navigation.navigate("Dashboard"),
    },
    {
      label: "Memos",
      onPress: () => navigation.navigate("Memos", { flightId }),
    },
    {
      label: "Memo Details",
    },
  ];

  return (
    <View className="flex-1 bg-bg-quaternary">
      <BreadCrumb items={breadcrumbItems} />

      <ScrollView className="flex-1">
        <View className="p-5">
          <View className="bg-bg-surface rounded-lg p-5 mb-4 border border-border-muted">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-text-primary mb-2">
                  {memoData.subject}
                </Text>
                <View className="flex-row items-center gap-2 flex-wrap">
                  <View className="bg-bg-accent px-3 py-1 rounded-full">
                    <Text className="text-sm font-medium text-bg-button">
                      {memoData.priority} Priority
                    </Text>
                  </View>
                  <View className="bg-bg-tertiary px-3 py-1 rounded-full">
                    <Text className="text-sm text-text-secondary">
                      {memoData.status}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity className="ml-4">
                <Text className="text-2xl">⭐</Text>
              </TouchableOpacity>
            </View>

            <View className="border-t border-border-muted pt-4 mb-4">
              <View className="flex-row items-center mb-2">
                <Text className="text-text-tertiary text-sm font-medium w-20">
                  From:
                </Text>
                <Text className="text-text-primary text-base font-semibold">
                  {memoData.sender}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-text-tertiary text-sm font-medium w-20">
                  Date:
                </Text>
                <Text className="text-text-secondary text-base">
                  {memoData.date} at {memoData.time}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-bg-button py-3 rounded-lg items-center">
                <Text className="text-text-surface font-semibold text-base">
                  Acknowledge
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 border border-border-secondary py-3 rounded-lg items-center">
                <Text className="text-text-secondary font-semibold text-base">
                  Reply
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 border border-border-secondary py-3 rounded-lg items-center">
                <Text className="text-text-secondary font-semibold text-base">
                  Forward
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-bg-surface rounded-lg p-5 mb-4 border border-border-muted">
            <Text className="text-lg font-bold text-text-primary mb-4">
              Message Content
            </Text>
            <Text className="text-base text-text-secondary leading-6">
              {memoData.content}
            </Text>
          </View>

          {memoData.attachments.length > 0 && (
            <View className="bg-bg-surface rounded-lg p-5 border border-border-muted">
              <Text className="text-lg font-bold text-text-primary mb-4">
                Attachments ({memoData.attachments.length})
              </Text>
              {memoData.attachments.map((attachment) => (
                <TouchableOpacity
                  key={attachment.id}
                  className="flex-row items-center justify-between p-3 mb-2 bg-bg-tertiary rounded-lg border border-border-muted"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-bg-accent rounded items-center justify-center mr-3">
                      <Text className="text-lg">📎</Text>
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
