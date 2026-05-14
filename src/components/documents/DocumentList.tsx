import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { FilterIcon } from "@/assets/icons";
import { useDocumentStore } from "@/store/useDocumentStore";
import { DocumentFile, FileSystemItem } from "@/types/documents";

import { FileSystemListItem } from "./FileSystemSystemDocuments";

interface DocumentListProps {
  items: FileSystemItem[];
  selectedFile: DocumentFile | null;
  onSelectItem: (item: FileSystemItem) => void;
  onNavigateUp: () => void;
  isLoading: boolean;
  currentFolderId: string | null;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
}

// eslint-disable-next-line react/display-name
export const DocumentList: React.FC<DocumentListProps> = React.memo(
  ({
    items,
    selectedFile,
    onSelectItem,
    onNavigateUp,
    isLoading,
    currentFolderId,
    searchQuery,
    onSearchChange,
    onFilterPress,
  }) => {
    const { tagFilter, fileTypeFilter, departmentFilter } = useDocumentStore();
    const isFilterActive =
      tagFilter.trim().length > 0 ||
      fileTypeFilter !== "all" ||
      departmentFilter !== "all";

    const { folders, files } = useMemo(() => {
      return {
        folders: items.filter((item) => item.type === "folder"),
        files: items.filter((item) => item.type === "file"),
      };
    }, [items]);

    const isSearching = searchQuery.length > 0;

    return (
      <View className="w-80 bg-bg-surface p-4 rounded-xl h-full shadow-sm">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-text-primary">
            Documents ({items.length})
          </Text>
          {currentFolderId && !isSearching && (
            <TouchableOpacity
              onPress={onNavigateUp}
              className="py-1 px-3 rounded-lg bg-bg-tertiary"
            >
              <Text className="text-sm text-text-secondary font-medium">
                ← Back
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search & Actions */}
        <View className="flex-row items-center bg-bg-tertiary rounded-lg px-2 mb-3 h-10">
          <TextInput
            className="flex-1 h-full text-base text-text-primary mr-2"
            placeholder="Search..."
            placeholderTextColor="#A09CAB"
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          <TouchableOpacity onPress={onFilterPress} className="p-2 relative">
            <FilterIcon width={15} height={15} />
            {isFilterActive && (
              <View className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-bg-tertiary" />
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#602AF3" />
            <Text className="text-text-tertiary mt-2">
              {isSearching ? "Searching..." : "Loading..."}
            </Text>
          </View>
        ) : items.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-text-tertiary text-center px-4">
              {isSearching
                ? `No results found for "${searchQuery}"`
                : "This folder is empty"}
            </Text>
          </View>
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {folders.length > 0 && (
              <View className="mb-2">
                <Text className="text-xs text-text-tertiary font-semibold mb-2 px-1">
                  FOLDERS ({folders.length})
                </Text>
                {folders.map((item) => (
                  <FileSystemListItem
                    key={item.data.id}
                    item={item}
                    isSelected={false}
                    onPress={() => onSelectItem(item)}
                  />
                ))}
              </View>
            )}

            {files.length > 0 && (
              <View>
                <Text className="text-xs text-text-tertiary font-semibold mb-2 px-1">
                  FILES ({files.length})
                </Text>
                {files.map((item) => (
                  <FileSystemListItem
                    key={item.data.id}
                    item={item}
                    isSelected={
                      selectedFile?.id === item.data.id && item.type === "file"
                    }
                    onPress={() => onSelectItem(item)}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    );
  },
);
