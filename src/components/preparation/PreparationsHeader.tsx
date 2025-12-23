import React, { useState } from "react";
import { Modal, View } from "react-native";

import { ScanIcon } from "../../assets/icons";
import { AppButton } from "../common/AppButton";
import { QRScanner } from "../common/QRScanner";
import { MultiSelectFilter } from "./MultiSelectFilter";

type ScanActionType = "prep" | "seal" | "assemble" | "load";

const SCAN_ACTIONS = [
  { label: "Prep Scan", actionType: "prep" as ScanActionType },
  { label: "Verify Seal", actionType: "seal" as ScanActionType },
  { label: "Assemble Scan", actionType: "assemble" as ScanActionType },
  { label: "Load Scan", actionType: "load" as ScanActionType },
] as const;

interface PreparationsHeaderProps {
  filterOptions: { label: string; icon: any }[];
  selectedFilters: string[];
  onToggleFilter: (option: string) => void;
  selectedFlight: any;
  onScanAction: (actionType: ScanActionType, scannedData: ParsedQRData) => void;
  isAwaitingCurrentFlightScan?: boolean;
  onCancelConsumptionFlow?: () => void;
}

export interface ParsedQRData {
  flightPrepId: string;
  flightId: string;
  flightPrepPackingStandardId: string;
  galleyConfigId: string;
  packingStandardId: string;
  parentStorageId: string;
  storageId: string;
  prepName: string;
  flightNumber: string;
  position: string;
  scheduledDepartUtc: string;
  rotationCode: string;
}

export const PreparationsHeader: React.FC<PreparationsHeaderProps> = ({
  filterOptions,
  selectedFilters,
  onToggleFilter,
  // selectedFlight,
  onScanAction,
  isAwaitingCurrentFlightScan = false,
  onCancelConsumptionFlow,
}) => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [currentScanAction, setCurrentScanAction] =
    useState<ScanActionType | null>(null);
  const [scanned, setScanned] = useState(false);

  const parseQRData = (rawData: string): ParsedQRData | null => {
    try {
      const lines = rawData
        .trim()
        .split("\n")
        .filter((line) => line.trim() !== "");

      if (lines.length < 12) {
        console.error("Invalid QR data format - insufficient lines");
        return null;
      }

      return {
        flightPrepId: lines[0].trim(),
        flightId: lines[1].trim(),
        flightPrepPackingStandardId: lines[2].trim(),
        galleyConfigId: lines[3].trim(),
        packingStandardId: lines[4].trim(),
        parentStorageId: lines[5].trim(),
        storageId: lines[6].trim(),
        prepName: lines[7].trim(),
        flightNumber: lines[8].trim(),
        position: lines[9].trim(),
        scheduledDepartUtc: lines[10].trim(),
        rotationCode: lines[11].trim(),
      };
    } catch (error) {
      console.error("Error parsing QR data:", error);
      return null;
    }
  };

  const handleScanPress = (actionType: ScanActionType) => {
    setCurrentScanAction(actionType);
    setScanned(false);
    setScannerVisible(true);
  };

  const handleScan = (data: string) => {
    if (scanned || !currentScanAction) return;

    setScanned(true);
    const parsedData = parseQRData(data);

    if (parsedData) {
      onScanAction(currentScanAction, parsedData);

      // Close scanner after successful scan
      setTimeout(() => {
        setScannerVisible(false);
        setScanned(false);

        // Don't reset currentScanAction if awaiting second scan
        if (!isAwaitingCurrentFlightScan) {
          setCurrentScanAction(null);
        }
      }, 500);
    } else {
      alert("Error: Invalid QR code format");
      setScanned(false);
    }
  };

  const handleCloseScanner = () => {
    setScanned(false);

    // If closing during consumption tracking flow, cancel it
    if (isAwaitingCurrentFlightScan && onCancelConsumptionFlow) {
      onCancelConsumptionFlow();
    }

    setCurrentScanAction(null);

    // Delay closing to ensure proper cleanup
    setTimeout(() => {
      setScannerVisible(false);
    }, 100);
  };

  const getScannerTitle = () => {
    if (isAwaitingCurrentFlightScan) {
      return "Scan container from CURRENT flight";
    }

    switch (currentScanAction) {
      case "prep":
        return "Scan item to mark as prepared";
      case "seal":
        return "Scan item to verify seal";
      case "assemble":
        return "Scan item to mark as assembled";
      case "load":
        return "Scan item to mark as loaded";
      default:
        return "Align QR code within the frame";
    }
  };

  // Auto-reopen scanner when awaiting current flight scan
  React.useEffect(() => {
    if (isAwaitingCurrentFlightScan && !scannerVisible) {
      setScannerVisible(true);
      setScanned(false);
    }
  }, [isAwaitingCurrentFlightScan, scannerVisible]);

  return (
    <>
      <View className="flex-row mb-5 z-10">
        <View className="flex-1 flex-row justify-start">
          {SCAN_ACTIONS.map(({ label, actionType }) => (
            <AppButton
              type="tertiary"
              key={label}
              title={label}
              onPress={() => handleScanPress(actionType)}
              IconComponent={<ScanIcon height={28} width={28} />}
              style={{
                marginRight: 12,
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 6,
              }}
              textStyle={{
                fontSize: 17,
                fontWeight: "400",
                color: "var(--text-primary)",
              }}
            />
          ))}
        </View>

        <View className="flex-1 flex-row justify-end">
          <MultiSelectFilter
            options={filterOptions}
            selectedOptions={selectedFilters}
            onToggleOption={onToggleFilter}
          />
        </View>
      </View>

      <Modal
        visible={scannerVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseScanner}
        statusBarTranslucent
      >
        <QRScanner
          onScan={handleScan}
          onClose={handleCloseScanner}
          scanned={scanned}
          title={getScannerTitle()}
        />
      </Modal>
    </>
  );
};
