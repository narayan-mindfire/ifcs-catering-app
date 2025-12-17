import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BreadCrumb } from "../../components/common/BreadCrumbs";
import { FailReasonModal } from "../../components/SpotCheck/FailedReasonModal";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { CartOverviewPanel } from "../../components/SpotCheck/CartOverviewPanel";
import { FlightInfoHeader } from "../../components/SpotCheck/FlightDetailsHeader";
import { GalleyLocationPanel } from "../../components/SpotCheck/GalleyLocationPanel";
import { SpotCheckItemListPanel } from "../../components/SpotCheck/SpotCheckItemListPanel";

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

const FLIGHT_INFO = {
  flight: "WY913",
  route: "MCT-SLL",
  date: "Aug 13, 2025",
  aircraft: "A380",
  acReg: "STC",
  destination: "SLL",
};

const ITEMS_DATA = [
  { id: 1, qty: 1, item: 'DRAWER LINER 10" X 14 1/2" ATLAS', status: "Fail" },
  { id: 2, qty: 3, item: "White Wine Montenero 187ml eco", status: "Pass" },
  { id: 3, qty: 1, item: "Red Wine Montenero 187ml eco", status: "Fail" },
];

const SpotCheckDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title } = route.params;

  // 1. Local State
  const [selectedGalley, setSelectedGalley] = useState("G200");
  const [isFailModalVisible, setIsFailModalVisible] = useState(false);

  // 2. Handlers
  const handleConfirmFail = useCallback(
    (data: { reason: string; remarks: string }) => {
      console.log("Item Failed:", data);
      setIsFailModalVisible(false);
    },
    [],
  );

  const handlePass = useCallback(() => {
    console.log("Passed actions");
  }, []);

  const handleFailTrigger = useCallback(() => {
    setIsFailModalVisible(true);
  }, []);

  const handleSelectGalley = useCallback((galley: string) => {
    setSelectedGalley(galley);
  }, []);

  // 3. Navigation Breadcrumbs
  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", onPress: () => navigation.navigate("Dashboard") },
      {
        label: "Spot Check",
        onPress: () => navigation.navigate("SpotCheck", { flightId: "WY913" }),
      },
      { label: "Required Checks", onPress: () => navigation.goBack() },
      { label: title || "Ultralight Double Cart" },
    ],
    [navigation, title],
  );

  // 4. Render
  return (
    <View className="flex-1 bg-gray-50">
      <BreadCrumb items={breadcrumbItems} />

      <FlightInfoHeader flightInfo={FLIGHT_INFO} />

      <ScrollView contentContainerStyle={{ padding: 24 }} className="flex-1">
        <View className="flex-row gap-6 h-[600px]">
          <CartOverviewPanel title={title || "Ultralight Double Cart"} />

          <SpotCheckItemListPanel
            items={ITEMS_DATA}
            onPass={handlePass}
            onFail={handleFailTrigger}
          />

          <GalleyLocationPanel
            selectedGalley={selectedGalley}
            onSelectGalley={handleSelectGalley}
          />
        </View>
      </ScrollView>

      <FailReasonModal
        isVisible={isFailModalVisible}
        onClose={() => setIsFailModalVisible(false)}
        onConfirm={handleConfirmFail}
        itemName={title || "B737 Holloware ISC-MEA"}
      />
    </View>
  );
};

export default SpotCheckDetailsScreen;
