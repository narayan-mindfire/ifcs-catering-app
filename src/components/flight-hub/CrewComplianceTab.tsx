import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Additional Requirement for Flight to the USA
        </Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter Name"
        />

        <Text style={styles.label}>RAIC #</Text>
        <TextInput
          style={styles.input}
          value={raicNumber}
          onChangeText={setRaicNumber}
          placeholder="RAIC #"
        />

        <Text style={styles.label}>Note</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          value={note}
          onChangeText={setNote}
          placeholder="Enter note"
          multiline
        />

        <Pressable
          onPress={handleAddPreparer}
          style={[
            styles.button,
            !fullName.trim() || !raicNumber.trim()
              ? styles.buttonDisabled
              : null,
          ]}
          disabled={!fullName.trim() || !raicNumber.trim()}
        >
          <Text style={styles.buttonText}>Add</Text>
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

const styles = StyleSheet.create({
  container: { flexDirection: "row", padding: 10, gap: 20 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAE9EC",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#4F4B58",
    marginBottom: 12,
    fontWeight: "600",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  label: { fontSize: 16, color: "#4F4B58", marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#EAE9EC",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#27262C",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#602AF3",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: { backgroundColor: "#dfdddd" },
  buttonText: { color: "#fff", fontWeight: "600" },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE9EC",
    paddingBottom: 10,
  },
  confirmationBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAE9EC",
    marginBottom: 20,
  },
  checkboxMark: {
    color: "#602AF3",
    fontSize: 16,
    marginRight: 10,
    fontWeight: "bold",
  },
  confirmationText: { fontSize: 16, color: "#27262C", flex: 1 },

  signatureDisplay: {
    height: 150,
    borderWidth: 1,
    borderColor: "#EAE9EC",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  signatureImage: { width: "100%", height: "100%" },
  signaturePlaceholder: {
    height: 150,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#c1c2c3",
    borderRadius: 12,
    backgroundColor: "#dfdddd",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: "#A09CAB" },
  timestamp: {
    textAlign: "right",
    color: "#A09CAB",
    fontSize: 14,
    marginTop: 4,
  },
});

export default CrewComplianceTab;
