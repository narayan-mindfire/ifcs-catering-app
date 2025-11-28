import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SignatureModal } from "./SharedComponents";
import { SecurityCompliance } from "../../types/deliveries";
import { ComplianceSignatureCard } from "./ComplianceSignatureCard";

interface SecurityComplianceTabProps {
  securityCompliance: SecurityCompliance | null;
  onUpdateCompliance: (compliance: SecurityCompliance) => Promise<void>;
  onAddPreparer: (data: any) => void;
}

const SecurityComplianceTab: React.FC<SecurityComplianceTabProps> = ({
  securityCompliance,
  onUpdateCompliance,
}) => {
  const [isCompliant, setIsCompliant] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [raicNumber, setRaicNumber] = useState("");

  const [pendingSignature, setPendingSignature] = useState<string | null>(null);

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (securityCompliance) {
      setIsCompliant(securityCompliance.isCompliant);
      setFullName(securityCompliance.name || "");
      setRaicNumber(securityCompliance.raicNumber || "");
      setPendingSignature(securityCompliance.signature || null);
    } else {
      setIsCompliant(false);
      setFullName("");
      setRaicNumber("");
      setPendingSignature(null);
    }
    setHasChanges(false);
  }, [securityCompliance]);

  useEffect(() => {
    const originalName = securityCompliance?.name || "";
    const originalRaic = securityCompliance?.raicNumber || "";
    const originalSig = securityCompliance?.signature || null;
    const originalCompliant = securityCompliance?.isCompliant || false;

    const hasTextChanges =
      fullName !== originalName ||
      raicNumber !== originalRaic ||
      isCompliant !== originalCompliant;

    const hasSignatureChanges = pendingSignature !== originalSig;

    setHasChanges(hasTextChanges || hasSignatureChanges);
  }, [fullName, raicNumber, isCompliant, pendingSignature, securityCompliance]);

  const getUpdatedObject = (): SecurityCompliance => ({
    isCompliant,
    confirmationText: "I confirm that all security measures are compliant",
    signature: pendingSignature,
    signedAt: pendingSignature
      ? new Date()
      : securityCompliance?.signedAt || null,
    name: fullName,
    raicNumber: raicNumber,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateCompliance(getUpdatedObject());
    setIsSaving(false);
  };

  const handleToggleCompliance = (value: boolean) => {
    setIsCompliant(value);
  };

  const handleSaveSignature = (signature: string) => {
    setPendingSignature(signature);
    setShowSignatureModal(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexDirection: "row", padding: 10, gap: 20 }}
    >
      <View className="flex-1 bg-bg-surface rounded-2xl border border-border-muted p-4">
        <Text className="text-xl font-semibold text-text-primary mb-4">
          Security Representative Details
        </Text>

        <Text className="text-base text-text-secondary mb-1.5 mt-2.5">
          Name
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-base text-text-primary bg-bg-surface"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter name"
          placeholderTextColor="#A09CAB"
        />

        <Text className="text-base text-text-secondary mb-1.5 mt-2.5">
          RAIC #
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-base text-text-primary bg-bg-surface"
          value={raicNumber}
          onChangeText={setRaicNumber}
          placeholder="Enter RAIC number"
          placeholderTextColor="#A09CAB"
        />

        <Pressable
          onPress={handleSave}
          disabled={!hasChanges || isSaving}
          className={`mt-6 py-3 rounded-xl items-center ${
            !hasChanges || isSaving
              ? "bg-bg-tertiary opacity-50"
              : "bg-bg-button"
          }`}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              className={`font-semibold text-lg ${
                !hasChanges || isSaving
                  ? "text-text-tertiary"
                  : "text-text-surface"
              }`}
            >
              {hasChanges ? "Save Changes" : "No Changes to Save"}
            </Text>
          )}
        </Pressable>
      </View>

      <ComplianceSignatureCard
        title="Security Measures Compliance"
        isCompliant={isCompliant}
        onToggleCompliance={handleToggleCompliance}
        confirmationText="I confirm that all security measures are compliant"
        signature={pendingSignature ?? null}
        signedAt={securityCompliance?.signedAt ?? null}
        onSign={() => setShowSignatureModal(true)}
      />

      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSaveSignature}
        title="Security Compliance Signature"
      />
    </ScrollView>
  );
};

export default SecurityComplianceTab;
