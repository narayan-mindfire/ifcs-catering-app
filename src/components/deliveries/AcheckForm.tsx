import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

import {
  AUXILIARY_DRIVE_ITEMS,
  BODY_DAMAGE_ITEMS,
  FALL_PROTECTION_ITEMS,
  HYDRAULICS_ITEMS,
  LIGHTING_ITEMS,
  OPERATION_ITEMS,
  TIRES_ITEMS,
} from "@/constants/Acheck";
import {
  AcheckFormProps,
  CreateACheckPayload,
  TruckACheck,
} from "@/types/acheck";

const acheckSchema = z.object({
  name: z.string().min(1, "Name is required"),
  vehicleNo: z.string().min(1, "Vehicle No. is required"),
  date: z.string().min(1, "Date is required"),
  lighting: z.record(z.string(), z.boolean()),
  operation: z.record(z.string(), z.boolean()),
  auxiliaryDrive: z.record(z.string(), z.boolean()),
  hydraulicsFailAt: z.record(z.string(), z.boolean()),
  engine: z.string(),
  transmission: z.string(),
  tires: z.record(z.string(), z.boolean()),
  compressedAirLineLeaking: z.string(),
  bodyDamage: z.record(z.string(), z.boolean()),
  fallProtection: z.record(z.string(), z.boolean()),
  details: z.string(),
  accidentHazard: z.enum(["yes", "no"]).nullable(),
  externalDamage: z.string(),
});

type AcheckFormValues = z.infer<typeof acheckSchema>;

// ─── Sub-Components ──────────────────────────────────────────────────────────

interface SectionTitleProps {
  label: string;
  onCheckAll?: () => void;
  showCheckAll?: boolean;
}
const SectionTitle: React.FC<SectionTitleProps> = ({
  label,
  onCheckAll,
  showCheckAll = false,
}) => (
  <View className="flex-row items-center justify-between mb-2 mt-1">
    <Text className="text-text-primary font-semibold text-sm">{label}</Text>
    {showCheckAll && onCheckAll && (
      <TouchableOpacity
        onPress={onCheckAll}
        className="bg-bg-accent px-2 py-1 rounded border border-border-muted"
        activeOpacity={0.7}
      >
        <Text className="text-bg-button text-[10px] font-bold">
          Mark All OK
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}
const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  checked,
  onToggle,
  disabled = false,
}) => (
  <TouchableOpacity
    onPress={onToggle}
    disabled={disabled}
    className="flex-row items-center gap-2 mb-2"
    activeOpacity={disabled ? 1 : 0.7}
  >
    <View
      className={`w-5 h-5 rounded border-2 items-center justify-center ${
        checked
          ? "bg-bg-button border-bg-button"
          : "bg-bg-surface border-border-secondary"
      } ${disabled ? "opacity-60" : ""}`}
    >
      {checked && (
        <Text className="text-white text-xs font-bold leading-none">✓</Text>
      )}
    </View>
    <Text className="text-text-secondary text-sm flex-shrink">{label}</Text>
  </TouchableOpacity>
);

interface CheckboxGridProps {
  items: string[];
  state: Record<string, boolean>;
  onToggle: (key: string) => void;
  columns?: number;
  disabled?: boolean;
}
const CheckboxGrid: React.FC<CheckboxGridProps> = ({
  items,
  state,
  onToggle,
  columns = 3,
  disabled = false,
}) => {
  const rows: string[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }

  return (
    <View className="mb-1">
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} className="flex-row">
          {row.map((item) => (
            <View key={item} style={{ flex: 1 }}>
              <CheckboxItem
                label={item}
                checked={!!state[item]}
                onToggle={() => onToggle(item)}
                disabled={disabled}
              />
            </View>
          ))}
          {row.length < columns &&
            Array.from({ length: columns - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={{ flex: 1 }} />
            ))}
        </View>
      ))}
    </View>
  );
};

