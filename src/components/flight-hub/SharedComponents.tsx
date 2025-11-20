import React, { useRef } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
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
    style={styles.checkboxContainer}
    onPress={() => onChange(!checked)}
  >
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    {label && <Text style={styles.checkboxLabel}>{label}</Text>}
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
    onSave(signature);
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="none" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.signatureContainer}>
            <SignatureScreen
              ref={ref}
              onOK={handleSignature}
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

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => ref.current?.clearSignature()}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => ref.current?.readSignature()}
            >
              <Text style={styles.saveButtonText}>Save Signature</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  checkboxChecked: { backgroundColor: "#602AF3", borderColor: "#602AF3" },
  checkmark: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  checkboxLabel: { fontSize: 16, color: "#4F4B58" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    height: "70%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE9EC",
  },
  modalTitle: { fontSize: 18, fontWeight: "600", color: "#27262C" },
  closeText: { fontSize: 20, color: "#7A7A7A" },
  signatureContainer: { flex: 1, backgroundColor: "#d12222ff" },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EAE9EC",
    gap: 10,
  },
  clearButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
  },
  clearButtonText: { color: "red", fontWeight: "600" },
  saveButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#602AF3",
    borderRadius: 8,
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
});
