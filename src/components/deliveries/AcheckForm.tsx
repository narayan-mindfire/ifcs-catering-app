import React, { useState } from "react";
import {
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
import { AcheckFormProps } from "../../types/acheck";

interface SectionTitleProps {
  label: string;
}
const SectionTitle: React.FC<SectionTitleProps> = ({ label }) => (
  <Text className="text-text-primary font-semibold text-sm mb-2 mt-1">
    {label}
  </Text>
);

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}
const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  checked,
  onToggle,
}) => (
  <TouchableOpacity
    onPress={onToggle}
    className="flex-row items-center gap-2 mb-2"
    activeOpacity={0.7}
  >
    <View
      className={`w-5 h-5 rounded border-2 items-center justify-center ${
        checked
          ? "bg-bg-button border-bg-button"
          : "bg-bg-surface border-border-secondary"
      }`}
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
}
const CheckboxGrid: React.FC<CheckboxGridProps> = ({
  items,
  state,
  onToggle,
  columns = 3,
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
              />
            </View>
          ))}
          {/* Fill empty cells to keep grid aligned */}
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
}
const StyledInput: React.FC<StyledInputProps> = ({
  placeholder,
  value,
  onChangeText,
  multiline = false,
}) => (
  <TextInput
    placeholder={placeholder}
    placeholderTextColor="#A09CAB"
    value={value}
    onChangeText={onChangeText}
    multiline={multiline}
    numberOfLines={multiline ? 3 : 1}
    className={`bg-bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm mb-3 ${
      multiline ? "min-h-[72px] text-top" : ""
    }`}
    style={multiline ? { textAlignVertical: "top" } : undefined}
  />
);

interface RadioItemProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}
const RadioItem: React.FC<RadioItemProps> = ({ label, selected, onSelect }) => (
  <TouchableOpacity
    onPress={onSelect}
    className="flex-row items-center gap-2 mr-6"
    activeOpacity={0.7}
  >
    <View
      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
        selected ? "border-bg-button" : "border-border-secondary"
      }`}
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

export const AcheckForm: React.FC<AcheckFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
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

  const handleSubmit = () => {
    onSubmit({
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
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal transparent visible={isOpen} animationType="slide">
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="bg-bg-surface w-full max-w-lg rounded-2xl shadow-lg border border-border-muted overflow-hidden">
          <View className="bg-bg-accent px-5 py-4 border-b border-border-muted">
            <Text className="text-text-primary text-lg font-bold">
              Vehicle Defect Report
            </Text>
          </View>

          <ScrollView
            className="px-5 pt-4"
            style={{ maxHeight: 560 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <Text className="text-text-tertiary text-xs mb-1">Name</Text>
                <TextInput
                  placeholder="Enter Name"
                  placeholderTextColor="#A09CAB"
                  value={name}
                  onChangeText={setName}
                  className="bg-bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm"
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
                  className="bg-bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm"
                />
              </View>
              <View className="flex-1">
                <Text className="text-text-tertiary text-xs mb-1">Date</Text>
                <TextInput
                  placeholder="MMM DD, YYYY"
                  placeholderTextColor="#A09CAB"
                  value={date}
                  onChangeText={setDate}
                  className="bg-bg-surface border border-border-muted rounded-lg px-3 py-2.5 text-text-primary text-sm"
                />
              </View>
            </View>

            <View className="h-px bg-border-muted mb-3" />

            <SectionTitle label="Lighting" />
            <CheckboxGrid
              items={LIGHTING_ITEMS}
              state={lighting}
              onToggle={(key) => setLighting((s) => toggleKey(s, key))}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Operation" />
            <CheckboxGrid
              items={OPERATION_ITEMS}
              state={operation}
              onToggle={(key) => setOperation((s) => toggleKey(s, key))}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Auxiliary Drive" />
            <CheckboxGrid
              items={AUXILIARY_DRIVE_ITEMS}
              state={auxiliaryDrive}
              onToggle={(key) => setAuxiliaryDrive((s) => toggleKey(s, key))}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Hydraulics Fail At" />
            <CheckboxGrid
              items={HYDRAULICS_ITEMS}
              state={hydraulicsFailAt}
              onToggle={(key) => setHydraulicsFailAt((s) => toggleKey(s, key))}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Engine" />
            <StyledInput
              placeholder="Enter details"
              value={engine}
              onChangeText={setEngine}
            />

            <SectionTitle label="Transmission" />
            <StyledInput
              placeholder="Enter details"
              value={transmission}
              onChangeText={setTransmission}
            />

            <View className="h-px bg-border-muted mb-3" />

            <SectionTitle label="Tires" />
            <CheckboxGrid
              items={TIRES_ITEMS}
              state={tires}
              onToggle={(key) => setTires((s) => toggleKey(s, key))}
              columns={2}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Compressed Air Line Leaking" />
            <StyledInput
              placeholder="Enter where"
              value={compressedAirLineLeaking}
              onChangeText={setCompressedAirLineLeaking}
            />

            <View className="h-px bg-border-muted mb-3" />

            <SectionTitle label="Body Damage" />
            <CheckboxGrid
              items={BODY_DAMAGE_ITEMS}
              state={bodyDamage}
              onToggle={(key) => setBodyDamage((s) => toggleKey(s, key))}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Fall Protection" />
            <CheckboxGrid
              items={FALL_PROTECTION_ITEMS}
              state={fallProtection}
              onToggle={(key) => setFallProtection((s) => toggleKey(s, key))}
              columns={3}
            />

            <View className="h-px bg-border-muted my-3" />

            <SectionTitle label="Details" />
            <StyledInput
              placeholder="Enter details"
              value={details}
              onChangeText={setDetails}
              multiline
            />

            <SectionTitle label="Accident Hazard" />
            <View className="flex-row mb-3">
              <RadioItem
                label="Yes"
                selected={accidentHazard === "yes"}
                onSelect={() => setAccidentHazard("yes")}
              />
              <RadioItem
                label="No"
                selected={accidentHazard === "no"}
                onSelect={() => setAccidentHazard("no")}
              />
            </View>

            <SectionTitle label="External Damage" />
            <StyledInput
              placeholder="Text Description"
              value={externalDamage}
              onChangeText={setExternalDamage}
              multiline
            />

            <View className="h-4" />
          </ScrollView>

          <View className="flex-row gap-3 px-5 py-4 border-t border-border-muted bg-bg-quaternary">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-bg-tertiary py-3 rounded-lg border border-border-muted"
              activeOpacity={0.8}
            >
              <Text className="text-text-primary font-semibold text-center text-sm">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-1 bg-bg-button py-3 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-text-surface font-semibold text-center text-sm">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AcheckForm;
