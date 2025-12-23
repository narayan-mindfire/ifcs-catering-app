import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { useDeliveryStore } from "../../store/useDeliveryStore";

const DispatcherCommentsTab: React.FC = () => {
  const route = useRoute<any>();
  const flightId = route.params?.flightId || "test-flight-id";

  const { deliveries, selectedDeliveryId, updateDelivery } = useDeliveryStore();

  const selectedDelivery = deliveries.find((d) => d.id === selectedDeliveryId);

  const [localComment, setLocalComment] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state when delivery changes
  useEffect(() => {
    if (selectedDelivery) {
      setLocalComment(selectedDelivery.dispatcherComment || "");
      setHasChanges(false);
    } else {
      setLocalComment("");
      setHasChanges(false);
    }
  }, [selectedDelivery]);

  const handleCommentChange = (text: string) => {
    setLocalComment(text);
    setHasChanges(text !== (selectedDelivery?.dispatcherComment || ""));
  };

  const handleSave = () => {
    if (!selectedDeliveryId) return;

    updateDelivery(flightId, selectedDeliveryId, {
      dispatcherComment: localComment,
    });

    setHasChanges(false);
  };

  const handleCancel = () => {
    setLocalComment(selectedDelivery?.dispatcherComment || "");
    setHasChanges(false);
  };

  return (
    <ScrollView className="flex-1">
      <View className="bg-bg-surface rounded-2xl border border-border-muted p-4">
        <Text className="text-lg font-semibold text-text-primary mb-4">
          Dispatcher Comments
        </Text>

        <Text className="text-base text-text-secondary mb-2">
          Add comments or notes about this delivery
        </Text>

        <TextInput
          className="border border-border-muted rounded-xl p-3 text-base text-text-primary bg-bg-surface min-h-[200px]"
          style={{ textAlignVertical: "top" }}
          value={localComment}
          onChangeText={handleCommentChange}
          placeholder="Enter dispatcher comments here..."
          placeholderTextColor="#A09CAB"
          multiline
          numberOfLines={10}
        />

        {hasChanges && (
          <View className="flex-row gap-3 mt-4">
            <Pressable
              onPress={handleCancel}
              className="flex-1 py-3 rounded-lg border border-border-secondary items-center"
            >
              <Text className="text-text-secondary font-semibold text-base">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              className="flex-1 py-3 rounded-lg bg-bg-button items-center"
            >
              <Text className="text-text-surface font-semibold text-base">
                Save Changes
              </Text>
            </Pressable>
          </View>
        )}

        {!hasChanges && selectedDelivery?.dispatcherComment && (
          <View className="mt-4 p-3 bg-bg-accent rounded-lg">
            <Text className="text-sm text-text-secondary">
              ✓ Comments saved
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DispatcherCommentsTab;
