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
import { DriversDeclaration } from "../../types/deliveries";
import { ComplianceSignatureCard } from "./ComplianceSignatureCard";

interface DriversDeclarationTabProps {
  driversDeclaration: DriversDeclaration | null;
  onUpdateDeclaration: (declaration: DriversDeclaration) => Promise<void>;
}

const DriversDeclarationTab: React.FC<DriversDeclarationTabProps> = ({
  driversDeclaration,
  onUpdateDeclaration,
}) => {
  const [driverName, setDriverName] = useState("");
  const [raicNumber, setRaicNumber] = useState("");
  const [truckSeal, setTruckSeal] = useState("");
  const [company, setCompany] = useState("");
  const [sealIntact, setSealIntact] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const [pendingSignature, setPendingSignature] = useState<string | null>(null);

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (driversDeclaration) {
      setDriverName(driversDeclaration.driverName || "");
      setRaicNumber(driversDeclaration.raicNumber || "");
      setTruckSeal(driversDeclaration.truckSeal || "");
      setCompany(driversDeclaration.company || "");
      setSealIntact(driversDeclaration.sealIntact || false);
      setPendingSignature(driversDeclaration.signature || null);
    } else {
      setDriverName("");
      setRaicNumber("");
      setTruckSeal("");
      setCompany("");
      setSealIntact(false);
      setPendingSignature(null);
    }
    setHasChanges(false);
  }, [driversDeclaration]);

  useEffect(() => {
    const originalSig = driversDeclaration?.signature || null;

    const changed =
      driverName !== (driversDeclaration?.driverName || "") ||
      raicNumber !== (driversDeclaration?.raicNumber || "") ||
      truckSeal !== (driversDeclaration?.truckSeal || "") ||
      company !== (driversDeclaration?.company || "") ||
      sealIntact !== (driversDeclaration?.sealIntact || false) ||
      pendingSignature !== originalSig;

    setHasChanges(changed);
  }, [
    driverName,
    raicNumber,
    truckSeal,
    company,
    sealIntact,
    pendingSignature,
    driversDeclaration,
  ]);

  const handleSave = async () => {
    setIsSaving(true);

    await onUpdateDeclaration({
      driverName,
      raicNumber,
      truckSeal,
      company,
      sealIntact,
      confirmationText: "I (the driver) confirm the SEAL is intact",
      signature: pendingSignature,
      signedAt: pendingSignature
        ? new Date()
        : driversDeclaration?.signedAt || null,
    });

    setHasChanges(false);
    setIsSaving(false);
  };

  const handleSaveSignature = (signature: string) => {
    setPendingSignature(signature);
    setShowSignatureModal(false);
  };

  const handleToggleSealIntact = (value: boolean) => {
    setSealIntact(value);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexDirection: "row", padding: 10, gap: 20 }}
    >
      <View className="flex-1 flex-col justify-between bg-bg-surface rounded-2xl border border-border-muted p-4">
        <View>
          <Text className="text-xl font-semibold text-text-primary mb-4">
            Driver Information
          </Text>

          <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">
            Driver Name*
          </Text>
          <TextInput
            className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
            value={driverName}
            onChangeText={setDriverName}
            placeholder="Enter driver name"
            placeholderTextColor="#A09CAB"
          />

          <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">
            RAIC #*
          </Text>
          <TextInput
            className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
            value={raicNumber}
            onChangeText={setRaicNumber}
            placeholder="Enter RAIC number"
            placeholderTextColor="#A09CAB"
          />

          <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">
            Truck Seal*
          </Text>
          <TextInput
            className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
            value={truckSeal}
            onChangeText={setTruckSeal}
            placeholder="Enter truck seal ID"
            placeholderTextColor="#A09CAB"
          />

          <Text className="text-lg text-text-secondary mb-1.5 mt-2.5">
            Company*
          </Text>
          <TextInput
            className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
            value={company}
            onChangeText={setCompany}
            placeholder="Enter company name"
            placeholderTextColor="#A09CAB"
          />
        </View>

        <View>
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

          {!hasChanges && driversDeclaration?.driverName && (
            <View className="mt-4 p-3 bg-bg-accent rounded-lg border border-bg-primary">
              <Text className="text-sm text-text-primary text-center font-medium">
                ✓ Information Synced
              </Text>
            </View>
          )}
        </View>
      </View>
      <ComplianceSignatureCard
        title="Security Seal is Intact"
        isCompliant={sealIntact}
        onToggleCompliance={handleToggleSealIntact}
        confirmationText="I (the driver) confirm the SEAL is intact"
        signature={pendingSignature ?? null}
        signedAt={driversDeclaration?.signedAt ?? null}
        onSign={() => setShowSignatureModal(true)}
      />

      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSaveSignature}
        title="Driver's Compliance Signature"
      />
    </ScrollView>
  );
};

export default DriversDeclarationTab;
