import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

import { AppButton } from "@/components/common/AppButton";
import { FormInput } from "@/components/common/FormInput";
import { SecurityCompliance } from "@/types/deliveries";

import {
  SecurityComplianceSchema,
  securityComplianceSchema,
} from "../../schemas/deliverySchemas";
import { ComplianceSignatureCard } from "./ComplianceSignatureCard";
import { SignatureModal } from "./SharedComponents";

interface SecurityComplianceTabProps {
  securityCompliance: SecurityCompliance | null;
  onUpdateCompliance: (compliance: SecurityCompliance) => Promise<void>;
}

const SecurityComplianceTab: React.FC<SecurityComplianceTabProps> = ({
  securityCompliance,
  onUpdateCompliance,
}) => {
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm<SecurityComplianceSchema>({
    resolver: zodResolver(securityComplianceSchema),
    mode: "onChange",
    defaultValues: {
      provider: "",
      name: "",
      staffNumber: "",
      position: "",
      signature: "",
      isCompliant: false,
    },
  });

  const isCompliant = watch("isCompliant");
  const signature = watch("signature");

  useEffect(() => {
    if (securityCompliance) {
      reset({
        provider: securityCompliance.provider || "",
        name: securityCompliance.name || "",
        staffNumber: securityCompliance.staffNumber || "",
        position: securityCompliance.position || "",
        signature: securityCompliance.signature || "",
        isCompliant: securityCompliance.isCompliant || false,
      });
    } else {
      reset({
        provider: "",
        name: "",
        staffNumber: "",
        position: "",
        signature: "",
        isCompliant: false,
      });
    }
  }, [securityCompliance, reset]);

  const onSubmit = async (data: SecurityComplianceSchema) => {
    setIsSaving(true);
    await onUpdateCompliance({
      isCompliant: data.isCompliant,
      provider: data.provider,
      name: data.name,
      staffNumber: data.staffNumber,
      position: data.position,
      confirmationText: "I confirm that all security measures are compliant",
      signature: data.signature,
      signedAt:
        data.signature !== securityCompliance?.signature
          ? new Date()
          : securityCompliance?.signedAt || null,
    });
    reset(data);
    setIsSaving(false);
  };

  const handleToggleCompliance = (val: boolean) => {
    setValue("isCompliant", val, { shouldValidate: true, shouldDirty: true });
  };

  const handleSaveSignature = (sig: string) => {
    setValue("signature", sig, { shouldValidate: true, shouldDirty: true });
    setShowSignatureModal(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexDirection: "row", padding: 10, gap: 20 }}
    >
      <View className="flex-1 bg-bg-surface rounded-2xl border border-border-muted p-4">
        <Text className="text-xl font-semibold text-text-primary mb-4">
          Security Representative Details
        </Text>

        <FormInput
          control={control}
          name="provider"
          label="Provider"
          placeholder="Enter provider"
          required
        />

        <FormInput
          control={control}
          name="name"
          label="Security Name"
          placeholder="Enter security name"
          required
        />

        <FormInput
          control={control}
          name="staffNumber"
          label="Staff Number"
          placeholder="Enter staff number"
          required
        />

        <FormInput
          control={control}
          name="position"
          label="Position (Optional)"
          placeholder="Enter position"
        />

        <AppButton
          title={isDirty ? "Save Changes" : "No Changes to Save"}
          onPress={handleSubmit(onSubmit)}
          loading={isSaving}
          disabled={!isDirty || !isValid}
          type={!isDirty || !isValid ? "secondary" : "primary"}
          style={{
            marginTop: 24,
            paddingVertical: 12,
            borderRadius: 12,
            opacity: !isDirty || !isValid ? 0.5 : 1,
          }}
          textStyle={{
            fontSize: 16,
            fontWeight: "600",
            color: !isDirty || !isValid ? undefined : "#fff",
          }}
        />
      </View>

      <View className="flex-1">
        <ComplianceSignatureCard
          title="Security Measures Compliance"
          isCompliant={isCompliant || false}
          onToggleCompliance={handleToggleCompliance}
          confirmationText={
            "I Certify that:\nThe in-flight supplies have gone through the following procedures: \n\n a. implemented appropriate measures to monitor the activities of staff preparing in-flight supplies(i.e, supervision/CCTV), so it will be preventive to insert prohibited items within a product.\n\n b. tamper - evident seals used to secure catering, carts and containers are affixed via trained and authorized person and checked against authorized documentation."
          }
          signature={signature || null}
          signedAt={securityCompliance?.signedAt ?? null}
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
        title="Security Compliance Signature"
      />
    </ScrollView>
  );
};

export default SecurityComplianceTab;
