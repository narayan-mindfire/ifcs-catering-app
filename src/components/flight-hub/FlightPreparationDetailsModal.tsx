/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusRow } from "./StatusRow";
import { CartVisualizer } from "./CartVisulaizer";
import { ContainerVisualizer } from "./ContainerVisualizer";
import {
  PackingStandardItem,
  PackingStandardContainer,
} from "../../types/preparations";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { ImageIcon } from "../../assets/icons";

interface FlightPreparationModalProps {
  visible: boolean;
  onClose: () => void;
  flightId: string;
  preparationId: string;
  isLocked: boolean;
  isSealed: boolean;
  isCompleted: boolean;
}

export const FlightPreparationDetailsModal: React.FC<
  FlightPreparationModalProps
> = ({
  visible,
  onClose,
  flightId,
  preparationId,
  isLocked,
  isSealed,
  isCompleted,
}) => {
  const { preparationDetail, fetchPreparationById, isPrepLoading } =
    useFlightPreparationStore();

  const [selectedDrawerContents, setSelectedDrawerContents] = useState<
    PackingStandardItem[]
  >([]);
  const [activeDrawerName, setActiveDrawerName] = useState<string>("");
  const [activeDrawerIndex, setActiveDrawerIndex] = useState<number | null>(
    null,
  );

  // --- Image Preview State ---
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewItemName, setPreviewItemName] = useState<string>("");

  useEffect(() => {
    if (visible && flightId && preparationId) {
      fetchPreparationById(flightId, preparationId);
    }
  }, [visible, flightId, preparationId]);

  useEffect(() => {
    if (!preparationDetail) return;

    const packingStd = preparationDetail.packingStandard;
    const equipmentType = packingStd?.equipmentItem?.type || "";

    // In new structure, root items are in 'items', drawers are in 'containers'
    const rootItems = packingStd?.items || [];
    const containers = packingStd?.containers || [];
    const parentName = packingStd?.name || "Equipment Contents";

    // Logic to determine initial view
    if (equipmentType === "Cart" || equipmentType === "Container") {
      if (containers.length > 0) {
        // If there are drawers/containers, select the first one by default
        const firstContainer = containers[0];
        setSelectedDrawerContents(firstContainer.items || []);
        setActiveDrawerName(firstContainer.name);
        setActiveDrawerIndex(0);
      } else {
        // Fallback to root items if no containers exist
        setSelectedDrawerContents(rootItems);
        setActiveDrawerName(parentName);
        setActiveDrawerIndex(null);
      }
    } else {
      // For loose items (e.g. Bags, Oven inserts), show root items
      setSelectedDrawerContents(rootItems);
      setActiveDrawerName(parentName);
      setActiveDrawerIndex(null);
    }
  }, [preparationDetail]);

  const handleDrawerClick = (
    drawerIndex: number | null,
    drawerData: PackingStandardContainer | null,
  ) => {
    const packingStd = preparationDetail?.packingStandard;
    const rootItems = packingStd?.items || [];
    const parentName = packingStd?.name || "Equipment Contents";

    setActiveDrawerIndex(drawerIndex);

    if (drawerIndex !== null && drawerData) {
      // User clicked a specific drawer
      setSelectedDrawerContents(drawerData.items || []);
      setActiveDrawerName(drawerData.name);
    } else {
      // User clicked the "frame" or descaled, show root items
      setSelectedDrawerContents(rootItems);
      setActiveDrawerName(parentName);
    }
  };

  const handleImagePress = (url: string | null | undefined, name: string) => {
    setPreviewImageUrl(url || null);
    setPreviewItemName(name);
    setIsPreviewVisible(true);
  };

  const closeImagePreview = () => {
    setIsPreviewVisible(false);
    setPreviewImageUrl(null);
    setPreviewItemName("");
  };

  const packingStd = preparationDetail?.packingStandard;
  const containers = packingStd?.containers || [];
  const equipmentType = packingStd?.equipmentItem?.type || "";

  // New payload uses 'aircraftConfigGalleyPosition' instead of 'aircraftPosition'
  const positionImage =
    preparationDetail?.aircraftConfigGalleyPosition?.picture;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-4">
        <View className="w-full max-w-[1000px] h-[80%] bg-bg-surface rounded-3xl overflow-hidden flex flex-col">
          <View className="p-4 border-b border-border-muted flex-row justify-between items-center bg-bg-surface z-10">
            <Text className="text-xl font-medium text-text-secondary">
              Flight Preparation Plan Details
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Text className="text-2xl text-text-tertiary font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          {isPrepLoading || !preparationDetail ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#602AF3" />
              <Text className="mt-4 text-text-secondary">
                Loading Details...
              </Text>
            </View>
          ) : (
            <ScrollView
              className="flex-1 bg-bg-quaternary"
              contentContainerStyle={{ padding: 16 }}
            >
              <StatusRow
                isLocked={isLocked}
                isSealed={isSealed}
                isCompleted={isCompleted}
              />

              <View className="bg-bg-surface rounded-xl p-4 mt-4 border border-border-muted flex-row flex-wrap gap-y-4">
                <View className="w-1/3">
                  <Text className="text-text-secondary text-xs">Galley</Text>
                  <Text className="text-text-primary font-bold">
                    {preparationDetail.galleyPosition || "N/A"}
                  </Text>
                </View>
                <View className="w-1/3">
                  <Text className="text-text-secondary text-xs">Carrier</Text>
                  <Text className="text-text-primary font-bold">
                    {preparationDetail.nameDisplay ||
                      preparationDetail.name ||
                      "N/A"}
                  </Text>
                </View>
                <View className="w-1/3">
                  <Text className="text-text-secondary text-xs">Position</Text>
                  <Text className="text-text-primary font-bold">
                    {preparationDetail.position || "N/A"}
                  </Text>
                </View>
                <View className="w-1/3">
                  <Text className="text-text-secondary text-xs">Equipment</Text>
                  <Text className="text-text-primary font-bold">
                    {preparationDetail.equipment || "N/A"}
                  </Text>
                </View>
                <View className="w-1/3">
                  <Text className="text-text-secondary text-xs">Door</Text>
                  <Text className="text-text-primary font-bold">
                    {preparationDetail.door || "N/A"}
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-4 mt-6 h-[500px]">
                <View className="flex-[2] bg-bg-surface rounded-2xl p-4 flex-row gap-4 border border-border-muted">
                  <View className="flex-1 items-center justify-center">
                    {positionImage ? (
                      <Image
                        source={{
                          uri: positionImage,
                        }}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    ) : (
                      <Text className="text-text-tertiary">
                        No Position Image
                      </Text>
                    )}
                  </View>

                  <View className="flex-1 items-center justify-center pt-8">
                    {equipmentType === "Container" ? (
                      <ContainerVisualizer
                        cabinetFrameImg={packingStd?.equipmentItem?.picture}
                        numberOfDrawers={containers.length}
                        drawersData={containers}
                        defaultOpenDrawer={activeDrawerIndex}
                        onDrawerClick={(idx: any) => {
                          if (idx !== null && containers[idx]) {
                            handleDrawerClick(idx, containers[idx]);
                          } else {
                            handleDrawerClick(null, null);
                          }
                        }}
                      />
                    ) : equipmentType === "Cart" ? (
                      <CartVisualizer
                        cabinetFrameImg={packingStd?.equipmentItem?.picture}
                        numberOfDrawers={containers.length}
                        drawers={containers}
                        defaultOpenDrawer={activeDrawerIndex}
                        onDrawerClick={handleDrawerClick}
                      />
                    ) : (
                      // Fallback for simple items (bags, ovens)
                      <Image
                        source={{
                          uri: packingStd?.equipmentItem?.picture || "",
                        }}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    )}
                  </View>
                </View>

                <View className="flex-1 bg-bg-surface rounded-2xl border border-border-muted overflow-hidden">
                  <View className="p-3 border-b border-border-muted bg-bg-secondary">
                    <Text className="text-sm font-bold text-text-primary">
                      {activeDrawerName || "Content Details"}
                    </Text>
                  </View>

                  <View className="flex-row p-2 border-b border-border-muted bg-bg-tertiary">
                    <Text className="flex-1 text-xs font-bold text-text-secondary text-center">
                      Qty
                    </Text>
                    <Text className="flex-[3] text-xs font-bold text-text-secondary pl-2">
                      Item
                    </Text>
                    <Text className="flex-1 text-xs font-bold text-text-secondary text-center">
                      Img
                    </Text>
                  </View>

                  <ScrollView>
                    {selectedDrawerContents.length > 0 ? (
                      selectedDrawerContents.map((item, index) => (
                        <View
                          key={item.id || index}
                          className="flex-row p-3 border-b border-border-muted items-center"
                        >
                          <Text className="flex-1 text-sm text-text-primary text-center">
                            {item.quantity}
                          </Text>
                          <Text className="flex-[3] text-sm text-text-primary pl-2">
                            {item.name}
                          </Text>
                          <TouchableOpacity
                            className="flex-1 items-center"
                            onPress={() =>
                              handleImagePress(item.picture, item.name)
                            }
                          >
                            {item.picture ? (
                              <Image
                                source={{
                                  uri: item.picture,
                                }}
                                className="w-8 h-8 rounded"
                                resizeMode="cover"
                              />
                            ) : (
                              <ImageIcon width={25} height={25} />
                            )}
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <View className="p-4 items-center">
                        <Text className="text-text-muted text-sm">
                          No items in this selection.
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          )}

          <View className="p-4 border-t border-border-muted items-end bg-bg-surface">
            <TouchableOpacity
              onPress={onClose}
              className="bg-bg-button py-3 px-8 rounded-xl"
            >
              <Text className="text-white font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* --- Image Preview Modal --- */}
      <Modal
        visible={isPreviewVisible}
        animationType="fade"
        transparent
        onRequestClose={closeImagePreview}
      >
        <View className="flex-1 bg-black/80 justify-center items-center z-50">
          <View className="bg-bg-surface w-96 rounded-2xl overflow-hidden p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-lg font-bold text-text-primary flex-1 mr-2"
                numberOfLines={1}
              >
                {previewItemName}
              </Text>
              <TouchableOpacity onPress={closeImagePreview} className="p-1">
                <Text className="text-text-secondary text-xl font-bold">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="w-full h-80 bg-bg-quaternary rounded-xl justify-center items-center overflow-hidden border border-border-muted">
              {previewImageUrl ? (
                <Image
                  source={{ uri: previewImageUrl }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              ) : (
                <View className="items-center justify-center">
                  <ImageIcon width={60} height={60} color="#9CA3AF" />
                  <Text className="text-text-muted mt-2 font-medium">
                    Image Not Available
                  </Text>
                </View>
              )}
            </View>

            <View className="mt-4 flex-row justify-end">
              <TouchableOpacity
                onPress={closeImagePreview}
                className="bg-bg-button py-2 px-6 rounded-lg"
              >
                <Text className="text-white font-semibold text-sm">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};
