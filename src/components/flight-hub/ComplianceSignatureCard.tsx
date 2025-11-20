import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Checkbox } from "./SharedComponents";

interface ComplianceSignatureCardProps {
  title: string;
  isCompliant: boolean;
  onToggleCompliance: (value: boolean) => void;
  confirmationText: string;
  signature: string | null;
  signedAt: Date | null;
  onSign: () => void;
}

export const ComplianceSignatureCard: React.FC<
  ComplianceSignatureCardProps
> = ({
  title,
  isCompliant,
  onToggleCompliance,
  confirmationText,
  signature,
  signedAt,
  onSign,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Checkbox checked={isCompliant} onChange={onToggleCompliance} />
      </View>

      <View style={styles.confirmationBox}>
        <Text style={styles.confirmationText}>{confirmationText}</Text>
      </View>

      <Text style={styles.label}>Signature</Text>
      {signature ? (
        <View>
          <View style={styles.signatureDisplay}>
            <Image
              source={{ uri: signature }}
              style={styles.signatureImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.timestamp}>
            Signed: {signedAt ? new Date(signedAt).toLocaleDateString() : ""}
          </Text>
        </View>
      ) : (
        <Pressable style={styles.signaturePlaceholder} onPress={onSign}>
          <Text style={styles.placeholderText}>Click here to sign</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAE9EC",
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE9EC",
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#4F4B58",
    fontWeight: "600",
    maxWidth: "80%",
  },
  confirmationBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  confirmationText: { fontSize: 16, color: "#6d6d6dff", flex: 1 },
  label: { fontSize: 16, color: "#4F4B58", marginBottom: 6 },
  signatureDisplay: {
    height: 250,
    borderWidth: 1,
    borderColor: "#EAE9EC",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  signatureImage: { width: "100%", height: "100%" },
  signaturePlaceholder: {
    height: 250,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#c1c2c3",
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: "#A09CAB" },
  timestamp: {
    textAlign: "right",
    color: "#A09CAB",
    fontSize: 12,
    marginTop: 4,
  },
});
