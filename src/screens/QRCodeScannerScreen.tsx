import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Alert, Text, View } from "react-native";

import { QRScanner } from "../components/common/QRScanner";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useScannerStore } from "../store/useScannerStore";
import { log } from "../utils/logger";

type Props = StackScreenProps<RootStackParamList, "QRCodeScanner">;

const QRCodeScannerScreen: React.FC<Props> = ({ navigation, route }) => {
  const [scanned, setScanned] = useState(false);
  const { title, subtitle, continuous } = route.params || {};
  const onScan = useScannerStore((state) => state.onScan);
  const clearOnScan = useScannerStore((state) => state.clearOnScan);

  // Cleanup store on unmount
  React.useEffect(() => {
    return () => {
      clearOnScan();
      if (route.params?.onClose) {
        route.params.onClose();
      }
    };
  }, [clearOnScan, route.params]);

  const handleBarCodeScanned = useCallback(
    (data: string) => {
      if (scanned) return;
      setScanned(true);

      // Generic Mode: If a callback is provided via store
      if (onScan) {
        onScan(data);
        if (continuous) {
          // Reset after delay for continuous scanning
          setTimeout(() => {
            setScanned(false);
          }, 1500);
        } else {
          navigation.goBack();
        }
        return;
      }

      // Legacy Mode: Spot Check specific logic
      try {
        const lines = data.split("\n");

        if (lines.length >= 8) {
          const flightPrepId = lines[0].trim();
          const flightId = lines[1].trim();
          const prepName = lines[7].trim();

          if (flightPrepId && flightId) {
            navigation.replace("SpotCheckDetails", {
              flightId: flightId,
              checkId: flightPrepId,
              title: prepName,
            });
          } else {
            throw new Error("Missing ID data in QR code");
          }
        } else {
          throw new Error("QR Code format invalid: Not enough fields");
        }
      } catch (error) {
        log.error("Scan Error:", error);
        Alert.alert(
          "Invalid QR Code",
          "This QR code does not match the expected flight preparation format.",
          [
            {
              text: "Scan Again",
              onPress: () => setScanned(false),
            },
            {
              text: "Cancel",
              onPress: () => navigation.goBack(),
              style: "cancel",
            },
          ],
        );
      }
    },
    [navigation, onScan, continuous, scanned],
  );

  return (
    <View className="flex-1 bg-black">
      <QRScanner
        onScan={handleBarCodeScanned}
        onClose={() => navigation.goBack()}
        scanned={scanned}
        title={title || "Scan Preparation Label"}
        subtitle={subtitle}
      />
      {scanned && continuous && (
        <View className="absolute top-1/2 left-0 right-0 items-center justify-center">
          <View className="bg-green-500 px-6 py-3 rounded-full">
            <Text className="text-white font-bold text-lg">Scanned!</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default QRCodeScannerScreen;
