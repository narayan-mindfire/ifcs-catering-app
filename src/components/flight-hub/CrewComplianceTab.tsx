import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

import { CrewCompliance } from "../../types/deliveries";
import { AppButton } from "../common/AppButton";
import { ComplianceSignatureCard } from "./ComplianceSignatureCard";
import { SignatureModal } from "./SharedComponents";

interface CrewComplianceTabProps {
  crewCompliance: CrewCompliance | null;
  onUpdateCompliance: (compliance: CrewCompliance) => Promise<void>;
}

const CrewComplianceTab: React.FC<CrewComplianceTabProps> = ({
  crewCompliance,
  onUpdateCompliance,
}) => {
  const [isCompliant, setIsCompliant] = useState(false);

  const [airCrewRepresentative, setAirCrewRepresentative] = useState("");
  const [crewName, setCrewName] = useState("");
  const [staffNumber, setStaffNumber] = useState("");

  const [pendingSignature, setPendingSignature] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (crewCompliance) {
      setIsCompliant(crewCompliance.isCompliant || false);
      setAirCrewRepresentative(crewCompliance.airCrewRepresentative || "");
      setCrewName(crewCompliance.crewName || "");
      setStaffNumber(crewCompliance.staffNumber || "");
      setPendingSignature(crewCompliance.signature || null);
    } else {
      setIsCompliant(false);
      setAirCrewRepresentative("");
      setCrewName("");
      setStaffNumber("");
      setPendingSignature(null);
    }
    setHasChanges(false);
  }, [crewCompliance]);

  useEffect(() => {
    const changed =
      isCompliant !== (crewCompliance?.isCompliant ?? false) ||
      airCrewRepresentative !== (crewCompliance?.airCrewRepresentative ?? "") ||
      crewName !== (crewCompliance?.crewName ?? "") ||
      staffNumber !== (crewCompliance?.staffNumber ?? "") ||
      pendingSignature !== (crewCompliance?.signature ?? null);

    setHasChanges(changed);
  }, [
    isCompliant,
    airCrewRepresentative,
    crewName,
    staffNumber,
    pendingSignature,
    crewCompliance,
  ]);

  const handleSave = async () => {
    setIsSaving(true);

    await onUpdateCompliance({
      isCompliant,
      confirmationText:
        "In-flight supplies have been loaded into the aircraft in secure condition, and all seals are in secure condition",
      signature: pendingSignature,
      signedAt: pendingSignature
        ? new Date()
        : crewCompliance?.signedAt || null,

      airCrewRepresentative,
      crewName,
      staffNumber,
    });

    setIsSaving(false);
    setHasChanges(false);
  };

  const handleSaveSignature = (signature: string) => {
    setPendingSignature(signature);
    setShowSignatureModal(false);
  };

  // Validation Logic
  // ALL fields are mandatory here
  const isFormValid =
    airCrewRepresentative.trim() !== "" &&
    crewName.trim() !== "" &&
    staffNumber.trim() !== "" &&
    pendingSignature !== null;

  return (
    <ScrollView
      contentContainerStyle={{ flexDirection: "row", padding: 10, gap: 20 }}
    >
      <View className="flex-1 flex-col justify-between bg-bg-surface rounded-2xl border border-border-muted p-4">
        <View>
          <Text className="text-xl font-semibold text-text-primary mb-4">
            Crew Member Details
          </Text>

          <Text className="text-sm text-text-secondary mb-1.5 mt-2.5">
            Air Crew Representative Name <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
            value={airCrewRepresentative}
            onChangeText={setAirCrewRepresentative}
            placeholder="Enter air crew representative name"
            placeholderTextColor="#A09CAB"
          />

          <Text className="text-sm text-text-secondary mb-1.5 mt-2.5">
            Crew Name <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
            value={crewName}
            onChangeText={setCrewName}
            placeholder="Enter crew name"
            placeholderTextColor="#A09CAB"
          />

          <Text className="text-sm text-text-secondary mb-1.5 mt-2.5">
            Staff Number <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
            value={staffNumber}
            onChangeText={setStaffNumber}
            placeholder="Enter staff number"
            placeholderTextColor="#A09CAB"
          />
        </View>

        <View>
          <AppButton
            title={hasChanges ? "Save Changes" : "No Changes to Save"}
            onPress={handleSave}
            loading={isSaving}
            disabled={!hasChanges || !isFormValid}
            type={!hasChanges || !isFormValid ? "secondary" : "primary"}
            style={{
              marginTop: 24,
              borderRadius: 12,
              paddingVertical: 12,
              opacity: !hasChanges || !isFormValid ? 0.5 : 1,
            }}
            textStyle={{
              fontSize: 18,
              fontWeight: "600",
              color: !hasChanges || !isFormValid ? undefined : "#fff",
            }}
          />

          {!hasChanges && crewName && (
            <View className="mt-4 p-3 bg-bg-accent rounded-lg border border-bg-primary">
              <Text className="text-sm text-text-primary text-center font-medium">
                ✓ Information Synced
              </Text>
            </View>
          )}
        </View>
      </View>

      <ComplianceSignatureCard
        title="CREW Catering Security Measures Compliance"
        isCompliant={isCompliant}
        onToggleCompliance={setIsCompliant}
        confirmationText="In-flight supplies have been loaded into the aircraft in secure condition, and all seals are in secure condition"
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
