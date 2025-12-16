import React, { useCallback, useState } from "react";
import { Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

import { QRScanner } from "../components/common/QRScanner";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList, "QRCodeScanner">;

interface Props {
  navigation: NavigationProp;
}

const QRCodeScannerScreen: React.FC<Props> = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);

  const handleScan = useCallback(
    (data: string) => {
      setScanned(true);
      console.log("Scanned Value:", data);

      Alert.alert("Flight Detected", `Flight ID: ${data}`, [
        {
          text: "View Flight",
          onPress: () => {
            console.log("Navigating to flight:", data);
            navigation.goBack();
          },
        },
        {
          text: "Scan Another",
          onPress: () => {
            setScanned(false);
          },
          style: "cancel",
        },
      ]);
    },
    [navigation],
  );

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <QRScanner onScan={handleScan} onClose={handleClose} scanned={scanned} />
  );
};

export default QRCodeScannerScreen;
