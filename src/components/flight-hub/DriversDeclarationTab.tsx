import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

import {
  DriverDeclarationSchema,
  driverDeclarationSchema,
} from "../../schemas/deliverySchemas";
import { useAuthStore } from "../../store/useAuthStore";
import { DriversDeclaration } from "../../types/deliveries";
import { log } from "../../utils/logger";
import { AppButton } from "../common/AppButton";
import { FormInput } from "../common/FormInput";
import { ComplianceSignatureCard } from "./ComplianceSignatureCard";
import { SignatureModal } from "./SharedComponents";

interface DriversDeclarationTabProps {
  driversDeclaration: DriversDeclaration | null;
  onUpdateDeclaration: (declaration: DriversDeclaration) => Promise<void>;
}

const DriversDeclarationTab: React.FC<DriversDeclarationTabProps> = ({
  driversDeclaration,
  onUpdateDeclaration,
}) => {
  const { user } = useAuthStore();
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm<DriverDeclarationSchema>({
    resolver: zodResolver(driverDeclarationSchema),
    mode: "onChange",
    defaultValues: {
      driverName: "",
      driverStaffId: "",
      truckSeal: "",
      driverCompany: "",
      signature: "",
      sealIntact: false,
    },
  });

  const sealIntact = watch("sealIntact");
  const signature = watch("signature");

  useEffect(() => {
    const hasExistingContent =
      driversDeclaration &&
      (driversDeclaration.driverName ||
        driversDeclaration.driverStaffId ||
        driversDeclaration.driverCompany ||
        driversDeclaration.signature);

    if (hasExistingContent) {
      reset({
        driverName: driversDeclaration.driverName || "",
        driverStaffId: driversDeclaration.driverStaffId || "",
        truckSeal: driversDeclaration.truckSeal || "",
        driverCompany: driversDeclaration.driverCompany || "",
        signature: driversDeclaration.signature || "",
        sealIntact: driversDeclaration.sealIntact || false,
      });
    } else if (user) {
      reset({
        driverName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        driverStaffId: user.badgeNumber || "",
        truckSeal: "",
        driverCompany: user.organization || "",
        signature: "",
        sealIntact: false,
      });
    } else {
      log.warn(
        "Neither existing declaration nor user profile available for filling",
      );
    }
  }, [driversDeclaration, reset, user]);

  const onSubmit = async (data: DriverDeclarationSchema) => {
    setIsSaving(true);
    await onUpdateDeclaration({
      driverName: data.driverName,
      driverStaffId: data.driverStaffId,
      truckSeal: data.truckSeal,
      driverCompany: data.driverCompany,
      sealIntact: data.sealIntact,
      confirmationText: "The driver confirms the seal is intact.",
      signature: data.signature,
      signedAt:
        data.signature !== driversDeclaration?.signature
          ? new Date()
          : driversDeclaration?.signedAt || null,
    });
    reset(data);
    setIsSaving(false);
  };

  const handleSaveSignature = (sig: string) => {
    setValue("signature", sig, { shouldValidate: true, shouldDirty: true });
    setShowSignatureModal(false);
  };

  const handleToggleSealIntact = (val: boolean) => {
    setValue("sealIntact", val, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexDirection: "row", padding: 10, gap: 20 }}
    >
      <View className="flex-1 bg-bg-surface rounded-2xl border border-border-muted p-4">
        <Text className="text-xl font-semibold text-text-primary mb-4">
          Driver Information
        </Text>

        <FormInput
          control={control}
          name="driverName"
          label="Driver Name"
          placeholder="Enter driver name"
          required
        />

        <FormInput
          control={control}
          name="driverStaffId"
          label="Staff ID"
          placeholder="Enter staff ID"
          required
        />

        <FormInput
          control={control}
          name="truckSeal"
          label="Truck Seal"
          placeholder="Enter truck seal ID"
        />

        <FormInput
          control={control}
          name="driverCompany"
          label="Company"
          placeholder="Enter company name"
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
            fontSize: 14,
            fontWeight: "600",
            color: !isDirty || !isValid ? undefined : "#fff",
          }}
        />

        {/* {!isDirty && driverName && (
          <View className="mt-4 p-3 bg-bg-accent rounded-lg border border-bg-primary">
            <Text className="text-sm text-text-primary text-center font-medium">
              ✓ Information Synced
            </Text>
          </View>
        )} */}
      </View>

      <View className="flex-1">
        <ComplianceSignatureCard
          title="Security Seal is Intact"
          toPrint={false}
          isCompliant={sealIntact || false}
          onToggleCompliance={handleToggleSealIntact}
          confirmationText={
            "I certify that:\n" +
            "a. The security of in-flight supplies has been maintained during transfer.\n" +
            "b. Supplies were loaded in secure condition and handed over properly."
          }
          signature={signature || null}
          signedAt={driversDeclaration?.signedAt || null}
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
        title="Driver's Compliance Signature"
      />
    </ScrollView>
  );
};

export default DriversDeclarationTab;
