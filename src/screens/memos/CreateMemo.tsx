import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";
import { useMemoStore } from "../../store/useMemosStore";
import { Memo } from "../../types/memo";

type Props = StackScreenProps<RootStackParamList, "CreateMemo">;

// Mock Users available for selection
const AVAILABLE_USERS = [
  { id: "1", name: "Captain Sarah Jenkins", role: "Pilot" },
  { id: "2", name: "Mike Ross", role: "Co-Pilot" },
  { id: "3", name: "Rachel Zane", role: "Cabin Crew" },
  { id: "4", name: "Harvey Specter", role: "Ground Staff" },
  { id: "5", name: "Louis Litt", role: "Maintenance" },
];

const CreateMemoScreen = ({ route, navigation }: Props) => {
  const { addMemo } = useMemoStore();

  const [flight, setFlight] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isPriority, setIsPriority] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const displaySelectedUsers = useMemo(() => {
    return AVAILABLE_USERS.filter((user) => selectedUserIds.includes(user.id))
      .map((user) => user.name)
      .join(", ");
  }, [selectedUserIds]);

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    if (!subject || !message) {
      Alert.alert("Error", "Please enter subject and message");
      return;
    }

    const newId = Date.now().toString();
    const selectedUsers = AVAILABLE_USERS.filter((u) =>
      selectedUserIds.includes(u.id),
    );

    // Construct the new Memo Object
    const newMemo: Memo = {
      id: newId,
      sender: { id: "me", name: "Shitanshu", role: "Engineer" }, // Current User
      recipients: selectedUsers,
      flightNumber: flight || undefined,
      subject: subject,
      content: message,
      priority: isPriority ? "High" : "Medium",
      isRead: true, // You read your own memo
      isImportant: false,
      isDraft: false,
      isAcknowledged: false,
      requiresAcknowledgement: true,
      createdAt: new Date().toISOString(),
      attachments: [],
    };

    // Save to store
    addMemo(newMemo);

    // Navigate to Details to show what we created
    navigation.replace("MemoDetail", {
      memoId: newId,
    });
  };

  return (
    <View className="flex-1 bg-bg-quaternary">
      {/* Header */}
      <View className="bg-bg-surface px-5 py-4 border-b border-border-muted">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
          <Text className="text-2xl text-text-secondary">←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-bg-surface m-4 rounded-lg border border-border-muted p-5">
          <View className="bg-bg-accent py-3 px-4 rounded-lg mb-6 -mx-5 -mt-5">
            <Text className="text-xl font-semibold text-text-primary text-center">
              Add Memo
            </Text>
          </View>

          <View className="mb-5">
            <Text className="text-text-primary font-semibold mb-2">
              Flight (Optional)
            </Text>
            <TextInput
              value={flight}
              onChangeText={setFlight}
              placeholder="e.g. AI-302"
              placeholderTextColor="#A09CAB"
              className="bg-bg-tertiary border border-border-muted rounded-lg px-4 py-3 text-text-primary"
            />
          </View>

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

          <View className="mb-5">
            <Text className="text-text-primary font-semibold mb-2">
              Users Assigned
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              className="bg-bg-tertiary border border-border-muted rounded-lg px-4 py-3 min-h-[50px] justify-center"
            >
              <Text
                className={
                  displaySelectedUsers ? "text-text-primary" : "text-[#A09CAB]"
                }
              >
                {displaySelectedUsers || "Select users..."}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-5">
            <TouchableOpacity
              onPress={() => setIsPriority(!isPriority)}
              className="flex-row items-center"
            >
              <View
                className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${isPriority ? "bg-bg-button border-bg-button" : "border-border-secondary"}`}
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

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-bg-button rounded-lg py-3 items-center mt-2"
          >
            <Text className="text-text-surface font-semibold text-base">
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Code remains same as previous steps... */}
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
                    className={`flex-row items-center justify-between p-3 mb-2 rounded-lg border ${isSelected ? "bg-bg-tertiary border-bg-button" : "bg-bg-surface border-border-muted"}`}
                  >
                    <Text className="text-text-primary font-medium">
                      {item.name}
                    </Text>
                    {isSelected && <Text className="text-bg-button">✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              className="bg-bg-button py-3 rounded-lg items-center"
            >
              <Text className="text-text-surface font-bold">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default CreateMemoScreen;
