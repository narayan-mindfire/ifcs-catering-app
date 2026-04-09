/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ImageIcon } from "../../assets/icons";
import { useAuthStore } from "../../store/useAuthStore";
import { useConsumptionTrackingStore } from "../../store/useConsumptionStore";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { ConsumptionTrackingRecord } from "../../types/consumption";
import {
  PackingStandardContainer,
  PackingStandardItem,
} from "../../types/preparations";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { ConsumptionModal } from "../preparation/ConsumptionTrackingModal";
import { LockNumberModal } from "../preparation/LockNumberModal";
import { SealNumberModal } from "../preparation/SealNumberModal";
import { CartVisualizer } from "./CartVisulaizer";
import { ContainerVisualizer } from "./ContainerVisualizer";
import { OvenVisualizer } from "./OvenVisualizer";
import { SignatureModal } from "./SharedComponents";
import { StatusRow } from "./StatusRow";

interface FlightPreparationModalProps {
  visible: boolean;
  onClose: () => void;
  flightId: string;
  preparationId: string;
  isLocked: boolean;
  isSealed: boolean;
  isPrepared: boolean;
  lockRequired: boolean;
  sealRequired: boolean;
  isConsumptionMode?: boolean;
  onFinishConsumption?: () => void;
  labelData?: any;
}

