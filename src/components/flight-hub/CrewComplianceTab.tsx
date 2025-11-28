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
import { CrewCompliance } from "../../types/deliveries";
import { ComplianceSignatureCard } from "./ComplianceSignatureCard";

interface CrewComplianceTabProps {
  crewCompliance: CrewCompliance | null;
  onUpdateCompliance: (compliance: CrewCompliance) => Promise<void>;
  onAddPreparer: (data: any) => void;
}

const CrewComplianceTab: React.FC<CrewComplianceTabProps> = ({
  crewCompliance,
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
    if (crewCompliance) {
      setIsCompliant(crewCompliance.isCompliant);
      setFullName(crewCompliance.name || "");
      setRaicNumber(crewCompliance.raicNumber || "");
      setPendingSignature(crewCompliance.signature || null);
    } else {
      setIsCompliant(false);
      setFullName("");
      setRaicNumber("");
      setPendingSignature(null);
    }
    setHasChanges(false);
  }, [crewCompliance]);

  useEffect(() => {
    const originalName = crewCompliance?.name || "";
    const originalRaic = crewCompliance?.raicNumber || "";
    const originalSig = crewCompliance?.signature || null;
    const originalCompliant = crewCompliance?.isCompliant || false;

    const hasTextChanges =
      fullName !== originalName ||
      raicNumber !== originalRaic ||
      isCompliant !== originalCompliant;

    const hasSignatureChanges = pendingSignature !== originalSig;

    setHasChanges(hasTextChanges || hasSignatureChanges);
  }, [fullName, raicNumber, isCompliant, pendingSignature, crewCompliance]);

  const getUpdatedObject = (
    overrides: Partial<CrewCompliance> = {},
  ): CrewCompliance => ({
    isCompliant,
    confirmationText:
      "I confirm that all CREW catering security measures are compliant",
    signature: pendingSignature,
    signedAt: pendingSignature ? new Date() : crewCompliance?.signedAt || null,
    name: fullName,
    raicNumber: raicNumber,
    ...overrides,
  });

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
    setPendingSignature(signature);
    setShowSignatureModal(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexDirection: "row", padding: 10, gap: 20 }}
    >
      <View className="flex-1 flex-col justify-between bg-bg-surface rounded-2xl border border-border-muted p-4">
        <View>
          <Text className="text-xl font-semibold text-text-primary mb-4">
            Crew Member Details
          </Text>

          <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">
            Crew Member Name
          </Text>
          <TextInput
            className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter crew member name"
            placeholderTextColor="#A09CAB"
          />

          <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">
            RAIC #
          </Text>
          <TextInput
            className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
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
        </View>

        {!hasChanges && fullName && (
          <View className="mt-4 p-3 bg-bg-accent rounded-lg border border-bg-primary">
            <Text className="text-sm text-text-primary text-center font-medium">
              ✓ Information Synced
            </Text>
          </View>
        )}
      </View>

      <ComplianceSignatureCard
        title="CREW Catering Security Measures Compliance"
        isCompliant={isCompliant}
        onToggleCompliance={handleToggleCompliance}
        confirmationText="I confirm that all CREW catering security measures are compliant"
        signature={pendingSignature ?? null}
        signedAt={crewCompliance?.signedAt ?? null}
        onSign={() => setShowSignatureModal(true)}
      />

      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSaveSignature}
        title="Crew Compliance Signature"
      />
    </ScrollView>
  );
};

export default CrewComplianceTab;
