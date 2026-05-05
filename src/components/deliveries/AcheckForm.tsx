import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  AUXILIARY_DRIVE_ITEMS,
  BODY_DAMAGE_ITEMS,
  FALL_PROTECTION_ITEMS,
  HYDRAULICS_ITEMS,
  LIGHTING_ITEMS,
  OPERATION_ITEMS,
  TIRES_ITEMS,
} from "../../const/Acheck";
import {
  AcheckFormProps,
  CreateACheckPayload,
  TruckACheck,
} from "../../types/acheck";

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

function seedFromApiData(data: TruckACheck) {
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

  // Form state
  const [name, setName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [date, setDate] = useState("");
  const [lighting, setLighting] = useState(makeCheckboxState(LIGHTING_ITEMS));
  const [operation, setOperation] = useState(
    makeCheckboxState(OPERATION_ITEMS),
  );
  const [auxiliaryDrive, setAuxiliaryDrive] = useState(
    makeCheckboxState(AUXILIARY_DRIVE_ITEMS),
  );
  const [hydraulicsFailAt, setHydraulicsFailAt] = useState(
    makeCheckboxState(HYDRAULICS_ITEMS),
  );
  const [engine, setEngine] = useState("");
  const [transmission, setTransmission] = useState("");
  const [tires, setTires] = useState(makeCheckboxState(TIRES_ITEMS));
  const [compressedAirLineLeaking, setCompressedAirLineLeaking] = useState("");
  const [bodyDamage, setBodyDamage] = useState(
    makeCheckboxState(BODY_DAMAGE_ITEMS),
  );
  const [fallProtection, setFallProtection] = useState(
    makeCheckboxState(FALL_PROTECTION_ITEMS),
  );
  const [details, setDetails] = useState("");
  const [accidentHazard, setAccidentHazard] = useState<"yes" | "no" | null>(
    null,
  );
  const [externalDamage, setExternalDamage] = useState("");

  useEffect(() => {
    if (initialData && (mode === "view" || mode === "edit")) {
      const seeded = seedFromApiData(initialData);
      setName(seeded.name);
      setVehicleNo(seeded.vehicleNo);
      setDate(seeded.date);
      setLighting(seeded.lighting);
      setOperation(seeded.operation);
      setAuxiliaryDrive(seeded.auxiliaryDrive);
      setHydraulicsFailAt(seeded.hydraulicsFailAt);
      setEngine(seeded.engine);
      setTransmission(seeded.transmission);
      setTires(seeded.tires);
      setCompressedAirLineLeaking(seeded.compressedAirLineLeaking);
      setBodyDamage(seeded.bodyDamage);
      setFallProtection(seeded.fallProtection);
      setDetails(seeded.details);
      setAccidentHazard(seeded.accidentHazard);
      setExternalDamage(seeded.externalDamage);
    } else if (mode === "create") {
      // Default Values for Create Mode
      setName(driverName || "");
      setVehicleNo(truckNo || "");
      setDate(new Date().toISOString()); // <-- PATCH: Default to today
      setLighting(makeCheckboxState(LIGHTING_ITEMS));
      setOperation(makeCheckboxState(OPERATION_ITEMS));
      setAuxiliaryDrive(makeCheckboxState(AUXILIARY_DRIVE_ITEMS));
      setHydraulicsFailAt(makeCheckboxState(HYDRAULICS_ITEMS));
      setEngine("");
      setTransmission("");
      setTires(makeCheckboxState(TIRES_ITEMS));
      setCompressedAirLineLeaking("");
      setBodyDamage(makeCheckboxState(BODY_DAMAGE_ITEMS));
      setFallProtection(makeCheckboxState(FALL_PROTECTION_ITEMS));
      setDetails("");
      setAccidentHazard(null);
      setExternalDamage("");
    }
  }, [initialData, mode, driverName, truckNo]);

  const handleCreate = async () => {
    if (!onSubmit) return;
    setIsSubmitting(true);
    try {
      const payload = buildPayload(
        name,
        vehicleNo,
        date,
        lighting,
        operation,
        auxiliaryDrive,
        hydraulicsFailAt,
        engine,
        transmission,
        tires,
        compressedAirLineLeaking,
        bodyDamage,
        fallProtection,
        details,
        accidentHazard,
        externalDamage,
        truckId,
        assignmentId,
        userId,
      );
      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!onUpdate || !initialData) return;
    setIsSubmitting(true);
    try {
      const payload = buildPayload(
        name,
        vehicleNo,
        date,
        lighting,
        operation,
        auxiliaryDrive,
        hydraulicsFailAt,
        engine,
        transmission,
        tires,
        compressedAirLineLeaking,
        bodyDamage,
        fallProtection,
        details,
        accidentHazard,
        externalDamage,
        truckId,
        assignmentId,
        userId,
      );
      await onUpdate(initialData.id, payload);
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
                <TextInput
                  placeholder="Enter Name"
                  placeholderTextColor="#A09CAB"
                  value={name}
                  onChangeText={setName}
                  editable={!isReadOnly}
                  className={`bg-bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm ${isReadOnly ? "opacity-60" : ""}`}
                />
              </View>
              <View className="flex-1">
                <Text className="text-text-tertiary text-xs mb-1">
                  Vehicle No.
                </Text>
                <TextInput
                  placeholder="Vehicle No."
                  placeholderTextColor="#A09CAB"
                  value={vehicleNo}
                  onChangeText={setVehicleNo}
                  editable={!isReadOnly}
                  className={`bg-bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm ${isReadOnly ? "opacity-60" : ""}`}
                />
              </View>
              <View className="flex-1">
                <Text className="text-text-tertiary text-xs mb-1">Date</Text>
                <TextInput
                  placeholder="MM DD, YYYY"
                  placeholderTextColor="#A09CAB"
                  // Render ISO date safely as localized string
                  value={date ? new Date(date).toLocaleDateString() : ""}
                  onChangeText={setDate}
                  // Locked for view, editable for create/edit
                  editable={!isReadOnly}
                  className={`bg-bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm ${isReadOnly ? "opacity-60" : ""}`}
                />
              </View>
            </View>

            <View className="h-px bg-border-muted mb-3" />

            <SectionTitle
              label="Lighting"
              showCheckAll={!isReadOnly}
              onCheckAll={() => setLighting((s) => checkAll(s))}
            />
            <CheckboxGrid
              items={LIGHTING_ITEMS}
              state={lighting}
              onToggle={(key) => setLighting((s) => toggleKey(s, key))}
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle
              label="Operation"
              showCheckAll={!isReadOnly}
              onCheckAll={() => setOperation((s) => checkAll(s))}
            />
            <CheckboxGrid
              items={OPERATION_ITEMS}
              state={operation}
              onToggle={(key) => setOperation((s) => toggleKey(s, key))}
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle
              label="Auxiliary Drive"
              showCheckAll={!isReadOnly}
              onCheckAll={() => setAuxiliaryDrive((s) => checkAll(s))}
            />
            <CheckboxGrid
              items={AUXILIARY_DRIVE_ITEMS}
              state={auxiliaryDrive}
              onToggle={(key) => setAuxiliaryDrive((s) => toggleKey(s, key))}
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle
              label="Hydraulics Fail At"
              showCheckAll={!isReadOnly}
              onCheckAll={() => setHydraulicsFailAt((s) => checkAll(s))}
            />
            <CheckboxGrid
              items={HYDRAULICS_ITEMS}
              state={hydraulicsFailAt}
              onToggle={(key) => setHydraulicsFailAt((s) => toggleKey(s, key))}
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Engine" />
            <StyledInput
              placeholder="Enter details"
              value={engine}
              onChangeText={setEngine}
              editable={!isReadOnly}
            />

            <SectionTitle label="Transmission" />
            <StyledInput
              placeholder="Enter details"
              value={transmission}
              onChangeText={setTransmission}
              editable={!isReadOnly}
            />

            <View className="h-px bg-border-muted mb-3" />

            <SectionTitle
              label="Tires"
              showCheckAll={!isReadOnly}
              onCheckAll={() => setTires((s) => checkAll(s))}
            />
            <CheckboxGrid
              items={TIRES_ITEMS}
              state={tires}
              onToggle={(key) => setTires((s) => toggleKey(s, key))}
              columns={2}
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Compressed Air Line Leaking" />
            <StyledInput
              placeholder="Enter where"
              value={compressedAirLineLeaking}
              onChangeText={setCompressedAirLineLeaking}
              editable={!isReadOnly}
            />

            <View className="h-px bg-border-muted mb-3" />

            <SectionTitle
              label="Body Damage"
              showCheckAll={!isReadOnly}
              onCheckAll={() => setBodyDamage((s) => checkAll(s))}
            />
            <CheckboxGrid
              items={BODY_DAMAGE_ITEMS}
              state={bodyDamage}
              onToggle={(key) => setBodyDamage((s) => toggleKey(s, key))}
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle
              label="Fall Protection"
              showCheckAll={!isReadOnly}
              onCheckAll={() => setFallProtection((s) => checkAll(s))}
            />
            <CheckboxGrid
              items={FALL_PROTECTION_ITEMS}
              state={fallProtection}
              onToggle={(key) => setFallProtection((s) => toggleKey(s, key))}
              columns={3}
              disabled={isReadOnly}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Details" />
            <StyledInput
              placeholder="Enter details"
              value={details}
              onChangeText={setDetails}
              multiline
              editable={!isReadOnly}
            />

            <SectionTitle label="Accident Hazard" />
            <View className="flex-row mb-3">
              <RadioItem
                label="Yes"
                selected={accidentHazard === "yes"}
                onSelect={() => setAccidentHazard("yes")}
                disabled={isReadOnly}
              />
              <RadioItem
                label="No"
                selected={accidentHazard === "no"}
                onSelect={() => setAccidentHazard("no")}
                disabled={isReadOnly}
              />
            </View>

            <SectionTitle label="External Damage" />
            <StyledInput
              placeholder="Text Description"
              value={externalDamage}
              onChangeText={setExternalDamage}
              multiline
              editable={!isReadOnly}
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
                onPress={mode === "edit" ? handleUpdate : handleCreate}
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
