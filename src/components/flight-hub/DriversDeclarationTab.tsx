import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { SignatureModal } from "./SharedComponents";
import { DriversDeclaration } from "../../types/deliveries";
import { ComplianceSignatureCard } from "./ComplianceSignatureCard";

interface DriversDeclarationTabProps {
  driversDeclaration: DriversDeclaration | null;
  onUpdateDeclaration: (declaration: DriversDeclaration) => void;
}

const DriversDeclarationTab: React.FC<DriversDeclarationTabProps> = ({
  driversDeclaration,
  onUpdateDeclaration,
}) => {
  const [driverName, setDriverName] = useState(
    driversDeclaration?.driverName ?? "",
  );
  const [raicNumber, setRaicNumber] = useState(
    driversDeclaration?.raicNumber ?? "",
  );
  const [truckSeal, setTruckSeal] = useState(
    driversDeclaration?.truckSeal ?? "",
  );
  const [company, setCompany] = useState(driversDeclaration?.company ?? "");
  const [sealIntact, setSealIntact] = useState(
    driversDeclaration?.sealIntact ?? false,
  );
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const handleSaveSignature = (signature: string) => {
    onUpdateDeclaration({
      driverName,
      raicNumber,
      truckSeal,
      company,
      sealIntact,
      confirmationText: "I (the driver) confirm the SEAL is intact",
      signature,
      signedAt: new Date(),
    });
  };

  const handleToggleSealIntact = (value: boolean) => {
    setSealIntact(value);
    if (driversDeclaration)
      onUpdateDeclaration({ ...driversDeclaration, sealIntact: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Form Section */}
      <View style={styles.card}>
        <Text style={styles.label}>Driver*</Text>
        <TextInput
          style={styles.input}
          value={driverName}
          onChangeText={setDriverName}
          placeholder="Driver"
        />

        <Text style={styles.label}>RAIC #*</Text>
        <TextInput
          style={styles.input}
          value={raicNumber}
          onChangeText={setRaicNumber}
          placeholder="RAIC #"
        />

        <Text style={styles.label}>Truck Seal*</Text>
        <TextInput
          style={styles.input}
          value={truckSeal}
          onChangeText={setTruckSeal}
          placeholder="Truck Seal"
        />

        <Text style={styles.label}>Company*</Text>
        <TextInput
          style={styles.input}
          value={company}
          onChangeText={setCompany}
          placeholder="Company"
        />
      </View>

      <ComplianceSignatureCard
        title="Security Seal is Intact"
        isCompliant={sealIntact}
        onToggleCompliance={handleToggleSealIntact}
        confirmationText="I (the driver) confirm the SEAL is intact"
        signature={driversDeclaration?.signature ?? null}
        signedAt={driversDeclaration?.signedAt ?? null}
        onSign={() => setShowSignatureModal(true)}
      />

      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSaveSignature}
        title="Driver's Declaration Signature"
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
  sectionTitle: { fontSize: 18, color: "#4F4B58", fontWeight: "600" },
  label: { fontSize: 18, color: "#4F4B58", marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#EAE9EC",
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    color: "#27262C",
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 12,
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
    fontSize: 18,
    marginRight: 10,
    fontWeight: "bold",
  },
  confirmationText: { fontSize: 18, color: "#27262C", flex: 1 },
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

export default DriversDeclarationTab;
