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
}

const SecurityComplianceTab: React.FC<SecurityComplianceTabProps> = ({
  securityCompliance,
  onUpdateCompliance,
}) => {
  const [isCompliant, setIsCompliant] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const [provider, setProvider] = useState("");
  const [name, setName] = useState("");
  const [staffNumber, setStaffNumber] = useState("");
  const [position, setPosition] = useState("");

  const [pendingSignature, setPendingSignature] = useState<string | null>(null);

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (securityCompliance) {
      setIsCompliant(securityCompliance.isCompliant || false);
      setProvider(securityCompliance.provider || "");
      setName(securityCompliance.name || "");
      setStaffNumber(securityCompliance.staffNumber || "");
      setPosition(securityCompliance.position || "");
      setPendingSignature(securityCompliance.signature || null);
    } else {
      setIsCompliant(false);
      setProvider("");
      setName("");
      setStaffNumber("");
      setPosition("");
      setPendingSignature(null);
    }
    setHasChanges(false);
  }, [securityCompliance]);

  useEffect(() => {
    const originalProvider = securityCompliance?.provider || "";
    const originalName = securityCompliance?.name || "";
    const originalStaffNumber = securityCompliance?.staffNumber || "";
    const originalPosition = securityCompliance?.position || "";
    const originalSig = securityCompliance?.signature || null;
    const originalCompliant = securityCompliance?.isCompliant || false;

    const hasTextChanges =
      provider !== originalProvider ||
      name !== originalName ||
      staffNumber !== originalStaffNumber ||
      position !== originalPosition ||
      isCompliant !== originalCompliant;

    const hasSignatureChanges = pendingSignature !== originalSig;

    setHasChanges(hasTextChanges || hasSignatureChanges);
  }, [
    provider,
    name,
    staffNumber,
    position,
    isCompliant,
    pendingSignature,
    securityCompliance,
  ]);

  const getUpdatedObject = (): SecurityCompliance => ({
    isCompliant,
    provider,
    name,
    staffNumber,
    position,
    confirmationText: "I confirm that all security measures are compliant",
    signature: pendingSignature,
    signedAt: pendingSignature
      ? new Date()
      : securityCompliance?.signedAt || null,
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
          Provider:
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-base text-text-primary bg-bg-surface"
          value={provider}
          onChangeText={setProvider}
          placeholder="Enter provider"
          placeholderTextColor="#A09CAB"
        />

        <Text className="text-base text-text-secondary mb-1.5 mt-2.5">
          Security Name:
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-base text-text-primary bg-bg-surface"
          value={name}
          onChangeText={setName}
          placeholder="Enter security name"
          placeholderTextColor="#A09CAB"
        />

        <Text className="text-base text-text-secondary mb-1.5 mt-2.5">
          Staff Number:
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-base text-text-primary bg-bg-surface"
          value={staffNumber}
          onChangeText={setStaffNumber}
          placeholder="Enter staff number"
          placeholderTextColor="#A09CAB"
        />

        <Text className="text-base text-text-secondary mb-1.5 mt-2.5">
          Position:
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-base text-text-primary bg-bg-surface"
          value={position}
          onChangeText={setPosition}
          placeholder="Enter position"
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
        confirmationText="The in-flight supplies have gone through the following procedures: \n a. implemented appropriate measures to monitor the activities of staff preparing in-flight supplies(i.e, supervision/CCTV), so it will be preventive to insert prohibited items within a product.\n b. tamper - evident seals used to secure catering, carts and containers are affixed via trained and authorized person and checked against authorized documentation."
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