const ValidationModal = ({
  visible,
  message,
  onClose,
}: {
  visible: boolean;
  message: string;
  onClose: () => void;
}) => (
  <Modal transparent visible={visible} animationType="fade">
    <View className="flex-1 bg-black/50 justify-center items-center">
      <View className="bg-bg-surface w-[300px] p-5 rounded-xl shadow-lg border border-border-secondary items-center">
        <View className="h-12 w-12 rounded-full bg-bg-button/10 items-center justify-center mb-3">
          <Text className="text-2xl">ℹ️</Text>
        </View>
        <Text className="text-lg font-bold text-text-primary mb-2 text-center">
          Action Required
        </Text>
        <Text className="text-base text-text-secondary text-center mb-5">
          {message}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="bg-bg-button w-full py-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export const FlightPreparationDetailsModal: React.FC<
  FlightPreparationModalProps
> = ({
  visible,
  onClose,
  flightId,
  preparationId,
  isLocked: initialIsLocked,
  isSealed: initialIsSealed,
  isPrepared: initialIsPrepared,
  lockRequired,
  sealRequired,
  isConsumptionMode = false,
  onFinishConsumption,
  labelData,
}) => {
  const {
    preparations,
    preparationDetail,
    fetchPreparationById,
    isPrepLoading,
    updatePreparationFlag,
    isUpdating,
    checkUserSignature,
    addUserSignature,
  } = useFlightPreparationStore();

  const { records: consumptionRecords, fetchConsumptionRecords } =
    useConsumptionTrackingStore();

  const { deliveries, selectedDeliveryId, fetchDeliveries, createDelivery } =
    useDeliveryStore();

  const [selectedDrawerContents, setSelectedDrawerContents] = useState<
    PackingStandardItem[]
  >([]);
  const [activeDrawerIndex, setActiveDrawerIndex] = useState<number | null>(
    null,
  );
  const [activeEquipmentName, setActiveEquipmentName] = useState<string>("");
  const [activeDrawerEquipmentItemName, setActiveDrawerEquipmentItemName] =
    useState<string>("");

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewItemName, setPreviewItemName] = useState<
    string | null | undefined
  >("");

  const [sealModalVisible, setSealModalVisible] = useState(false);
  const [lockModalVisible, setLockModalVisible] = useState(false);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [hasUserSignature, setHasUserSignature] = useState(false);

  const [consumptionModalVisible, setConsumptionModalVisible] = useState(false);
  const [consumptionItem, setConsumptionItem] =
    useState<PackingStandardItem | null>(null);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string;
    actionType: "disable" | "enable";
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    title: "",
    message: "",
    actionType: "disable",
    onConfirm: () => {},
  });

  const [validationMsg, setValidationMsg] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  const [isPrepared, setIsPrepared] = useState(initialIsPrepared);
  const [isSealed, setIsSealed] = useState(initialIsSealed);
  const [isLocked, setIsLocked] = useState(initialIsLocked);
  const preparation = preparations.find((p) => p.id === preparationId);
  const [selectedConsumptionRecord, setSelectedConsumptionRecord] =
    useState<ConsumptionTrackingRecord | null>(null);

  const { user } = useAuthStore();

  useEffect(() => {
    if (visible && flightId && preparationId) {
      fetchPreparationById(flightId, preparationId);
      fetchDeliveries(flightId);
      if (isConsumptionMode) {
        fetchConsumptionRecords(flightId, {
          flightPreparationId: preparationId,
          limit: 100,
        });
      }
    }
  }, [visible, flightId, preparationId, isConsumptionMode]);

  useEffect(() => {
    const checkSignature = async () => {
      if (flightId && deliveries.length > 0 && user?.id) {
        const deliveryId = selectedDeliveryId || deliveries[0].id;
        const hasSignature = await checkUserSignature(
          flightId,
          deliveryId,
          user.id,
        );
        setHasUserSignature(hasSignature);
      }
    };

    if (deliveries.length > 0 && visible) {
      checkSignature();
    }
  }, [deliveries, flightId, selectedDeliveryId, visible, user?.id]);

  useEffect(() => {
    if (preparation) {
      setIsSealed(
        !!preparation.sealTagNumber && preparation.sealTagNumber !== "",
      );
      setIsLocked(
        !!preparation.lockTagNumber && preparation.lockTagNumber !== "",
      );
      setIsPrepared(preparation.isContentPrepared);
    }
  }, [preparation]);

  const getDerivedEquipmentType = () => {
    if (!preparationDetail) return "";
    const packingStd = preparationDetail.packingStandard;

    const rawType = packingStd?.equipmentItem?.type;
    if (rawType) return rawType;

    const containers = packingStd?.containers || [];
    const name = (
      packingStd?.equipmentItem?.name ||
      preparationDetail.equipment ||
      ""
    ).toLowerCase();

    if (containers.length > 0) {
      if (name.includes("cart")) return "Cart";
      if (name.includes("oven")) return "Oven Insert";
      return "Atlas";
    }

    return "Bulk";
  };

  const derivedEquipmentType = getDerivedEquipmentType();
  useEffect(() => {
    if (!preparationDetail) return;

    const packingStd = preparationDetail.packingStandard;
    const parentContents = packingStd?.items || [];
    const drawers = packingStd?.containers || [];
    const equipmentName = packingStd?.equipmentItem?.name || "";
    const parentName = packingStd?.name || "Equipment Contents";

    const type = derivedEquipmentType;

    if (type === "Cart" || type === "Atlas" || type === "Container") {
      if (parentContents.length > 0) {
        setSelectedDrawerContents(parentContents);
        setActiveEquipmentName(parentName);
        setActiveDrawerEquipmentItemName(equipmentName);
        setActiveDrawerIndex(null);
      } else if (drawers.length > 0) {
        const firstDrawer = drawers[0];
        setSelectedDrawerContents(firstDrawer.items || []);
        setActiveEquipmentName(firstDrawer.name || "N/A");
        setActiveDrawerEquipmentItemName(
          firstDrawer.equipmentItem?.name || "N/A",
        );
        setActiveDrawerIndex(0);
      }
    } else if (
      type === "Tray" ||
      type === "Drawer" ||
      type === "Bulk" ||
      type === "Oven Insert"
    ) {
      setSelectedDrawerContents(parentContents);
      setActiveEquipmentName(parentName);
      setActiveDrawerEquipmentItemName(equipmentName);
      setActiveDrawerIndex(null);
    }
  }, [preparationDetail, derivedEquipmentType]);

  const handleDrawerClick = (
    drawerIndex: number | null,
    drawerData: PackingStandardContainer | null,
  ) => {
    const packingStd = preparationDetail?.packingStandard;
    const parentContents = packingStd?.items || [];
    const parentName = packingStd?.name || "Equipment Contents";
    const parentEquipmentName = packingStd?.equipmentItem?.name || "";

    setActiveDrawerIndex(drawerIndex);

    if (drawerIndex !== null && drawerData) {
      setSelectedDrawerContents(drawerData.items || []);
      setActiveEquipmentName(drawerData.name || "N/A");
      setActiveDrawerEquipmentItemName(drawerData.equipmentItem?.name || "N/A");
    } else {
      if (parentContents.length > 0) {
        setSelectedDrawerContents(parentContents);
        setActiveEquipmentName(parentName);
        setActiveDrawerEquipmentItemName(parentEquipmentName);
      } else {
        setSelectedDrawerContents([]);
        setActiveEquipmentName("");
        setActiveDrawerEquipmentItemName("");
      }
    }
  };

  const handleOpenConsumptionModal = (item: PackingStandardItem) => {
    const existingRecord = consumptionRecords.find(
      (r) => r.flightPrepPackingStandardItemId === item.id,
    );
    setSelectedConsumptionRecord(existingRecord || null);
    setConsumptionItem(item);
    setConsumptionModalVisible(true);
  };

  const handleImagePress = (
    url: string | null | undefined,
    name: string | null | undefined,
  ) => {
    setPreviewImageUrl(url || null);
    setPreviewItemName(name);
    setIsPreviewVisible(true);
  };

  const closeImagePreview = () => {
    setIsPreviewVisible(false);
    setPreviewImageUrl(null);
    setPreviewItemName("");
  };

  const handlePreparedAction = async () => {
    if (!flightId || !preparationDetail) return;

    if (isPrepared) {
      if (isSealed) {
        setValidationMsg(
          "Cannot disable preparation. Please remove seal first.",
        );
        setShowValidation(true);
        return;
      }
      setConfirmModalData({
        title: "Disable Preparation",
        message: "Are you sure you want to mark this as not prepared?",
        actionType: "disable",
        onConfirm: async () => {
          setConfirmModalVisible(false);
          await updatePreparationFlag(flightId, preparationDetail.id, {
            action: "prepared",
            isContentPrepared: false,
          });
        },
      });
      setConfirmModalVisible(true);
    } else {
      await updatePreparationFlag(flightId, preparationDetail.id, {
        action: "prepared",
        isContentPrepared: true,
      });
    }
  };

  const handleSealAction = async () => {
    if (!flightId || !preparationDetail) return;

    if (!sealRequired && !isSealed) return;

    if (isSealed) {
      if (isLocked) {
        setValidationMsg("Cannot remove seal. Please unlock first.");
        setShowValidation(true);
        return;
      }
      setConfirmModalData({
        title: "Remove Seal",
        message: "Are you sure you want to remove the seal from this item?",
        actionType: "disable",
        onConfirm: async () => {
          setConfirmModalVisible(false);
          const success = await updatePreparationFlag(
            flightId,
            preparationDetail.id,
            { action: "seal", sealTagNumber: null },
          );
          if (success) {
            setIsSealed(false);
            Alert.alert("Success", "Seal removed");
          }
        },
      });
      setConfirmModalVisible(true);
    } else {
      if (!isPrepared) {
        setValidationMsg("Please complete preparation first before sealing.");
        setShowValidation(true);
        return;
      }
      if (!hasUserSignature) {
        setSignatureModalVisible(true);
        return;
      }
      setSealModalVisible(true);
    }
  };

  const handleLockedAction = async () => {
    if (!flightId || !preparationDetail) return;

    if (!lockRequired && !isLocked) return;

    if (isLocked) {
      setConfirmModalData({
        title: "Unlock",
        message: "Are you sure you want to unlock this item?",
        actionType: "disable",
        onConfirm: async () => {
          setConfirmModalVisible(false);
          const success = await updatePreparationFlag(
            flightId,
            preparationDetail.id,
            { action: "lock", lockTagNumber: null },
          );
          if (success) {
            setIsLocked(false);
            Alert.alert("Success", "Unlocked successfully");
          }
        },
      });
      setConfirmModalVisible(true);
    } else {
      if (!isSealed) {
        setValidationMsg("Please complete sealing first before locking.");
        setShowValidation(true);
        return;
      }
      setLockModalVisible(true);
    }
  };

  const handleSaveLockNumber = async (lockNumber: number) => {
    setLockModalVisible(false);
    if (!flightId || !preparationDetail) return;
    await updatePreparationFlag(flightId, preparationDetail.id, {
      action: "lock",
      lockTagNumber: lockNumber,
    });
  };

  const handleSaveSignature = async (signature: string) => {
    setSignatureModalVisible(false);
    if (!flightId) {
      Alert.alert("Error", "No flight selected");
      return;
    }
    let deliveryId = selectedDeliveryId || deliveries[0]?.id;
    if (!deliveryId) {
      try {
        await createDelivery(flightId, "Default Delivery");
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newDeliveries = useDeliveryStore.getState().deliveries;
        deliveryId = newDeliveries[0]?.id;
        if (!deliveryId) {
          Alert.alert("Error", "Failed to create delivery");
          return;
        }
      } catch (error) {
        Alert.alert("Error", "Failed to create delivery", error as any);
        return;
      }
    }
    if (!user?.id) return;
    const success = await addUserSignature(
      flightId,
      deliveryId,
      user.id,
      signature,
    );
    if (success) {
      setHasUserSignature(true);
      Alert.alert("Success", "Signature saved successfully");
      setSealModalVisible(true);
    } else {
      Alert.alert("Error", "Failed to save signature. Please try again.");
    }
  };

  const handleSaveSealNumber = async (sealNumber: number) => {
    setSealModalVisible(false);
    if (!flightId || !preparationDetail) return;
    await updatePreparationFlag(flightId, preparationDetail.id, {
      action: "seal",
      sealTagNumber: sealNumber,
    });
  };

  const handleFinishConsumption = () => {
    if (!preparationDetail || !onFinishConsumption) return;

    // Collect all items (top-level and inside containers)
    const packingStd = preparationDetail.packingStandard;
    const allItems: PackingStandardItem[] = [];

    // Top level items
    if (packingStd?.items) {
      allItems.push(...packingStd.items);
    }

    // Items in containers
    if (packingStd?.containers) {
      packingStd.containers.forEach((container) => {
        if (container.items) {
          allItems.push(...container.items);
        }
      });
    }

    // Find untracked items
    const untrackedItems = allItems.filter((item) => {
      const isTrackable =
        preparationDetail.isTrackConsumption || item.isTrackConsumption;

      if (!isTrackable) return false;

      const isTracked = consumptionRecords.some((r) => {
        if (item.isDynamic) {
          return (
            r.flightPreparationDynamicItemId ===
            (item.flightPreparationDynamicItemId || item.id)
          );
        }
        return r.flightPrepPackingStandardItemId === item.id;
      });

      return !isTracked;
    });

    if (untrackedItems.length > 0) {
      setConfirmModalData({
        title: "Incomplete Tracking",
        message: "You have untracked items. Do you want to finish anyway?",
        actionType: "enable",
        confirmText: "Finish & Close",
        cancelText: "Continue Tracking",
        onConfirm: () => {
          setConfirmModalVisible(false);
          onFinishConsumption();
        },
      });
      setConfirmModalVisible(true);
      return;
    }

    onFinishConsumption();
  };

  const packingStd = preparationDetail?.packingStandard;
  const containers = packingStd?.containers || [];
  const positionImage =
    preparationDetail?.aircraftConfigGalleyPosition?.picture;

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-4">
          <View className="w-full max-w-[1000px] h-[80%] bg-bg-surface rounded-3xl overflow-hidden flex flex-col">
            <View
              className={`p-4 border-b border-border-muted flex-row justify-between items-cente z-10`}
            >
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
                  isPrepared={isPrepared}
                  lockRequired={lockRequired}
                  sealRequired={sealRequired}
                  onPreparedPress={handlePreparedAction}
                  onSealedPress={handleSealAction}
                  onLockedPress={handleLockedAction}
                  isUpdating={isUpdating}
                />

                <View className="bg-bg-surface rounded-xl p-4 mt-4 border border-border-muted flex-row gap-4">
                  <View className="flex-1 gap-y-3">
                    <View>
                      <Text className="text-text-secondary text-xs">
                        Galley
                      </Text>
                      <Text className="text-text-primary font-bold">
                        {preparationDetail?.aircraftConfigGalleyPosition
                          ?.galleyPosition || "N/A"}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-text-secondary text-xs">Door</Text>
                      <Text className="text-text-primary font-bold">
                        {preparationDetail.door || "N/A"}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-text-secondary text-xs">
                        Position
                      </Text>
                      <Text className="text-text-primary font-bold">
                        {preparationDetail.position || "N/A"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <View>
                      <Text className="text-text-secondary text-xs">
                        Equipment
                      </Text>
                      <Text className="text-text-primary font-bold">
                        {preparationDetail.equipment || "N/A"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <View>
                      <Text className="text-text-secondary text-xs">Name</Text>
                      <Text className="text-text-primary font-bold">
                        {activeDrawerEquipmentItemName || "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-4 mt-6 h-[500px]">
                  <View className="flex-[2] bg-bg-surface rounded-2xl p-4 flex-row gap-4 border border-border-muted">
                    <View className="flex-1 items-center justify-center">
                      {positionImage ? (
                        <Image
                          source={{ uri: positionImage }}
                          className="w-full h-full"
                          resizeMode="contain"
                        />
                      ) : (
                        <Text className="text-text-tertiary">
                          No Position Image
                        </Text>
                      )}
                    </View>
                    <View className="flex-1 items-center justify-center">
                      {derivedEquipmentType === "Atlas" ||
                      derivedEquipmentType === "Container" ? (
                        <ContainerVisualizer
                          cabinetFrameImg={packingStd?.equipmentItem?.picture}
                          numberOfDrawers={containers.length}
                          drawersData={containers}
                          defaultOpenDrawer={activeDrawerIndex}
                          onDrawerClick={(idx: any) =>
                            idx !== null && containers[idx]
                              ? handleDrawerClick(idx, containers[idx])
                              : handleDrawerClick(null, null)
                          }
                        />
                      ) : derivedEquipmentType === "Cart" ? (
                        <CartVisualizer
                          cabinetFrameImg={packingStd?.equipmentItem?.picture}
                          numberOfDrawers={containers.length}
                          drawers={containers}
                          defaultOpenDrawer={activeDrawerIndex}
                          onDrawerClick={handleDrawerClick}
                        />
                      ) : derivedEquipmentType === "Oven" ? (
                        <OvenVisualizer
                          cabinetFrameImg={packingStd?.equipmentItem?.picture}
                          numberOfDrawers={containers.length}
                          drawers={containers}
                          defaultOpenDrawer={activeDrawerIndex}
                          onDrawerClick={handleDrawerClick}
                        />
                      ) : (
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
                      <View className="mb-2">
                        <Text className="text-xs text-text-secondary">
                          Selected
                        </Text>
                        <Text className="text-sm font-bold text-text-primary">
                          {activeEquipmentName}
                        </Text>
                      </View>
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
                        selectedDrawerContents.map((item, index) => {
                          let isTrackable =
                            preparationDetail.isTrackConsumption ||
                            item.isTrackConsumption;

                          const isTracked = consumptionRecords.some((r) => {
                            if (item.isDynamic) {
                              return (
                                r.flightPreparationDynamicItemId ===
                                (item.flightPreparationDynamicItemId || item.id)
                              );
                            }
                            return (
                              r.flightPrepPackingStandardItemId === item.id
                            );
                          });
                          let rowStyle =
                            "bg-bg-surface border-b border-border-muted";

                          if (isConsumptionMode && isTrackable) {
                            if (isTracked) {
                              rowStyle =
                                "bg-blue-50 border-b border-blue-200 border-l-[4px] border-l-blue-500";
                            } else {
                              rowStyle =
                                "bg-red-50 border-b border-red-200 border-l-[4px] border-l-red-500";
                            }
                          }

                          return (
                            <TouchableOpacity
                              key={item.id || index}
                              className={`flex-row p-3 items-center ${rowStyle}`}
                              onPress={() => {
                                if (isConsumptionMode && isTrackable) {
                                  handleOpenConsumptionModal(item);
                                } else {
                                  handleImagePress(item.picture, item.name);
                                }
                              }}
                            >
                              <Text className="flex-1 text-sm text-text-primary text-center">
                                {item.quantity}
                              </Text>

                              <Text className="flex-[3] text-sm text-text-primary pl-2">
                                {item.name}
                              </Text>

                              <View className="flex-1 items-center">
                                <TouchableOpacity
                                  onPress={(e) => {
                                    e.stopPropagation();
                                    handleImagePress(item.picture, item.name);
                                  }}
                                >
                                  {item.picture ? (
                                    <Image
                                      source={{ uri: item.picture }}
                                      className="w-8 h-8 rounded"
                                      resizeMode="cover"
                                    />
                                  ) : (
                                    <ImageIcon
                                      width={25}
                                      height={25}
                                      color="#9CA3AF"
                                    />
                                  )}
                                </TouchableOpacity>
                              </View>
                            </TouchableOpacity>
                          );
                        })
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

            <View className="p-4 border-t border-border-muted items-end bg-bg-surface flex-row justify-end gap-3">
              {isConsumptionMode && (
                <TouchableOpacity
                  onPress={handleFinishConsumption}
                  className="bg-green-600 py-3 px-8 rounded-xl"
                >
                  <Text className="text-white font-semibold">Finish</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onClose}
                className="bg-bg-button py-3 px-8 rounded-xl"
              >
                <Text className="text-white font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ConsumptionModal
            presentationStyle="overlay"
            visible={consumptionModalVisible}
            onClose={() => {
              setConsumptionModalVisible(false);
              setConsumptionItem(null);
              setSelectedConsumptionRecord(null);
            }}
            item={consumptionItem}
            existingRecord={selectedConsumptionRecord}
            labelData={labelData}
            activeDrawerIndex={activeDrawerIndex}
            drawerName={activeEquipmentName}
            locationInfo={{
              galley:
                preparationDetail?.aircraftConfigGalleyPosition
                  ?.galleyPosition || null,
              stowage: preparationDetail?.position || null,
              carrier: preparationDetail?.name || null,
              position:
                preparationDetail?.aircraftConfigGalleyPosition?.position ||
                null,
              containerNumber:
                preparationDetail?.aircraftConfigGalleyPosition
                  ?.containerNumber || null,
            }}
            flightId={flightId}
            preparationId={preparationId}
            packingStandardId={preparationDetail?.packingStandard?.id}
            flightPrepProvisionItemId={
              consumptionItem?.provisionId || undefined
            }
          />
          <SealNumberModal
            isOpen={sealModalVisible}
            onClose={() => setSealModalVisible(false)}
            onSave={handleSaveSealNumber}
          />
          <LockNumberModal
            isOpen={lockModalVisible}
            onClose={() => setLockModalVisible(false)}
            onSave={handleSaveLockNumber}
          />
          <SignatureModal
            isOpen={signatureModalVisible}
            onClose={() => setSignatureModalVisible(false)}
            onSave={handleSaveSignature}
            title="Add Your Signature"
          />
          <ConfirmationModal
            isOpen={confirmModalVisible}
            onClose={() => setConfirmModalVisible(false)}
            onConfirm={confirmModalData.onConfirm}
            title={confirmModalData.title}
            message={confirmModalData.message}
            actionType={confirmModalData.actionType}
            confirmText={confirmModalData.confirmText}
            cancelText={confirmModalData.cancelText}
          />
          <ValidationModal
            visible={showValidation}
            message={validationMsg}
            onClose={() => setShowValidation(false)}
          />
        </View>
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
                  <Text className="text-text-secondary text-xl font-bold">
                    ✕
                  </Text>
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
                  <Text className="text-white font-semibold text-sm">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Modal>
    </>
  );
};
