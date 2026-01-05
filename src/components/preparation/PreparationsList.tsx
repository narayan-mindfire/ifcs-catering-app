import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, SectionList, Text, View } from "react-native";

import { PreparationItem } from "../../types/preparations";
import { PreparationListItem } from "./PreparationListItems";

interface PreparationsListProps {
  isLoading: boolean;
  sectionedData: { title: string; data: PreparationItem[] }[];
  isUpdating: boolean;
  actions: {
    handleOpenPdf: (item: PreparationItem) => void;
    handlePreparedAction: (item: PreparationItem) => void;
    handleSealAction: (item: PreparationItem) => void;
    handleAssemblyAction: (item: PreparationItem) => void;
    handleLoadAction: (item: PreparationItem) => void;
    handleOpenDetailModal: (item: PreparationItem) => void;
  };
}

export const PreparationsList: React.FC<PreparationsListProps> = ({
  isLoading,
  sectionedData,
  isUpdating,
  actions,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: PreparationItem }) => (
      <PreparationListItem
        item={item}
        isUpdating={isUpdating}
        onOpenPdf={actions.handleOpenPdf}
        onPreparedAction={actions.handlePreparedAction}
        onSealAction={actions.handleSealAction}
        onAssemblyAction={actions.handleAssemblyAction}
        onLoadAction={actions.handleLoadAction}
        onOpenDetailModal={actions.handleOpenDetailModal}
      />
    ),
    [isUpdating, actions],
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => (
      <View className="bg-bg-tertiary px-4 py-2 border-b border-border-secondary">
        <Text className="text-sm font-bold text-text-secondary uppercase">
          {title}
        </Text>
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: PreparationItem) => item.id, []);

  const ListEmptyComponent = useMemo(
    () => (
      <View className="p-4">
        <Text className="text-center text-lg text-text-muted mt-6">
          No preparations found for selected filters.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <View className="flex-1 border border-border-secondary rounded-[10px] overflow-hidden">
      <View className="flex-row bg-bg-quaternary p-4 border-b border-border-muted">
        <View className="flex-[2]">
          <Text className="text-lg font-semibold text-text-secondary">
            Stowage
          </Text>
        </View>
        <View className="flex-[3]">
          <Text className="text-lg font-semibold text-text-secondary">
            Carrier
          </Text>
        </View>
        <View className="flex-[4] items-end">
          <Text className="text-lg font-semibold text-text-secondary">
            Action
          </Text>
        </View>
      </View>
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#B79EFA" />
        </View>
      ) : (
        <SectionList
          style={{ flex: 1 }}
          sections={sectionedData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          ListEmptyComponent={ListEmptyComponent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
        />
      )}
    </View>
  );
};
