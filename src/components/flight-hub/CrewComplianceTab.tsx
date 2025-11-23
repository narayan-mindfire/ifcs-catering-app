import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { SignatureModal } from "./SharedComponents";
import { CrewCompliance } from "../../types/deliveries";
import { ComplianceSignatureCard } from "./ComplianceSignatureCard";

interface CrewComplianceTabProps {
  crewCompliance: CrewCompliance | null;
  onUpdateCompliance: (compliance: CrewCompliance) => void;
  onAddPreparer: (preparer: {
    fullName: string;
    raicNumber: string;
    note?: string;
  }) => void;
}

const CrewComplianceTab: React.FC<CrewComplianceTabProps> = ({
  crewCompliance,
  onUpdateCompliance,
  onAddPreparer,
}) => {
  const [isCompliant, setIsCompliant] = useState(
    crewCompliance?.isCompliant ?? false,
  );
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const [fullName, setFullName] = useState("");
  const [raicNumber, setRaicNumber] = useState("");
  const [note, setNote] = useState("");

  const handleToggleCompliance = (value: boolean) => {
    setIsCompliant(value);
    if (crewCompliance) {
      onUpdateCompliance({ ...crewCompliance, isCompliant: value });
    } else {
      onUpdateCompliance({
        isCompliant: value,
        confirmationText:
          "I confirm that all CREW catering security measures are compliant",
        signature: null,
        signedAt: null,
      });
    }
  };

  const handleSaveSignature = (signature: string) => {
    onUpdateCompliance({
      isCompliant,
      confirmationText:
        "I confirm that all CREW catering security measures are compliant",
      signature,
      signedAt: new Date(),
    });
  };

  const handleAddPreparer = () => {
    if (!fullName.trim() || !raicNumber.trim()) return;
    onAddPreparer({
      fullName: fullName.trim(),
      raicNumber: raicNumber.trim(),
      note: note.trim() || undefined,
    });
    setFullName("");
    setRaicNumber("");
    setNote("");
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexDirection: "row", padding: 10, gap: 20 }}
    >
      <View className="flex-1 bg-bg-surface rounded-2xl border border-border-muted p-4">
        <Text className="text-lg text-text-secondary mb-3 font-semibold">
          Additional Requirement for Flight to the USA
        </Text>

        <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">Name</Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter Name"
        />

        <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">
          RAIC #
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
          value={raicNumber}
          onChangeText={setRaicNumber}
          placeholder="RAIC #"
        />

        <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">Note</Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface h-20"
          style={{ textAlignVertical: "top" }}
          value={note}
          onChangeText={setNote}
          placeholder="Enter note"
          multiline
        />

        <Pressable
          onPress={handleAddPreparer}
          className={`p-3 rounded-xl items-center mt-5 ${
            !fullName.trim() || !raicNumber.trim()
              ? "bg-bg-secondary"
              : "bg-bg-button"
          }`}
          disabled={!fullName.trim() || !raicNumber.trim()}
        >
          <Text className="text-text-surface font-semibold">Add</Text>
        </Pressable>
      </View>

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
        title="Signature"
      />
    </ScrollView>
  );
};

export default CrewComplianceTab;
