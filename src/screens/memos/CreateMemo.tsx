import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";

type Props = StackScreenProps<RootStackParamList, "CreateMemo">;

const AVAILABLE_USERS = [
  { id: "1", name: "Captain Sarah Jenkins", role: "Pilot" },
  { id: "2", name: "Mike Ross", role: "Co-Pilot" },
  { id: "3", name: "Rachel Zane", role: "Cabin Crew" },
  { id: "4", name: "Harvey Specter", role: "Ground Staff" },
  { id: "5", name: "Louis Litt", role: "Maintenance" },
  { id: "6", name: "Donna Paulsen", role: "Admin" },
];

const CreateMemoScreen = ({ route, navigation }: Props) => {
  const [flight, setFlight] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isPriority, setIsPriority] = useState(false);

  // 3. New State for Modal and Selection
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Helper to get comma-separated names for the text input
  const displaySelectedUsers = useMemo(() => {
    return AVAILABLE_USERS.filter((user) => selectedUserIds.includes(user.id))
      .map((user) => user.name)
      .join(", ");
  }, [selectedUserIds]);

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((userId) => userId !== id); // Remove
      } else {
        return [...prev, id]; // Add
      }
    });
  };

  const handleSubmit = () => {
    console.log("Submitting memo:", {
      flight,
      subject,
      message,
      assignedUsers: selectedUserIds, // Sending IDs usually better for backend
      isPriority,
    });
    navigation.goBack();
  };

  const handleSaveDraft = () => {
    console.log("Saving as draft");
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-bg-quaternary">
      {/* Header */}
      <View className="bg-bg-surface px-5 py-4 border-b border-border-muted">
        <TouchableOpacity onPress={handleCancel} className="mb-4">
          <Text className="text-2xl text-text-secondary">←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-bg-surface m-4 rounded-lg border border-border-muted p-5">
          {/* Title */}
          <View className="bg-bg-accent py-3 px-4 rounded-lg mb-6 -mx-5 -mt-5">
            <Text className="text-xl font-semibold text-text-primary text-center">
              Add Memo
            </Text>
          </View>

          {/* Flight (Optional) */}
          <View className="mb-5">
            <Text className="text-text-primary font-semibold mb-2">
              Flight (Optional)
            </Text>
            <TextInput
              value={flight}
              onChangeText={setFlight}
              placeholder=""
              placeholderTextColor="#A09CAB"
              className="bg-bg-tertiary border border-border-muted rounded-lg px-4 py-3 text-text-primary"
            />
          </View>

          {/* Subject */}
          <View className="mb-5">
            <Text className="text-text-primary font-semibold mb-2">
              Subject
            </Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="Enter Subject"
              placeholderTextColor="#A09CAB"
              className="bg-bg-tertiary border border-border-muted rounded-lg px-4 py-3 text-text-primary"
            />
          </View>

          {/* Message */}
          <View className="mb-5">
            <Text className="text-text-primary font-semibold mb-2">
              Message
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Enter Message"
              placeholderTextColor="#A09CAB"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              className="bg-bg-tertiary border border-border-muted rounded-lg px-4 py-3 text-text-primary min-h-[160px]"
            />
          </View>

          {/* Users Assigned This Memo */}
          <View className="mb-5">
            <Text className="text-text-primary font-semibold mb-2">
              Users Assigned This Memo
            </Text>
            <View className="bg-bg-tertiary border border-border-muted rounded-lg px-4 py-3 min-h-[80px]">
              <Text
                className={
                  displaySelectedUsers ? "text-text-primary" : "text-[#A09CAB]"
                }
              >
                {displaySelectedUsers || "No users assigned yet"}
              </Text>
            </View>
            <TouchableOpacity
              className="mt-3"
              onPress={() => setIsModalVisible(true)}
            >
              <Text className="text-bg-button font-medium text-base">
                Assign Users
              </Text>
            </TouchableOpacity>
          </View>

          {/* Set as Priority */}
          <View className="mb-5">
            <TouchableOpacity
              onPress={() => setIsPriority(!isPriority)}
              className="flex-row items-center"
            >
              <View
                className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                  isPriority
                    ? "bg-bg-button border-bg-button"
                    : "border-border-secondary"
                }`}
              >
                {isPriority && (
                  <Text className="text-text-surface text-xs font-bold">✓</Text>
                )}
              </View>
              <Text className="text-text-primary text-base">
                Set as Priority
              </Text>
            </TouchableOpacity>
          </View>

          {/* Attachments */}
          <View className="mb-6">
            <Text className="text-text-primary font-semibold mb-2">
              Attachments
            </Text>
            <TouchableOpacity className="bg-bg-secondary border border-border-muted rounded-lg px-4 py-3">
              <Text className="text-text-tertiary text-base">Choose File</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-2">
            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-1 bg-bg-button rounded-lg py-3 items-center"
            >
              <Text className="text-text-surface font-semibold text-base">
                Submit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSaveDraft}
              className="flex-1 bg-text-tertiary rounded-lg py-3 items-center"
            >
              <Text className="text-text-surface font-semibold text-base">
                Save as Draft
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCancel}
              className="flex-1 bg-bg-accent rounded-lg py-3 items-center"
            >
              <Text className="text-text-primary font-semibold text-base">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ================= USER SELECTION MODAL ================= */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-bg-surface w-full max-w-sm rounded-xl p-5 shadow-lg max-h-[80%]">
            <Text className="text-xl font-bold text-text-primary mb-4 text-center">
              Select Users
            </Text>

            <FlatList
              data={AVAILABLE_USERS}
              keyExtractor={(item) => item.id}
              className="mb-4"
              renderItem={({ item }) => {
                const isSelected = selectedUserIds.includes(item.id);
                return (
                  <TouchableOpacity
                    onPress={() => toggleUserSelection(item.id)}
                    className={`flex-row items-center justify-between p-3 mb-2 rounded-lg border ${
                      isSelected
                        ? "bg-bg-tertiary border-bg-button"
                        : "bg-bg-surface border-border-muted"
                    }`}
                  >
                    <View>
                      <Text className="text-text-primary font-medium text-base">
                        {item.name}
                      </Text>
                      <Text className="text-text-tertiary text-xs">
                        {item.role}
                      </Text>
                    </View>
                    <View
                      className={`w-5 h-5 rounded-full border items-center justify-center ${
                        isSelected
                          ? "bg-bg-button border-bg-button"
                          : "border-text-tertiary"
                      }`}
                    >
                      {isSelected && (
                        <Text className="text-white text-xs">✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              className="bg-bg-button py-3 rounded-lg items-center"
            >
              <Text className="text-text-surface font-bold text-base">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateMemoScreen;
