import React, { useRef } from "react";
import { View, Text, Modal, Pressable, TouchableOpacity } from "react-native";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";

// --- Checkbox Component ---
interface CheckboxProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
}) => (
  <Pressable
    className="flex-row items-center my-1.5"
    onPress={() => onChange(!checked)}
  >
    <View
      className={`w-6 h-6 border-2 rounded justify-center items-center mr-2.5 ${
        checked
          ? "bg-bg-button border-bg-button"
          : "bg-bg-surface border-border-secondary"
      }`}
    >
      {checked && (
        <Text className="text-text-surface font-bold text-sm">✓</Text>
      )}
    </View>
    {label && <Text className="text-lg text-text-secondary">{label}</Text>}
  </Pressable>
);

// --- Signature Modal Component ---
interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
  title: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
}) => {
  const ref = useRef<SignatureViewRef>(null);

  const handleSignature = (signature: string) => {
    // signature is the base64 string
    onSave(signature);
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="none" transparent>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-[80%] h-[70%] bg-bg-surface rounded-xl overflow-hidden">
          <View className="flex-row justify-between p-4 border-b border-border-muted">
            <Text className="text-lg font-semibold text-text-primary">
              {title}
            </Text>
            <Pressable onPress={onClose}>
              <Text className="text-xl text-text-muted">✕</Text>
            </Pressable>
          </View>

          <View className="flex-1 bg-white">
            <SignatureScreen
              ref={ref}
              onOK={handleSignature}
              // 👇 ADD THIS: Trims empty space, creating a much smaller base64 string
              trimWhitespace={true}
              // 👇 ADD THIS: Ensures output is PNG (transparent)
              imageType="image/png"
              webStyle={`
                .m-signature-pad--footer {
                  display: none;
                  margin: 0px;
                }
                .m-signature-pad {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                }
                .m-signature-pad--body {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  margin: 0;
                }
                .m-signature-pad--body canvas {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                }
              `}
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
              }}
            />
          </View>

          <View className="flex-row p-4 border-t border-border-muted gap-2.5">
            <TouchableOpacity
              className="flex-1 p-3 items-center border border-red-500 rounded-lg"
              onPress={() => ref.current?.clearSignature()}
            >
              <Text className="text-red-500 font-semibold text-lg">Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 p-3 items-center bg-bg-button rounded-lg"
              onPress={() => ref.current?.readSignature()}
            >
              <Text className="text-text-surface font-semibold text-lg">
                Save Signature
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
