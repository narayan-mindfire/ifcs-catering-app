import React, { useState } from "react";
import { Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { QRScanner } from "../components/common/QRScanner";

type NavigationProp = StackNavigationProp<RootStackParamList, "QRCodeScanner">;

interface Props {
  navigation: NavigationProp;
}

const QRCodeScannerScreen: React.FC<Props> = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);

  const handleScan = (data: string) => {
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
  };

  return (
    <QRScanner
      onScan={handleScan}
      onClose={() => navigation.goBack()}
      scanned={scanned}
    />
  );
};

export default QRCodeScannerScreen;
