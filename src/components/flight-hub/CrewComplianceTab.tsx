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
  onUpdateCompliance: (compliance: CrewCompliance) => void;
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
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // SYNC: Update state when props change
  useEffect(() => {
    if (crewCompliance) {
      setIsCompliant(crewCompliance.isCompliant);
      setFullName(crewCompliance.name || "");
      setRaicNumber(crewCompliance.raicNumber || "");
    } else {
      setIsCompliant(false);
      setFullName("");
      setRaicNumber("");
    }
    setHasChanges(false);
  }, [crewCompliance]);

  // Detect changes
  useEffect(() => {
    const changed =
      fullName !== (crewCompliance?.name || "") ||
      raicNumber !== (crewCompliance?.raicNumber || "") ||
      isCompliant !== (crewCompliance?.isCompliant || false);

    setHasChanges(changed);
  }, [fullName, raicNumber, isCompliant, crewCompliance]);

  // Helper to construct the full object for updates
  const getUpdatedObject = (
    overrides: Partial<CrewCompliance> = {},
  ): CrewCompliance => ({
    isCompliant,
    confirmationText:
      "I confirm that all CREW catering security measures are compliant",
    signature: crewCompliance?.signature || null,
    signedAt: crewCompliance?.signedAt || null,
    name: fullName,
    raicNumber: raicNumber,
    ...overrides,
  });

  // Save via PUT request
  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateCompliance(getUpdatedObject());
    setHasChanges(false);
    setIsSaving(false);
  };

  const handleToggleCompliance = (value: boolean) => {
    setIsCompliant(value);
    // REMOVED immediate save. Now waits for button press.
  };

  const handleSaveSignature = (signature: string) => {
    // Signatures still save immediately
    onUpdateCompliance(getUpdatedObject({ signature, signedAt: new Date() }));
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexDirection: "row", padding: 10, gap: 20 }}
    >
      {/* Form Section */}
      <View className="flex-1 bg-bg-surface rounded-2xl border border-border-muted p-4">
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

        {/* Save Button */}
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

      {/* Signature Section */}
      <ComplianceSignatureCard
        title="CREW Catering Security Measures Compliance"
        isCompliant={isCompliant}
        onToggleCompliance={handleToggleCompliance}
        confirmationText="I confirm that all CREW catering security measures are compliant"
        signature={crewCompliance?.signature ?? null}
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