interface StyledInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  editable?: boolean;
}
const StyledInput: React.FC<StyledInputProps> = ({
  placeholder,
  value,
  onChangeText,
  multiline = false,
  editable = true,
}) => (
  <TextInput
    placeholder={placeholder}
    placeholderTextColor="#A09CAB"
    value={value}
    onChangeText={onChangeText}
    multiline={multiline}
    editable={editable}
    numberOfLines={multiline ? 3 : 1}
    className={`bg-bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm mb-3 ${
      multiline ? "min-h-[72px] text-top" : ""
    } ${!editable ? "opacity-60" : ""}`}
    style={multiline ? { textAlignVertical: "top" } : undefined}
  />
);

interface RadioItemProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}
const RadioItem: React.FC<RadioItemProps> = ({
  label,
  selected,
  onSelect,
  disabled = false,
}) => (
  <TouchableOpacity
    onPress={onSelect}
    disabled={disabled}
    className="flex-row items-center gap-2 mr-6"
    activeOpacity={disabled ? 1 : 0.7}
  >
    <View
      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
        selected ? "border-bg-button" : "border-border-secondary"
      } ${disabled ? "opacity-60" : ""}`}
    >
      {selected && <View className="w-2.5 h-2.5 rounded-full bg-bg-button" />}
    </View>
    <Text className="text-text-secondary text-sm">{label}</Text>
  </TouchableOpacity>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCheckboxState(items: string[]): Record<string, boolean> {
  return Object.fromEntries(items.map((k) => [k, false]));
}

function toggleKey(
  state: Record<string, boolean>,
  key: string,
): Record<string, boolean> {
  return { ...state, [key]: !state[key] };
}

function checkAll(state: Record<string, boolean>): Record<string, boolean> {
  const newState = { ...state };
  Object.keys(newState).forEach((k) => (newState[k] = true));
  return newState;
}

const LIGHTING_KEY_MAP: Record<string, keyof CreateACheckPayload> = {
  "Indicator light": "lightIndicator",
  "High beam": "lightHighBeam",
  "Tail light": "lightTail",
  Cabin: "lightCabin",
  "Brake light": "lightBrake",
  "Cargo area": "lightCargo",
  "Low beam": "lightLowBeam",
  "Parking light": "lightParking",
  "Turn signal": "lightTurnSignal",
  Platform: "lightPlatform",
  "Hazard lights": "lightHazard",
};

const OPERATION_KEY_MAP: Record<string, keyof CreateACheckPayload> = {
  "Ignition switch": "opIgnition",
  Steering: "opSteering",
  Window: "opWindow",
  "Foot break": "opFootBrake",
  "Heating/Ventilation": "opHeatingVentilation",
  "Hand gas": "opHandGas",
  Horn: "opHorn",
  "Parking brake": "opParkingBrake",
  "Auxiliary window": "opAuxiliaryWindow",
  Clutch: "opClutch",
  "Windshield wiper": "opWindshieldWiper",
  "Seat adjustment": "opSeatAdjustment",
};

const AUXILIARY_KEY_MAP: Record<string, keyof CreateACheckPayload> = {
  "Does not release": "auxDoesNotRelease",
  Steering: "auxSteering",
  Window: "auxWindow",
  "Foot Break": "auxFootBrake",
  "Heating/Ventilation": "auxHeatingVentilation",
  "Hand Gas": "auxHandGas",
  Horn: "auxHorn",
  "Support do not retract": "auxSupportNotRetract",
  "Auxiliary Window": "auxAuxiliaryWindow",
  Clutch: "auxClutch",
  "Windshield Wiper": "auxWindshieldWiper",
  "Seat Adjustment": "auxSeatAdjustment",
};

const HYDRAULICS_KEY_MAP: Record<string, keyof CreateACheckPayload> = {
  "Front Left (VL)": "hydVl",
  "Middle Left (ML)": "hydMl",
  "Rear Left (HL)": "hydHl",
  "Front Right (VR)": "hydVr",
  "Middle Right (MR)": "hydMr",
  "Rear Right (HR)": "hydHr",
};

const TIRES_KEY_MAP: Record<string, keyof CreateACheckPayload> = {
  "Front Left (VL)": "tireVl",
  "Rear Left (HL)": "tireHl",
  "Rear Right (HR)": "tireHr",
  "Front Right (VR)": "tireVr",
};

const BODY_KEY_MAP: Record<string, keyof CreateACheckPayload> = {
  "A-Pillar": "structBodyAPillar",
  "Ladder (Cargo Access)": "structBodyLadder",
  "C-Pillar": "structBodyCPillar",
  "B-Pillar": "structBodyBPillar",
  "D-Pillar": "structBodyDPillar",
};

const FALL_KEY_MAP: Record<string, keyof CreateACheckPayload> = {
  Left: "fallLeft",
  Bent: "fallBent",
  Right: "fallRight",
  Jammed: "fallJammed",
};

function buildPayload(
  name: string,
  vehicleNo: string,
  date: string,
  lighting: Record<string, boolean>,
  operation: Record<string, boolean>,
  auxiliaryDrive: Record<string, boolean>,
  hydraulicsFailAt: Record<string, boolean>,
  engine: string,
  transmission: string,
  tires: Record<string, boolean>,
  compressedAirLineLeaking: string,
  bodyDamage: Record<string, boolean>,
  fallProtection: Record<string, boolean>,
  details: string,
  accidentHazard: "yes" | "no" | null,
  externalDamage: string,
  truckId?: string,
  assignmentId?: string,
  userId?: string,
): CreateACheckPayload {
  const resolve = (
    map: Record<string, keyof CreateACheckPayload>,
    state: Record<string, boolean>,
  ): Record<string, boolean> => {
    const result: Record<string, boolean> = {};
    for (const [label, apiKey] of Object.entries(map)) {
      result[apiKey as string] = !!state[label];
    }
    return result;
  };

  return {
    truckId,
    assignmentId,
    userId,
    name,
    vehicleNo,
    checkedDate: date || new Date().toISOString(),
    ...resolve(LIGHTING_KEY_MAP, lighting),
    ...resolve(OPERATION_KEY_MAP, operation),
    ...resolve(AUXILIARY_KEY_MAP, auxiliaryDrive),
    ...resolve(HYDRAULICS_KEY_MAP, hydraulicsFailAt),
    compEngine: engine,
    compTransmission: transmission,
    compAirLineLeaking: compressedAirLineLeaking,
    ...resolve(TIRES_KEY_MAP, tires),
    ...resolve(BODY_KEY_MAP, bodyDamage),
    ...resolve(FALL_KEY_MAP, fallProtection),
    details,
    hasAccidentHazard: accidentHazard === "yes",
    externalDamage,
  } as CreateACheckPayload;
}

function seedFromApiData(data: TruckACheck): AcheckFormValues {
  const reverseMap = (
    map: Record<string, keyof CreateACheckPayload>,
    source: TruckACheck,
  ): Record<string, boolean> => {
    const result: Record<string, boolean> = {};
    for (const [label, apiKey] of Object.entries(map)) {
      result[label] = !!(source as any)[apiKey];
    }
    return result;
  };

  return {
    name: data.name || "",
    vehicleNo: data.vehicleNo || "",
    date: data.checkedDate || "",
    lighting: reverseMap(LIGHTING_KEY_MAP, data),
    operation: reverseMap(OPERATION_KEY_MAP, data),
    auxiliaryDrive: reverseMap(AUXILIARY_KEY_MAP, data),
    hydraulicsFailAt: reverseMap(HYDRAULICS_KEY_MAP, data),
    engine: data.compEngine || "",
    transmission: data.compTransmission || "",
    tires: reverseMap(TIRES_KEY_MAP, data),
    compressedAirLineLeaking: data.compAirLineLeaking || "",
    bodyDamage: reverseMap(BODY_KEY_MAP, data),
    fallProtection: reverseMap(FALL_KEY_MAP, data),
    details: data.details || "",
    accidentHazard: data.hasAccidentHazard ? "yes" : ("no" as "yes" | "no"),
    externalDamage: data.externalDamage || "",
  };
}

// ─── Main Component ────────────────────────────────────────────────────────────

export const AcheckForm: React.FC<AcheckFormProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  truckId,
  assignmentId,
  userId,
  driverName,
  truckNo,
  onSubmit,
  onUpdate,
  onRequestEdit,
  canEdit = true,
}) => {
  const isReadOnly = mode === "view";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AcheckFormValues>({
    resolver: zodResolver(acheckSchema),
    defaultValues: {
      name: driverName || "",
      vehicleNo: truckNo || "",
      date: new Date().toISOString(),
      lighting: makeCheckboxState(LIGHTING_ITEMS),
      operation: makeCheckboxState(OPERATION_ITEMS),
      auxiliaryDrive: makeCheckboxState(AUXILIARY_DRIVE_ITEMS),
      hydraulicsFailAt: makeCheckboxState(HYDRAULICS_ITEMS),
      engine: "",
      transmission: "",
      tires: makeCheckboxState(TIRES_ITEMS),
      compressedAirLineLeaking: "",
      bodyDamage: makeCheckboxState(BODY_DAMAGE_ITEMS),
      fallProtection: makeCheckboxState(FALL_PROTECTION_ITEMS),
      details: "",
      accidentHazard: null,
      externalDamage: "",
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (initialData && (mode === "view" || mode === "edit")) {
      const seeded = seedFromApiData(initialData);
      reset(seeded as any);
    } else if (mode === "create") {
      reset({
        name: driverName || "",
        vehicleNo: truckNo || "",
        date: new Date().toISOString(),
        lighting: makeCheckboxState(LIGHTING_ITEMS),
        operation: makeCheckboxState(OPERATION_ITEMS),
        auxiliaryDrive: makeCheckboxState(AUXILIARY_DRIVE_ITEMS),
        hydraulicsFailAt: makeCheckboxState(HYDRAULICS_ITEMS),
        engine: "",
        transmission: "",
        tires: makeCheckboxState(TIRES_ITEMS),
        compressedAirLineLeaking: "",
        bodyDamage: makeCheckboxState(BODY_DAMAGE_ITEMS),
        fallProtection: makeCheckboxState(FALL_PROTECTION_ITEMS),
        details: "",
        accidentHazard: null,
        externalDamage: "",
      });
    }
  }, [initialData, mode, driverName, truckNo, reset]);

  const onFormSubmit: SubmitHandler<AcheckFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = buildPayload(
        data.name,
        data.vehicleNo,
        data.date,
        data.lighting,
        data.operation,
        data.auxiliaryDrive,
        data.hydraulicsFailAt,
        data.engine,
        data.transmission,
        data.tires,
        data.compressedAirLineLeaking,
        data.bodyDamage,
        data.fallProtection,
        data.details,
        data.accidentHazard,
        data.externalDamage,
        truckId,
        assignmentId,
        userId,
      );

      if (mode === "edit" && initialData && onUpdate) {
        await onUpdate(initialData.id, payload);
      } else if (mode === "create" && onSubmit) {
        await onSubmit(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle =
    mode === "edit" ? "Edit Vehicle Defect Report" : "Vehicle Defect Report";

  return (
    <Modal transparent visible={isOpen} animationType="slide">
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="bg-bg-surface w-full max-w-lg rounded-2xl shadow-lg border border-border-muted overflow-hidden">
          {/* Header */}
          <View className="bg-bg-accent px-5 py-4 border-b border-border-muted flex-row items-center justify-between">
            <Text className="text-text-primary text-lg font-bold">
              {modalTitle}
            </Text>
            {mode === "view" && onRequestEdit && canEdit && (
              <TouchableOpacity
                onPress={onRequestEdit}
                className="bg-bg-button px-3 py-1.5 rounded-lg"
                activeOpacity={0.8}
              >
                <Text className="text-text-surface text-xs font-semibold">
                  Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            className="px-5 pt-4"
            style={{ maxHeight: 560 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Metadata Row */}
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <Text className="text-text-tertiary text-xs mb-1">Name</Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Enter Name"
                      placeholderTextColor="#A09CAB"
                      value={value}
                      onChangeText={onChange}
                      editable={!isReadOnly}
                      className={`bg-bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm ${isReadOnly ? "opacity-60" : ""}`}
                    />
                  )}
                />
                {errors.name && (
                  <Text className="text-red-500 text-[10px] mt-0.5">
                    {errors.name.message}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-text-tertiary text-xs mb-1">
                  Vehicle No.
                </Text>
                <Controller
                  control={control}
                  name="vehicleNo"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Vehicle No."
                      placeholderTextColor="#A09CAB"
                      value={value}
                      onChangeText={onChange}
                      editable={!isReadOnly}
                      className={`bg-bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm ${isReadOnly ? "opacity-60" : ""}`}
                    />
                  )}
                />
                {errors.vehicleNo && (
                  <Text className="text-red-500 text-[10px] mt-0.5">
                    {errors.vehicleNo.message}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-text-tertiary text-xs mb-1">Date</Text>
                <Controller
                  control={control}
                  name="date"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="MM DD, YYYY"
                      placeholderTextColor="#A09CAB"
                      value={value ? new Date(value).toLocaleDateString() : ""}
                      onChangeText={onChange}
                      editable={!isReadOnly}
                      className={`bg-bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm ${isReadOnly ? "opacity-60" : ""}`}
                    />
                  )}
                />
                {errors.date && (
                  <Text className="text-red-500 text-[10px] mt-0.5">
                    {errors.date.message}
                  </Text>
                )}
              </View>
            </View>

            <View className="h-px bg-border-muted mb-3" />

            <SectionTitle
              label="Lighting"
              showCheckAll={!isReadOnly}
              onCheckAll={() =>
                setValue("lighting", checkAll(formValues.lighting))
              }
            />
            <CheckboxGrid
              items={LIGHTING_ITEMS}
              state={formValues.lighting}
              onToggle={(key) =>
                setValue("lighting", toggleKey(formValues.lighting, key))
              }
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle
              label="Operation"
              showCheckAll={!isReadOnly}
              onCheckAll={() =>
                setValue("operation", checkAll(formValues.operation))
              }
            />
            <CheckboxGrid
              items={OPERATION_ITEMS}
              state={formValues.operation}
              onToggle={(key) =>
                setValue("operation", toggleKey(formValues.operation, key))
              }
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle
              label="Auxiliary Drive"
              showCheckAll={!isReadOnly}
              onCheckAll={() =>
                setValue("auxiliaryDrive", checkAll(formValues.auxiliaryDrive))
              }
            />
            <CheckboxGrid
              items={AUXILIARY_DRIVE_ITEMS}
              state={formValues.auxiliaryDrive}
              onToggle={(key) =>
                setValue(
                  "auxiliaryDrive",
                  toggleKey(formValues.auxiliaryDrive, key),
                )
              }
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle
              label="Hydraulics Fail At"
              showCheckAll={!isReadOnly}
              onCheckAll={() =>
                setValue(
                  "hydraulicsFailAt",
                  checkAll(formValues.hydraulicsFailAt),
                )
              }
            />
            <CheckboxGrid
              items={HYDRAULICS_ITEMS}
              state={formValues.hydraulicsFailAt}
              onToggle={(key) =>
                setValue(
                  "hydraulicsFailAt",
                  toggleKey(formValues.hydraulicsFailAt, key),
                )
              }
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Engine" />
            <Controller
              control={control}
              name="engine"
              render={({ field: { onChange, value } }) => (
                <StyledInput
                  placeholder="Enter details"
                  value={value}
                  onChangeText={onChange}
                  editable={!isReadOnly}
                />
              )}
            />

            <SectionTitle label="Transmission" />
            <Controller
              control={control}
              name="transmission"
              render={({ field: { onChange, value } }) => (
                <StyledInput
                  placeholder="Enter details"
                  value={value}
                  onChangeText={onChange}
                  editable={!isReadOnly}
                />
              )}
            />

            <View className="h-px bg-border-muted mb-3" />

            <SectionTitle
              label="Tires"
              showCheckAll={!isReadOnly}
              onCheckAll={() => setValue("tires", checkAll(formValues.tires))}
            />
            <CheckboxGrid
              items={TIRES_ITEMS}
              state={formValues.tires}
              onToggle={(key) =>
                setValue("tires", toggleKey(formValues.tires, key))
              }
              columns={2}
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Compressed Air Line Leaking" />
            <Controller
              control={control}
              name="compressedAirLineLeaking"
              render={({ field: { onChange, value } }) => (
                <StyledInput
                  placeholder="Enter where"
                  value={value}
                  onChangeText={onChange}
                  editable={!isReadOnly}
                />
              )}
            />

            <View className="h-px bg-border-muted mb-3" />

            <SectionTitle
              label="Body Damage"
              showCheckAll={!isReadOnly}
              onCheckAll={() =>
                setValue("bodyDamage", checkAll(formValues.bodyDamage))
              }
            />
            <CheckboxGrid
              items={BODY_DAMAGE_ITEMS}
              state={formValues.bodyDamage}
              onToggle={(key) =>
                setValue("bodyDamage", toggleKey(formValues.bodyDamage, key))
              }
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle
              label="Fall Protection"
              showCheckAll={!isReadOnly}
              onCheckAll={() =>
                setValue("fallProtection", checkAll(formValues.fallProtection))
              }
            />
            <CheckboxGrid
              items={FALL_PROTECTION_ITEMS}
              state={formValues.fallProtection}
              onToggle={(key) =>
                setValue(
                  "fallProtection",
                  toggleKey(formValues.fallProtection, key),
                )
              }
              columns={3}
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Details" />
            <Controller
              control={control}
              name="details"
              render={({ field: { onChange, value } }) => (
                <StyledInput
                  placeholder="Enter details"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  editable={!isReadOnly}
                />
              )}
            />

            <SectionTitle label="Accident Hazard" />
            <Controller
              control={control}
              name="accidentHazard"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row mb-3">
                  <RadioItem
                    label="Yes"
                    selected={value === "yes"}
                    onSelect={() => onChange("yes")}
                    disabled={isReadOnly}
                  />
                  <RadioItem
                    label="No"
                    selected={value === "no"}
                    onSelect={() => onChange("no")}
                    disabled={isReadOnly}
                  />
                </View>
              )}
            />

            <SectionTitle label="External Damage" />
            <Controller
              control={control}
              name="externalDamage"
              render={({ field: { onChange, value } }) => (
                <StyledInput
                  placeholder="Text Description"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  editable={!isReadOnly}
                />
              )}
            />

            <View className="h-4" />
          </ScrollView>

          {/* Footer Actions */}
          <View className="flex-row gap-3 px-5 py-4 border-t border-border-muted bg-bg-quaternary">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-bg-tertiary py-3 rounded-lg border border-border-muted"
              activeOpacity={0.8}
            >
              <Text className="text-text-primary font-semibold text-center text-sm">
                {mode === "view" ? "Close" : "Cancel"}
              </Text>
            </TouchableOpacity>

            {mode !== "view" && (
              <TouchableOpacity
                onPress={handleSubmit(onFormSubmit as any)}
                disabled={isSubmitting}
                className="flex-1 bg-bg-button py-3 rounded-lg items-center justify-center"
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-text-surface font-semibold text-center text-sm">
                    {mode === "edit" ? "Update" : "Submit"}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AcheckForm;
