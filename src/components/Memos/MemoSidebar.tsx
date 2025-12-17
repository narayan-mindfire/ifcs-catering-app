import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GearIcon, UploadIcon } from "../../assets/icons";

export const MemoVersionSidebar: React.FC = React.memo(() => {
  return (
    <View className="w-72 bg-gray-50 border-r border-gray-200 p-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900">Memos (4)</Text>
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
        <TouchableOpacity className="bg-bg-accent rounded-xl p-4 mb-2" />
      </ScrollView>
    </View>
  );
});

MemoVersionSidebar.displayName = "MemoVersionSidebar";
