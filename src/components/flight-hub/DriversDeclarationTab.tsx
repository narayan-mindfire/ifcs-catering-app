import React, { useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
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
    <ScrollView
      contentContainerStyle={{ flexDirection: "row", padding: 10, gap: 20 }}
    >
      {/* Form Section */}
      <View className="flex-1 bg-bg-surface rounded-2xl border border-border-muted p-4">
        <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">
          Driver*
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
          value={driverName}
          onChangeText={setDriverName}
          placeholder="Driver"
        />

        <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">
          RAIC #*
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
          value={raicNumber}
          onChangeText={setRaicNumber}
          placeholder="RAIC #"
        />

        <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">
          Truck Seal*
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
          value={truckSeal}
          onChangeText={setTruckSeal}
          placeholder="Truck Seal"
        />

        <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">
          Company*
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
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

export default DriversDeclarationTab;
