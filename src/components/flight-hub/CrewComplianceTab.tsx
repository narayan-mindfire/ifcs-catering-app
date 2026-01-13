import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

import {
  CrewComplianceSchema,
  crewComplianceSchema,
} from "../../schemas/deliverySchemas";
import { CrewCompliance } from "../../types/deliveries";
import { AppButton } from "../common/AppButton";
import { FormInput } from "../common/FormInput"; // Import reusable input
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
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Initialize React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm<CrewComplianceSchema>({
    resolver: zodResolver(crewComplianceSchema),
    mode: "onChange", // Validate as user types
    defaultValues: {
      airCrewRepresentative: "",
      crewName: "",
      staffNumber: "",
      signature: "",
      isCompliant: false,
    },
  });

  // Watch values needed for UI logic (like toggling compliance card)
  const isCompliant = watch("isCompliant");
  const signature = watch("signature");

  // 2. Sync Props to Form State
  useEffect(() => {
    if (crewCompliance) {
      reset({
        airCrewRepresentative: crewCompliance.airCrewRepresentative || "",
        crewName: crewCompliance.crewName || "",
        staffNumber: crewCompliance.staffNumber || "",
        signature: crewCompliance.signature || "",
        isCompliant: crewCompliance.isCompliant || false,
      });
    } else {
      reset({
        airCrewRepresentative: "",
        crewName: "",
        staffNumber: "",
        signature: "",
        isCompliant: false,
      });
    }
  }, [crewCompliance, reset]);

  const onSubmit = async (data: CrewComplianceSchema) => {
    setIsSaving(true);
    await onUpdateCompliance({
      isCompliant: data.isCompliant,
      confirmationText:
        "I certify that:\n\n a.In-flight supplies have been loaded into the aircraft in secure condition, and all seals are in secure condition",
      signature: data.signature,
      signedAt:
        data.signature !== crewCompliance?.signature
          ? new Date()
          : crewCompliance?.signedAt || null,
      airCrewRepresentative: data.airCrewRepresentative,
      crewName: data.crewName,
      staffNumber: data.staffNumber,
    });
    reset(data);
    setIsSaving(false);
  };

  const handleSaveSignature = (sig: string) => {
    setValue("signature", sig, { shouldValidate: true, shouldDirty: true });
    setShowSignatureModal(false);
  };

  const handleToggleCompliance = (val: boolean) => {
    setValue("isCompliant", val, { shouldValidate: true, shouldDirty: true });
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

          {/* Reusable Form Inputs */}
          <FormInput
            control={control}
            name="airCrewRepresentative"
            label="Air Crew Representative Name"
            placeholder="Enter air crew representative name"
            required
          />

          <FormInput
            control={control}
            name="crewName"
            label="Crew Name"
            placeholder="Enter crew name"
            required
          />

          <FormInput
            control={control}
            name="staffNumber"
            label="Staff Number"
            placeholder="Enter staff number"
            required
          />
        </View>

        <View>
          <AppButton
            title={isDirty ? "Save Changes" : "No Changes to Save"}
            onPress={handleSubmit(onSubmit)}
            loading={isSaving}
            disabled={!isDirty || !isValid}
            type={!isDirty || !isValid ? "secondary" : "primary"}
            style={{
              marginTop: 24,
              borderRadius: 12,
              paddingVertical: 12,
              opacity: !isDirty || !isValid ? 0.5 : 1,
            }}
            textStyle={{
              fontSize: 18,
              fontWeight: "600",
              color: !isDirty || !isValid ? undefined : "#fff",
            }}
          />

          {!isDirty && crewCompliance?.crewName && (
            <View className="mt-4 p-3 bg-bg-accent rounded-lg border border-bg-primary">
              <Text className="text-sm text-text-primary text-center font-medium">
                ✓ Information Synced
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-1">
        <ComplianceSignatureCard
          title="CREW Catering Security Measures Compliance"
          isCompliant={isCompliant || false}
          onToggleCompliance={handleToggleCompliance}
          confirmationText={
            "I certify that:\na. In-flight supplies have been loaded into the aircraft in secure condition, and all seals are in secure condition"
          }
          signature={signature || null}
          signedAt={crewCompliance?.signedAt || null}
          onSign={() => setShowSignatureModal(true)}
        />
        {errors.signature && (
          <View className="bg-red-50 border border-red-200 p-2 rounded-lg mt-2">
            <Text className="text-red-600 text-center font-medium">
              {errors.signature.message}
            </Text>
          </View>
        )}
      </View>

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
