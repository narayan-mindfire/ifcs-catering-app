import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { BreadCrumb } from "../../components/common/BreadCrumbs";
import { FailReasonModal } from "../../components/SpotCheck/FailedReasonModal";
import { CartVisualizer } from "../../components/flight-hub/CartVisulaizer";
import { ContainerVisualizer } from "../../components/flight-hub/ContainerVisualizer";
import { AppButton } from "../../components/common/AppButton";
import { FlightInfoHeader } from "../../components/SpotCheck/FlightDetailsHeader";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { useFlightStore } from "../../store/useFlightStore";
import {
  PackingStandardItem,
  PackingStandardContainer,
} from "../../types/preparations";

import { ImageIcon, PlaneIcon } from "../../assets/icons";
import { formatDate } from "../../utils/dateFormatter";

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
      };
    }

    return {
      flight:
        selectedFlight.airline?.designator + selectedFlight.flightNumber ||
        "N/A",
      route: `${selectedFlight.departureStation?.code || ""} - ${
        selectedFlight.arrivalStation?.code || ""
      }`,
      date: formatDate(selectedFlight.scheduledDeparture) || "N/A",
      aircraft: selectedFlight.aircraft?.type || "N/A",
      acReg: selectedFlight.aircraft?.registration || "N/A",
      destination: selectedFlight.arrivalStation?.code || "N/A",
    };
  }, [selectedFlight]);

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
    } else {
      setSelectedDrawerContents(rootItems);
      setActiveEquipmentName(packingStd?.equipmentItem?.name || "N/A");
    }
  };

  const handleConfirmFail = useCallback(
    (data: { reason: string; remarks: string }) => {
      console.log("Spot Check Failed:", data);
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
            console.log("Spot Check Passed");
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
        onPress: () =>
          navigation.navigate("SpotCheck", { flightId: flightId || "" }),
      },
      {
        label: "Required Checks",
        onPress: () =>
          navigation.navigate("SpotCheck", { flightId: flightId || "" }),
      },
      { label: title || "Details" },
    ],
    [navigation, title, flightId],
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
  const equipmentType = packingStd?.equipmentItem?.type || "";

  const positionImage =
    preparationDetail?.aircraftConfigGalleyPosition?.picture || null;
  const cabinetImage = packingStd?.equipmentItem?.picture || null;

  const renderVisualizer = () => {
    if (
      (equipmentType === "Container" || equipmentType === "Cart") &&
      !cabinetImage
    ) {
      return (
        <View className="w-full h-full justify-center items-center bg-gray-100 rounded-lg">
          <Text className="text-gray-400 font-bold mb-2">No Cabinet Image</Text>
          <Text className="text-gray-400 text-xs text-center px-4">
            Cannot render visualizer.
          </Text>
        </View>
      );
    }

    if (equipmentType === "Container") {
      return (
        <ContainerVisualizer
          cabinetFrameImg={cabinetImage!}
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
    } else if (equipmentType === "Cart") {
      return (
        <CartVisualizer
          cabinetFrameImg={cabinetImage!}
          numberOfDrawers={containers.length}
          drawers={containers}
          defaultOpenDrawer={activeDrawerIndex}
          onDrawerClick={handleDrawerClick}
        />
      );
    } else {
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
    }
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
                      {item.picture ? (
                        <Image
                          source={{ uri: item.picture }}
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
                <View className="p-8 items-center">
                  <Text className="text-gray-400 text-sm">Empty</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        <View className="flex-row gap-4 mt-6 justify-end">
          <AppButton
            title="FAIL"
            onPress={handleFailTrigger}
            type="danger"
            style={{ flex: 1 }}
          />
          <AppButton
            title="PASS"
            onPress={handlePass}
            style={{ flex: 1, backgroundColor: "#22c55e" }}
            type="primary"
          />
        </View>
      </ScrollView>

      <FailReasonModal
        isVisible={isFailModalVisible}
        onClose={() => setIsFailModalVisible(false)}
        onConfirm={handleConfirmFail}
        itemName={title || "Preparation Item"}
      />
    </View>
  );
};

export default SpotCheckDetailsScreen;
