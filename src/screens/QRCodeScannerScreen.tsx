import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Alert, View } from "react-native";

import { QRScanner } from "../components/common/QRScanner";
import { RootStackParamList } from "../navigation/AppNavigator";
import { log } from "../utils/logger";

type QRCodeScannerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "QRCodeScanner"
>;

interface Props {
  navigation: QRCodeScannerScreenNavigationProp;
}

const QRCodeScannerScreen: React.FC<Props> = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = useCallback(
    (data: string) => {
      setScanned(true);

      try {
        const lines = data.split("\n");

        if (lines.length >= 8) {
          const flightPrepId = lines[0].trim();
          const flightId = lines[1].trim();
          const prepName = lines[7].trim();

          if (flightPrepId && flightId) {
            log.info(`Jumping to: ${prepName} (${flightPrepId})`);

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
        console.error("Scan Error:", error);
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
    [navigation],
  );

  return (
    <View className="flex-1">
      <QRScanner
        onScan={handleBarCodeScanned}
        onClose={() => navigation.goBack()}
        scanned={scanned}
        title="Scan Preparation Label"
      />
    </View>
  );
};

export default QRCodeScannerScreen;
