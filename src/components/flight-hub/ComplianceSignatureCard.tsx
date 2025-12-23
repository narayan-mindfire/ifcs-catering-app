import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { PrintIcon } from "../../assets/icons";
import { PdfViewerModal } from "../../components/flight-hub/PDFViewerModal";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import { useFlightStore } from "../../store/useFlightStore";
import { formatDate } from "../../utils/dateFormatter";
import { AppButton } from "../common/AppButton";
import { Checkbox } from "./SharedComponents";

interface ComplianceSignatureCardProps {
  title: string;
  isCompliant: boolean;
  toPrint?: boolean;
  onToggleCompliance: (value: boolean) => void;
  confirmationText: string;
  signature: string | null;
  signedAt: Date | null;
  onSign: () => void;
}

export const ComplianceSignatureCard: React.FC<
  ComplianceSignatureCardProps
> = ({
  title,
  isCompliant,
  toPrint,
  onToggleCompliance,
  confirmationText,
  signature,
  signedAt,
  onSign,
}) => {
  const flightId = useFlightStore((state) => state.selectedFlight?.id);
  const { selectedDeliveryId, printDeliverySecurityDeclaration } =
    useDeliveryStore();

  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfSource, setPdfSource] = useState<any>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintDelivery = async () => {
    if (!flightId) {
      Alert.alert("Error", "Flight ID is missing.");
      return;
    }

    if (!selectedDeliveryId) {
      Alert.alert("Error", "No delivery selected to print.");
      return;
    }

    setIsPrinting(true);

    const result = await printDeliverySecurityDeclaration(
      flightId,
      selectedDeliveryId,
    );

    setIsPrinting(false);

    if (result.success && result.fileUrl) {
      setPdfSource({ uri: result.fileUrl, cache: true });
      setPdfVisible(true);
    } else {
      Alert.alert(
        "Print Failed",
        result.error || "Could not generate the Security Declaration PDF.",
      );
    }
  };

  return (
    <View className="flex-1 bg-bg-surface rounded-2xl border border-border-muted p-4">
      <PdfViewerModal
        visible={pdfVisible}
        onClose={() => setPdfVisible(false)}
        source={pdfSource}
      />

      <View className="flex-row justify-between items-center mb-4 border-b border-border-muted pb-2.5">
        <Text className="text-base text-text-secondary font-semibold max-w-[80%]">
          {title}
        </Text>
        <Checkbox
          checked={isCompliant || signature !== null}
          onChange={onToggleCompliance}
        />
      </View>

      <View className="flex-row mb-5">
        <View className="flex-1">
          <Text className="text-sm text-text-muted">{confirmationText}</Text>
        </View>

        {toPrint && (
          <TouchableOpacity onPress={handlePrintDelivery} disabled={isPrinting}>
            <View className="flex-row ml-2 items-center">
              {isPrinting ? (
                <ActivityIndicator
                  size="small"
                  color="#602AF3"
                  style={{ marginRight: 5 }}
                />
              ) : (
                <PrintIcon />
              )}
              <Text className="text-xl text-text-primary ml-1">
                {isPrinting ? "Printing..." : "Print"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-base text-text-secondary mb-1.5">
        Signature <Text className="text-red-500">*</Text>
      </Text>

      {signature ? (
        <View>
          <View className="h-[200px] border border-border-muted rounded-xl bg-bg-surface overflow-hidden mb-2">
            <Image
              source={{ uri: signature }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-text-tertiary text-xs">
              Signed: {signedAt ? formatDate(String(signedAt)) : "Pending Save"}
            </Text>

            <AppButton
              title="Update Signature"
              onPress={onSign}
              type="secondary"
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "var(--border-muted)",
              }}
              textStyle={{
                fontSize: 14,
                fontWeight: "500",
              }}
            />
          </View>
        </View>
      ) : (
        <Pressable
          className={`h-[250px] border-2 border-dashed rounded-xl justify-center items-center ${
            isCompliant
              ? "border-border-secondary bg-bg-tertiary"
              : "border-border-muted bg-bg-surface opacity-50"
          }`}
          onPress={onSign}
          disabled={!isCompliant}
        >
          <Text className="text-text-tertiary">
            {isCompliant
              ? "Click here to sign"
              : "Please check the box above to enable signing"}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
