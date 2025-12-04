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
  ItemContentMapped,
  RecursivePackingStandardNode,
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
    ItemContentMapped[]
  >([]);
  const [activeDrawerName, setActiveDrawerName] = useState<string>("");
  const [activeDrawerIndex, setActiveDrawerIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (visible && flightId && preparationId) {
      fetchPreparationById(flightId, preparationId);
    }
  }, [visible, flightId, preparationId]);

  useEffect(() => {
    if (!preparationDetail) return;

    const packingStd = preparationDetail.packingStandard;
    const equipmentType = packingStd?.equipmentItem?.type || "";
    const parentContents = packingStd?.contents || [];
    const parentName =
      packingStd?.packingStandard?.name || "Equipment Contents";
    const drawers = packingStd?.children || [];

    if (equipmentType === "Cart" || equipmentType === "Container") {
      if (parentContents.length > 0) {
        setSelectedDrawerContents(parentContents);
        setActiveDrawerName(parentName);
        setActiveDrawerIndex(null);
      } else if (drawers.length > 0) {
        const firstDrawer = drawers[0];
        setSelectedDrawerContents(firstDrawer.contents || []);
        setActiveDrawerName(firstDrawer.packingStandard.name);
        setActiveDrawerIndex(0);
      }
    } else {
      setSelectedDrawerContents(parentContents);
      setActiveDrawerName(parentName);
      setActiveDrawerIndex(null);
    }
  }, [preparationDetail]);

  const handleDrawerClick = (
    drawerIndex: number | null,
    drawerData: RecursivePackingStandardNode | null,
  ) => {
    const packingStd = preparationDetail?.packingStandard;
    const parentContents = packingStd?.contents || [];
    const parentName =
      packingStd?.packingStandard?.name || "Equipment Contents";

    setActiveDrawerIndex(drawerIndex);

    if (drawerIndex !== null && drawerData) {
      setSelectedDrawerContents(drawerData.contents || []);
      setActiveDrawerName(drawerData.packingStandard.name);
    } else {
      if (parentContents.length > 0) {
        setSelectedDrawerContents(parentContents);
        setActiveDrawerName(parentName);
      } else {
        setSelectedDrawerContents([]);
        setActiveDrawerName("");
      }
    }
  };

  const packingStd = preparationDetail?.packingStandard;
  const drawers = packingStd?.children || [];
  const equipmentType = packingStd?.equipmentItem?.type || "";

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
                    {preparationDetail.nameDisplay || "N/A"}
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
                    {preparationDetail.aircraftPosition?.picture ? (
                      <Image
                        source={{
                          uri: preparationDetail.aircraftPosition.picture,
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
                        cabinetFrameImg={packingStd?.equipmentCategory?.picture}
                        numberOfDrawers={
                          packingStd?.equipmentItem?.drawerCount || 0
                        }
                        drawersData={drawers}
                        defaultOpenDrawer={activeDrawerIndex}
                        onDrawerClick={(idx: any) => {
                          if (idx !== null && drawers[idx]) {
                            handleDrawerClick(idx, drawers[idx]);
                          } else {
                            handleDrawerClick(null, null);
                          }
                        }}
                      />
                    ) : equipmentType === "Cart" ? (
                      <CartVisualizer
                        cabinetFrameImg={packingStd?.equipmentCategory?.picture}
                        numberOfDrawers={
                          packingStd?.equipmentItem?.drawerCount || 0
                        }
                        drawers={drawers}
                        defaultOpenDrawer={activeDrawerIndex}
                        onDrawerClick={handleDrawerClick}
                      />
                    ) : (
                      <Image
                        source={{
                          uri: packingStd?.equipmentCategory?.picture || "",
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
                            {item.packingStandardItemDef?.provisionItem?.name ||
                              item.packingStandardItemDef?.mealItem?.name ||
                              item.name}
                          </Text>
                          <View className="flex-1 items-center">
                            {item.packingStandardItemDef?.provisionItem
                              ?.picture || item.packingStandardItemPicture ? (
                              <Image
                                source={{
                                  uri:
                                    item.packingStandardItemDef?.provisionItem
                                      ?.picture ||
                                    item.packingStandardItemPicture ||
                                    "",
                                }}
                                className="w-8 h-8 rounded"
                                resizeMode="cover"
                              />
                            ) : (
                              <ImageIcon width={25} height={25} />
                            )}
                          </View>
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
    </Modal>
  );
};
