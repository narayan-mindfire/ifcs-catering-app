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
  onUpdateCompliance: (compliance: SecurityCompliance) => void;
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
  const [tempSignature, setTempSignature] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with props
  useEffect(() => {
    if (securityCompliance) {
      const hasData = securityCompliance.name || securityCompliance.raicNumber;
      setIsCompliant(hasData ? true : securityCompliance.isCompliant);
      setFullName(securityCompliance.name || "");
      setRaicNumber(securityCompliance.raicNumber || "");
      setTempSignature(securityCompliance.signature || null);
    } else {
      setIsCompliant(false);
      setFullName("");
      setRaicNumber("");
      setTempSignature(null);
    }
    setHasChanges(false);
  }, [securityCompliance]);

  // Detect changes (including signature changes)
  useEffect(() => {
    const changed =
      fullName !== (securityCompliance?.name || "") ||
      raicNumber !== (securityCompliance?.raicNumber || "") ||
      isCompliant !== (securityCompliance?.isCompliant || false) ||
      tempSignature !== (securityCompliance?.signature || null);

    setHasChanges(changed);
  }, [fullName, raicNumber, isCompliant, tempSignature, securityCompliance]);

  const getUpdatedObject = (): SecurityCompliance => ({
    isCompliant,
    confirmationText: "I confirm that all security measures are compliant",
    signature: tempSignature,
    signedAt:
      tempSignature && tempSignature !== securityCompliance?.signature
        ? new Date()
        : securityCompliance?.signedAt || null,
    name: fullName,
    raicNumber: raicNumber,
  });

  // Save via PUT request - includes signature
  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateCompliance(getUpdatedObject());
    setHasChanges(false);
    setIsSaving(false);
  };

  const handleToggleCompliance = (value: boolean) => {
    setIsCompliant(value);
  };

  const handleSaveSignature = (signature: string) => {
    // Store signature temporarily without making API call
    setTempSignature(signature);
  };

  const handleOpenSignatureModal = () => {
    if (!isCompliant) {
      // Could show an alert here
      return;
    }
    setShowSignatureModal(true);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexDirection: "row", padding: 10, gap: 20 }}
    >
      <View className="flex-1 flex-col justify-between bg-bg-surface rounded-2xl border border-border-muted p-4">
        <View>
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
        </View>
        <View>
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

          {!hasChanges && fullName && (
            <View className="mt-4 p-3 bg-bg-accent rounded-lg border border-bg-primary">
              <Text className="text-sm text-text-primary text-center font-medium">
                ✓ Information Synced
              </Text>
            </View>
          )}
        </View>
      </View>

      <ComplianceSignatureCard
        title="Security Measures Compliance"
        isCompliant={isCompliant}
        onToggleCompliance={handleToggleCompliance}
        confirmationText="I confirm that all security measures are compliant"
        signature={tempSignature}
        signedAt={securityCompliance?.signedAt ?? null}
        onSign={handleOpenSignatureModal}
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
