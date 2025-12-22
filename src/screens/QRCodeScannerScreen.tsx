import React, { useCallback, useState } from "react";
import { View, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { QRScanner } from "../components/common/QRScanner";

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
        // --- PARSING LOGIC based on your join("\n") structure ---
        // 0: flightPrepId  <-- needed for checkId
        // 1: flightId      <-- needed for flightId
        // 2: flightPrepPackingStandardId
        // 3: galleyConfigId
        // 4: packingStandardId
        // 5: parentStorageId
        // 6: storageId
        // 7: prepName      <-- needed for title
        // 8: flightNumber
        // ...

        const lines = data.split("\n");

        if (lines.length >= 8) {
          // Ensure we have enough data fields
          const flightPrepId = lines[0].trim();
          const flightId = lines[1].trim();
          const prepName = lines[7].trim();

          // Validate essential IDs
          if (flightPrepId && flightId) {
            console.log(`✅ Jumping to: ${prepName} (${flightPrepId})`);

            // Use 'replace' so hitting "Back" goes to the Dashboard/Selection
            // instead of returning to the camera.
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
