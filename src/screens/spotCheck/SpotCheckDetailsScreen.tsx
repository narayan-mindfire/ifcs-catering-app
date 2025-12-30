import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

import { ImageIcon, PlaneIcon } from "../../assets/icons";
import { AppButton } from "../../components/common/AppButton";
import { BreadCrumb } from "../../components/common/BreadCrumbs";
import { CartVisualizer } from "../../components/flight-hub/CartVisulaizer";
import { ContainerVisualizer } from "../../components/flight-hub/ContainerVisualizer";
import { FailReasonModal } from "../../components/SpotCheck/FailedReasonModal";
import { FlightInfoHeader } from "../../components/SpotCheck/FlightDetailsHeader";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { useFlightStore } from "../../store/useFlightStore";
import {
  PackingStandardContainer,
  PackingStandardItem,
} from "../../types/preparations";
import { formatDate } from "../../utils/dateFormatter";
import { log } from "../../utils/logger";

type SpotCheckDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "SpotCheckDetails"
>;
type SpotCheckDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpotCheckDetails"
>;

interface Props {
  route: SpotCheckDetailsScreenRouteProp;
  navigation: SpotCheckDetailsScreenNavigationProp;
}

const SpotCheckDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { checkId, title, flightId } = route.params;

  const { preparationDetail, fetchPreparationById, isPrepLoading } =
    useFlightPreparationStore();
  const {
    selectedFlight,
    fetchFlightById,
    isLoading: isFlightLoading,
  } = useFlightStore();

  const [selectedDrawerContents, setSelectedDrawerContents] = useState<
    PackingStandardItem[]
  >([]);
  const [activeDrawerIndex, setActiveDrawerIndex] = useState<number | null>(
    null,
  );
  const [activeEquipmentName, setActiveEquipmentName] = useState<string>("");
  const [isFailModalVisible, setIsFailModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewItemName, setPreviewItemName] = useState<
    string | null | undefined
  >("");

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

  useEffect(() => {
    if (flightId && checkId) {
      fetchPreparationById(flightId, checkId);
    }
    if (flightId) {
      if (!selectedFlight || selectedFlight.id !== flightId) {
        fetchFlightById(flightId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId, checkId]);

  const flightInfo = useMemo(() => {
    if (!selectedFlight) {
      return {
        flight: "Loading...",
        route: "...",
        date: "...",
        aircraft: "...",
        acReg: "...",
        destination: "...",
        galley: "...",
        stowage: "...",
        carrier: "...",
      };
    }

    const galleyCode =
      preparationDetail?.aircraftConfigGalleyPosition.galleyPosition || "N/A";
    const stowageCode =
      preparationDetail?.position || preparationDetail?.galleyPosition || "N/A";
    const carrierName =
      preparationDetail?.equipment ||
      preparationDetail?.packingStandard?.equipmentItem?.name ||
      "N/A";

    return {
      flight:
        (selectedFlight.airline?.designator || "") +
          (selectedFlight.flightNumber || "") || "N/A",
      route: `${selectedFlight.departureStation?.code || ""} - ${
        selectedFlight.arrivalStation?.code || ""
      }`,
      date: formatDate(selectedFlight.scheduledDeparture) || "N/A",
      aircraft: selectedFlight.aircraft?.type || "N/A",
      acReg: selectedFlight.aircraft?.registration || "N/A",
      destination: selectedFlight.arrivalStation?.code || "N/A",
      galley: galleyCode,
      stowage: stowageCode,
      carrier: carrierName,
    };
  }, [selectedFlight, preparationDetail]);

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
    const parentName = packingStd?.name || "Equipment Contents";

    const type = derivedEquipmentType;

    if (type === "Cart" || type === "Atlas" || type === "Container") {
      if (parentContents.length > 0) {
        setSelectedDrawerContents(parentContents);
        setActiveEquipmentName(parentName);
        setActiveDrawerIndex(null);
      } else if (drawers.length > 0) {
        const firstContainer = drawers[0];
        setSelectedDrawerContents(firstContainer.items || []);
        setActiveEquipmentName(firstContainer.name || "N/A");
        setActiveDrawerIndex(0);
      }
    } else {
      setSelectedDrawerContents(parentContents);
      setActiveEquipmentName(parentName);
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

    setActiveDrawerIndex(drawerIndex);

    if (drawerIndex !== null && drawerData) {
      setSelectedDrawerContents(drawerData.items || []);
      setActiveEquipmentName(drawerData.name || "N/A");
    } else {
      if (parentContents.length > 0) {
        setSelectedDrawerContents(parentContents);
        setActiveEquipmentName(parentName);
      } else {
        setSelectedDrawerContents([]);
        setActiveEquipmentName("");
      }
    }
  };

  const handleConfirmFail = useCallback(
    (data: { reason: string; remarks: string }) => {
      log.info("Spot Check Failed:", data);
      setIsFailModalVisible(false);
      Alert.alert("Recorded", "Spot Check marked as Failed.");
      navigation.goBack();
    },
    [navigation],
  );

  const handlePass = useCallback(() => {
    Alert.alert(
      "Confirm Pass",
      "Are you sure you want to pass this preparation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pass",
          onPress: () => {
            log.info("Spot Check Passed");
            navigation.goBack();
          },
        },
      ],
    );
  }, [navigation]);

  const handleFailTrigger = useCallback(() => {
    setIsFailModalVisible(true);
  }, []);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", onPress: () => navigation.navigate("Dashboard") },
      {
        label: "Spot Check",
        onPress: () => navigation.navigate("SpotCheckSelection"),
      },
      {
        label: "Required Checks",
        onPress: () => {},
      },
      { label: title || "Details" },
    ],
    [navigation, title],
  );

  if (isPrepLoading || !preparationDetail || isFlightLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#602AF3" />
        <Text className="mt-4 text-gray-500">
          {isFlightLoading ? "Loading Flight Info..." : "Loading Details..."}
        </Text>
      </View>
    );
  }

  const packingStd = preparationDetail?.packingStandard;
  const containers = packingStd?.containers || [];
  const positionImage =
    preparationDetail?.aircraftConfigGalleyPosition?.picture || null;
  const cabinetImage = packingStd?.equipmentItem?.picture || null;

  const renderVisualizer = () => {
    if (
      derivedEquipmentType === "Atlas" ||
      derivedEquipmentType === "Container"
    ) {
      return (
        <ContainerVisualizer
          cabinetFrameImg={cabinetImage}
          numberOfDrawers={containers.length}
          drawersData={containers}
          defaultOpenDrawer={activeDrawerIndex}
          onDrawerClick={(idx: any) =>
            idx !== null && containers[idx]
              ? handleDrawerClick(idx, containers[idx])
              : handleDrawerClick(null, null)
          }
        />
      );
    }

    if (derivedEquipmentType === "Cart") {
      return (
        <CartVisualizer
          cabinetFrameImg={cabinetImage}
          numberOfDrawers={containers.length}
          drawers={containers}
          defaultOpenDrawer={activeDrawerIndex}
          onDrawerClick={handleDrawerClick}
        />
      );
    }

    if (cabinetImage) {
      return (
        <Image
          source={{ uri: cabinetImage }}
          className="w-full h-full"
          resizeMode="contain"
        />
      );
    }

    return (
      <View className="items-center justify-center">
        <ImageIcon width={60} height={60} color="#9CA3AF" />
        <Text className="text-gray-400 mt-2">No Item Image</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <BreadCrumb items={breadcrumbItems} />

      <FlightInfoHeader flightInfo={flightInfo} />

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="flex-row gap-6 h-[500px]">
          <View className="flex-[2] bg-white rounded-2xl p-4 flex-row gap-4 border border-gray-200">
            <View className="flex-1 items-center justify-center border-r border-gray-100 pr-4">
              {positionImage ? (
                <Image
                  source={{ uri: positionImage }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              ) : (
                <View className="items-center">
                  <PlaneIcon width={40} height={40} color="#D1D5DB" />
                  <Text className="text-gray-400 mt-2 text-center">
                    No Position{"\n"}Image
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-1 items-center justify-center">
              {renderVisualizer()}
            </View>
          </View>

          <View className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <View className="p-3 border-b border-gray-200 bg-gray-100">
              <View className="mb-2">
                <Text className="text-xs text-gray-500">Viewing Contents</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {activeEquipmentName}
                </Text>
              </View>
            </View>

            <View className="flex-row p-2 border-b border-gray-200 bg-gray-50">
              <Text className="flex-1 text-xs font-bold text-gray-500 text-center">
                Qty
              </Text>
              <Text className="flex-[3] text-xs font-bold text-gray-500 pl-2">
                Item
              </Text>
              <Text className="flex-1 text-xs font-bold text-gray-500 text-center">
                Img
              </Text>
            </View>

            <ScrollView>
              {selectedDrawerContents.length > 0 ? (
                selectedDrawerContents.map((item, index) => (
                  <View
                    key={item.id || index}
                    className="flex-row p-3 items-center border-b border-gray-100"
                  >
                    <Text className="flex-1 text-sm text-gray-800 text-center">
                      {item.quantity}
                    </Text>
                    <Text className="flex-[3] text-sm text-gray-800 pl-2">
                      {item.name}
                    </Text>
                    <View className="flex-1 items-center">
                      <TouchableOpacity
                        onPress={() =>
                          handleImagePress(item.picture, item.name)
                        }
                        disabled={!item.picture}
                      >
                        {item.picture ? (
                          <Image
                            source={{ uri: item.picture }}
                            className="w-8 h-8 rounded"
                            resizeMode="cover"
                          />
                        ) : (
                          <ImageIcon width={25} height={25} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View className="p-8 items-center">
                  <Text className="text-gray-400 text-sm">Empty</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        <View className="px-6 py-4 border-t border-gray-200 bg-white flex-row gap-4">
          <AppButton
            title="FAIL"
            onPress={handleFailTrigger}
            type="danger"
            style={{ flex: 1 }}
          />
          <AppButton
            title="PASS"
            onPress={handlePass}
            type="secondary"
            style={{ flex: 1, backgroundColor: "#22c55e" }}
            textStyle={{ color: "white" }}
          />
        </View>
      </ScrollView>

      <FailReasonModal
        isVisible={isFailModalVisible}
        onClose={() => setIsFailModalVisible(false)}
        onConfirm={handleConfirmFail}
        itemName={title || "Preparation Item"}
      />

      <Modal
        visible={isPreviewVisible}
        animationType="fade"
        transparent
        onRequestClose={closeImagePreview}
      >
        <View className="flex-1 bg-black/80 justify-center items-center z-50">
          <View className="bg-white w-96 rounded-2xl overflow-hidden p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-lg font-bold text-gray-800 flex-1 mr-2"
                numberOfLines={1}
              >
                {previewItemName}
              </Text>
              <TouchableOpacity onPress={closeImagePreview} className="p-1">
                <Text className="text-gray-600 text-xl font-bold">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="w-full h-80 bg-gray-100 rounded-xl justify-center items-center overflow-hidden border border-gray-200">
              {previewImageUrl ? (
                <Image
                  source={{ uri: previewImageUrl }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              ) : (
                <View className="items-center justify-center">
                  <ImageIcon width={60} height={60} color="#9CA3AF" />
                  <Text className="text-gray-400 mt-2 font-medium">
                    Image Not Available
                  </Text>
                </View>
              )}
            </View>

            <View className="mt-4 flex-row justify-end">
              <TouchableOpacity
                onPress={closeImagePreview}
                className="bg-indigo-600 py-2 px-6 rounded-lg"
              >
                <Text className="text-white font-semibold text-sm">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SpotCheckDetailsScreen;
