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
  Alert,
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
import { SealNumberModal } from "../preparation/SealNumberModal";
import { SignatureModal } from "./SharedComponents";
import { ConsumptionModal } from "../preparation/ConsumptionTrackingModal";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { useDeliveryStore } from "../../store/useDeliveryStore";

interface FlightPreparationModalProps {
  visible: boolean;
  onClose: () => void;
  flightId: string;
  preparationId: string;
  isLocked: boolean;
  isSealed: boolean;
  isPrepared: boolean;
  lockRequired: boolean;
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
}) => {
  const {
    preparationDetail,
    fetchPreparationById,
    isPrepLoading,
    updatePreparationFlag,
    isUpdating,
    checkUserSignature,
    addUserSignature,
  } = useFlightPreparationStore();

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

  // Seal and Signature modals
  const [sealModalVisible, setSealModalVisible] = useState(false);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [hasUserSignature, setHasUserSignature] = useState(false);

  const [consumptionModalVisible, setConsumptionModalVisible] = useState(false);
  const [consumptionItem, setConsumptionItem] =
    useState<PackingStandardItem | null>(null);

  // Confirmation Modal
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string;
    actionType: "disable" | "enable";
    onConfirm: () => void;
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

  const CURRENT_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  useEffect(() => {
    if (visible && flightId && preparationId) {
      fetchPreparationById(flightId, preparationId);
      fetchDeliveries(flightId);
    }
  }, [visible, flightId, preparationId]);

  useEffect(() => {
    const checkSignature = async () => {
      if (flightId && deliveries.length > 0) {
        const deliveryId = selectedDeliveryId || deliveries[0].id;
        const hasSignature = await checkUserSignature(
          flightId,
          deliveryId,
          CURRENT_USER_ID,
        );
        setHasUserSignature(hasSignature);
      }
    };

    if (deliveries.length > 0 && visible) {
      checkSignature();
    }
  }, [deliveries, flightId, selectedDeliveryId, visible]);

  useEffect(() => {
    if (preparationDetail) {
      setIsSealed(
        !!preparationDetail.sealTagNumber &&
          preparationDetail.sealTagNumber !== "",
      );
      setIsLocked(
        preparationDetail.assemblyProcessFlag === "inprogress" ||
          preparationDetail.assemblyProcessFlag === "completed",
      );
    }
  }, [preparationDetail]);

  useEffect(() => {
    if (!preparationDetail) return;

    const packingStd = preparationDetail.packingStandard;
    const equipmentType = packingStd?.equipmentItem?.type || "";
    const rootItems = packingStd?.items || [];
    const containers = packingStd?.containers || [];

    if (equipmentType === "Cart" || equipmentType === "Container") {
      if (containers.length > 0) {
        const firstContainer = containers[0];
        setSelectedDrawerContents(firstContainer.items || []);
        setActiveEquipmentName(firstContainer.name || "N/A");
        setActiveDrawerIndex(0);
      } else {
        setSelectedDrawerContents(rootItems);
        setActiveEquipmentName(packingStd?.equipmentItem?.name || "N/A");
        setActiveDrawerIndex(null);
      }
    } else {
      setSelectedDrawerContents(rootItems);
      setActiveEquipmentName(packingStd?.equipmentItem?.name || "N/A");
      setActiveDrawerIndex(null);
    }
  }, [preparationDetail]);

  const handleDrawerClick = (
    drawerIndex: number | null,
    drawerData: PackingStandardContainer | null,
  ) => {
    const packingStd = preparationDetail?.packingStandard;
    const rootItems = packingStd?.items || [];

    setActiveDrawerIndex(drawerIndex);

    if (drawerIndex !== null && drawerData) {
      setSelectedDrawerContents(drawerData.items || []);
      setActiveEquipmentName(drawerData.name || "N/A");
      setActiveDrawerEquipmentItemName(drawerData.equipmentItem?.name || "N/A");
    } else {
      setSelectedDrawerContents(rootItems);
      setActiveEquipmentName(packingStd?.equipmentItem?.name || "N/A");
      setActiveDrawerEquipmentItemName("N/A");
    }
  };

  const handleOpenConsumptionModal = (item: PackingStandardItem) => {
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
          const success = await updatePreparationFlag(
            flightId,
            preparationDetail.id,
            {
              action: "prepared",
              isContentPrepared: false,
            },
          );
          if (success) {
            setIsPrepared(false);
            Alert.alert("Success", "Preparation status updated");
          }
        },
      });
      setConfirmModalVisible(true);
    } else {
      const success = await updatePreparationFlag(
        flightId,
        preparationDetail.id,
        {
          action: "prepared",
          isContentPrepared: true,
        },
      );
      if (success) {
        setIsPrepared(true);
        Alert.alert("Success", "Marked as prepared");
      }
    }
  };

  const handleSealAction = async () => {
    if (!flightId || !preparationDetail) return;

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
            {
              action: "seal",
              sealTagNumber: null,
            },
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

    if (isLocked) {
      setConfirmModalData({
        title: "Disable Assembly",
        message: "Are you sure you want to mark this as not assembled?",
        actionType: "disable",
        onConfirm: async () => {
          setConfirmModalVisible(false);
          const success = await updatePreparationFlag(
            flightId,
            preparationDetail.id,
            {
              action: "assembly",
              assemblyProcessFlag: false,
            },
          );
          if (success) {
            setIsLocked(false);
            Alert.alert("Success", "Assembly status updated");
          }
        },
      });
      setConfirmModalVisible(true);
    } else {
      if (!isSealed) {
        setValidationMsg("Please complete sealing first before assembly.");
        setShowValidation(true);
        return;
      }

      const success = await updatePreparationFlag(
        flightId,
        preparationDetail.id,
        {
          action: "assembly",
          assemblyProcessFlag: true,
        },
      );
      if (success) {
        setIsLocked(true);
        Alert.alert("Success", "Marked as assembled");
      }
    }
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
        Alert.alert("Error", "Failed to create delivery");
        return;
      }
    }

    const success = await addUserSignature(
      flightId,
      deliveryId,
      CURRENT_USER_ID,
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

    const success = await updatePreparationFlag(
      flightId,
      preparationDetail.id,
      {
        action: "seal",
        sealTagNumber: sealNumber,
      },
    );

    if (success) {
      setIsSealed(true);
      Alert.alert("Success", `Seal applied with tag number: ${sealNumber}`);
    }
  };

  const packingStd = preparationDetail?.packingStandard;
  const containers = packingStd?.containers || [];
  const equipmentType = packingStd?.equipmentItem?.type || "";
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
        <ConsumptionModal
          visible={consumptionModalVisible}
          onClose={() => {
            setConsumptionModalVisible(false);
            setConsumptionItem(null);
          }}
          item={consumptionItem}
          flightId={flightId}
          preparationId={preparationId}
          packingStandardId={preparationDetail?.packingStandard?.id}
          packingStandardItemId={consumptionItem?.id}
          locationInfo={{
            galley: preparationDetail?.galleyPosition || "N/A",
            stowage: preparationDetail?.position || "N/A",
            carrier: preparationDetail?.name || "N/A",
          }}
        />
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
                  isPrepared={isPrepared}
                  lockRequired={lockRequired}
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
                        {preparationDetail.galleyPosition || "N/A"}
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
                        Track
                      </Text>
                    </View>

                    <ScrollView>
                      {selectedDrawerContents.length > 0 ? (
                        selectedDrawerContents.map((item, index) => (
                          <TouchableOpacity
                            key={item.id || index}
                            className="flex-row p-3 border-b border-border-muted items-center"
                            onPress={() =>
                              handleImagePress(item.picture, item.name)
                            }
                          >
                            <Text className="flex-1 text-sm text-text-primary text-center">
                              {item.quantity}
                            </Text>

                            <Text className="flex-[3] text-sm text-text-primary pl-2">
                              {item.name}
                            </Text>
                            <View className="flex-1 items-center">
                              {!item.isTrackConsumption && (
                                <TouchableOpacity
                                  onPress={(e) => {
                                    e.stopPropagation();
                                    handleOpenConsumptionModal(item);
                                  }}
                                  className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 items-center justify-center"
                                >
                                  <Text className="text-blue-600 font-bold text-lg">
                                    I
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </TouchableOpacity>
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

      <SealNumberModal
        isOpen={sealModalVisible}
        onClose={() => setSealModalVisible(false)}
        onSave={handleSaveSealNumber}
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
      />

      <ValidationModal
        visible={showValidation}
        message={validationMsg}
        onClose={() => setShowValidation(false)}
      />
    </>
  );
};
