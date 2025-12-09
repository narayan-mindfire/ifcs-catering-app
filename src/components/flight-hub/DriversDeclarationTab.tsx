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
  const [driver, setDriver] = useState("");
  const [staffID, setStaffID] = useState("");
  const [truckSeal, setTruckSeal] = useState("");
  const [company, setCompany] = useState("");
  const [sealIntact, setSealIntact] = useState(false);

  const [pendingSignature, setPendingSignature] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (driversDeclaration) {
      setDriver(driversDeclaration.driverName || "");
      setStaffID(driversDeclaration.driverStaffId || "");
      setTruckSeal(driversDeclaration.truckSeal || "");
      setCompany(driversDeclaration.driverCompany || "");
      setSealIntact(driversDeclaration.sealIntact || false);
      setPendingSignature(driversDeclaration.signature || null);
    } else {
      setDriver("");
      setStaffID("");
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
      driver !== (driversDeclaration?.driverName || "") ||
      staffID !== (driversDeclaration?.driverStaffId || "") ||
      truckSeal !== (driversDeclaration?.truckSeal || "") ||
      company !== (driversDeclaration?.driverCompany || "") ||
      sealIntact !== (driversDeclaration?.sealIntact || false) ||
      pendingSignature !== originalSig;

    setHasChanges(changed);
  }, [
    driver,
    staffID,
    truckSeal,
    company,
    sealIntact,
    pendingSignature,
    driversDeclaration,
  ]);

  const handleSave = async () => {
    setIsSaving(true);

    await onUpdateDeclaration({
      driverName: driver,
      driverStaffId: staffID,
      truckSeal: truckSeal,
      driverCompany: company,
      sealIntact: sealIntact,
      confirmationText: "The driver confirms the seal is intact.",
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

  // Validation Logic
  const isFormValid =
    driver.trim() !== "" &&
    staffID.trim() !== "" &&
    // truckSeal.trim() !== "" &&
    // company.trim() !== "" &&
    pendingSignature !== null;

  return (
    <ScrollView
      contentContainerStyle={{ flexDirection: "row", padding: 10, gap: 20 }}
    >
      <View className="flex-1 bg-bg-surface rounded-2xl border border-border-muted p-4">
        <Text className="text-xl font-semibold text-text-primary mb-4">
          Driver Information
        </Text>

        <Text className="text-sm text-text-secondary mb-1.5 mt-2.5">
          Driver Name <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
          value={driver}
          onChangeText={setDriver}
          placeholder="Enter driver name"
          placeholderTextColor="#A09CAB"
        />

        <Text className="text-sm text-text-secondary mb-1.5 mt-2.5">
          Staff ID <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
          value={staffID}
          onChangeText={setStaffID}
          placeholder="Enter staff ID"
          placeholderTextColor="#A09CAB"
        />

        <Text className="text-sm text-text-secondary mb-1.5 mt-2.5">
          Truck Seal
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
          value={truckSeal}
          onChangeText={setTruckSeal}
          placeholder="Enter truck seal ID"
          placeholderTextColor="#A09CAB"
        />

        <Text className="text-sm text-text-secondary mb-1.5 mt-2.5">
          Company
        </Text>
        <TextInput
          className="border border-border-muted rounded-xl p-3 text-lg text-text-primary bg-bg-surface"
          value={company}
          onChangeText={setCompany}
          placeholder="Enter company name"
          placeholderTextColor="#A09CAB"
        />

        <Pressable
          onPress={handleSave}
          disabled={!hasChanges || isSaving || !isFormValid}
          className={`mt-6 py-3 rounded-xl items-center ${
            !hasChanges || isSaving || !isFormValid
              ? "bg-bg-tertiary opacity-50"
              : "bg-bg-button"
          }`}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              className={`font-semibold text-lg ${
                !hasChanges || isSaving || !isFormValid
                  ? "text-text-tertiary"
                  : "text-text-surface"
              }`}
            >
              {hasChanges ? "Save Changes" : "No Changes to Save"}
            </Text>
          )}
        </Pressable>

        {!hasChanges && driver && (
          <View className="mt-4 p-3 bg-bg-accent rounded-lg border border-bg-primary">
            <Text className="text-sm text-text-primary text-center font-medium">
              ✓ Information Synced
            </Text>
          </View>
        )}
      </View>

      <ComplianceSignatureCard
        title="Security Seal is Intact"
        toPrint={true}
        isCompliant={sealIntact}
        onToggleCompliance={handleToggleSealIntact}
        confirmationText={
          "I certify that:\n" +
          "a. The security of in-flight supplies has been maintained during transfer.\n" +
          "b. Supplies were loaded in secure condition and handed over properly."
        }
        signature={pendingSignature}
        signedAt={driversDeclaration?.signedAt || null}
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
