import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { SignatureModal, Checkbox } from "./SharedComponents";
import { SecurityCompliance } from "../../types/deliveries";
import { ComplianceSignatureCard } from "./ComplianceSignatureCard";

interface SecurityComplianceTabProps {
  securityCompliance: SecurityCompliance | null;
  onUpdateCompliance: (compliance: SecurityCompliance) => void;
  onAddPreparer: (preparer: {
    fullName: string;
    type: "Airline Representative" | "Third Party Security Guard";
    raicNumber: string;
    note?: string;
  }) => void;
}

const SecurityComplianceTab: React.FC<SecurityComplianceTabProps> = ({
  securityCompliance,
  onUpdateCompliance,
  onAddPreparer,
}) => {
  const [isCompliant, setIsCompliant] = useState(
    securityCompliance?.isCompliant ?? false,
  );
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const [selectedType, setSelectedType] = useState<
    "Airline Representative" | "Third Party Security Guard"
  >("Airline Representative");
  const [fullName, setFullName] = useState("");
  const [raicNumber, setRaicNumber] = useState("");
  const [note, setNote] = useState("");

  const handleToggleCompliance = (value: boolean) => {
    setIsCompliant(value);
    if (securityCompliance) {
      onUpdateCompliance({ ...securityCompliance, isCompliant: value });
    } else {
      onUpdateCompliance({
        isCompliant: value,
        confirmationText: "I confirm that all security measures are compliant",
        signature: null,
        signedAt: null,
      });
    }
  };

  const handleSaveSignature = (signature: string) => {
    onUpdateCompliance({
      isCompliant,
      confirmationText: "I confirm that all security measures are compliant",
      signature,
      signedAt: new Date(),
    });
  };

  const handleAddPreparer = () => {
    if (!fullName.trim() || !raicNumber.trim()) return;
    onAddPreparer({
      fullName: fullName.trim(),
      type: selectedType,
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

        <View className="flex-row flex-wrap gap-4 mb-4">
          <Checkbox
            checked={selectedType === "Airline Representative"}
            onChange={() => setSelectedType("Airline Representative")}
            label="Airline Representative"
          />
          <Checkbox
            checked={selectedType === "Third Party Security Guard"}
            onChange={() => setSelectedType("Third Party Security Guard")}
            label="Third Party Security Guard"
          />
        </View>

        <Text className="text-base text-text-secondary mb-1.5 mt-2.5">
          Name
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-base text-text-primary bg-bg-surface"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter Name"
        />

        <Text className="text-base text-text-secondary mb-1.5 mt-2.5">
          RAIC #
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-base text-text-primary bg-bg-surface"
          value={raicNumber}
          onChangeText={setRaicNumber}
          placeholder="RAIC #"
        />

        <Text className="text-base text-text-secondary mb-1.5 mt-2.5">
          Note
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-base text-text-primary bg-bg-surface h-20"
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
        title="Security Measures Compliance"
        isCompliant={isCompliant}
        onToggleCompliance={handleToggleCompliance}
        confirmationText="I confirm that all security measures are compliant"
        signature={securityCompliance?.signature ?? null}
        signedAt={securityCompliance?.signedAt ?? null}
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

export default SecurityComplianceTab;
