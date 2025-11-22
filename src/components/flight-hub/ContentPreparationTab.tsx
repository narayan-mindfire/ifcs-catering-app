import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { SignatureModal } from "./SharedComponents";
import { ContentPreparer } from "../../types/deliveries";
import { DeleteIcon } from "../../assets/icons";

interface ContentPreparersTabProps {
  preparers: ContentPreparer[];
  onDeletePreparer: (id: string) => void;
  onUpdateSignature: (id: string, signature: string) => void;
}

const ContentPreparersTab: React.FC<ContentPreparersTabProps> = ({
  preparers,
  onDeletePreparer,
  onUpdateSignature,
}) => {
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signingPreparerId, setSigningPreparerId] = useState<string | null>(
    null,
  );

  const handleSignClick = (preparerId: string) => {
    setSigningPreparerId(preparerId);
    setShowSignatureModal(true);
  };

  const handleSaveSignature = (signature: string) => {
    if (signingPreparerId) {
      onUpdateSignature(signingPreparerId, signature);
      setSigningPreparerId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, { flex: 2 }]}>Full Name</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>Type</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>RAIC #</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>Signature</Text>
        <Text style={[styles.headerText, { flex: 1, textAlign: "center" }]}>
          Action
        </Text>
      </View>

      <ScrollView style={styles.listContainer}>
        {preparers.length > 0 ? (
          preparers.map((preparer) => (
            <View key={preparer.id} style={styles.row}>
              <Text style={[styles.cellText, { flex: 2 }]}>
                {preparer.fullName}
              </Text>
              <Text style={[styles.cellText, { flex: 2 }]}>
                {preparer.type}
              </Text>
              <Text style={[styles.cellText, { flex: 1 }]}>
                {preparer.raicNumber}
              </Text>

              <View style={{ flex: 2 }}>
                {preparer.signature ? (
                  <View style={styles.signatureBox}>
                    <Image
                      source={{ uri: preparer.signature }}
                      style={styles.signatureImage}
                      resizeMode="contain"
                    />
                    {preparer.signedAt && (
                      <Text style={styles.timestamp}>
                        {new Date(preparer.signedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                ) : (
                  <Pressable onPress={() => handleSignClick(preparer.id)}>
                    <Text style={styles.signLink}>Click here to sign</Text>
                  </Pressable>
                )}
              </View>

              <View style={{ flex: 1, alignItems: "center" }}>
                <Pressable onPress={() => onDeletePreparer(preparer.id)}>
                  {DeleteIcon ? (
                    <DeleteIcon width={24} height={24} />
                  ) : (
                    <Text style={{ color: "red" }}>Delete</Text>
                  )}
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No Content Preparers found</Text>
          </View>
        )}
      </ScrollView>

      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSaveSignature}
        title="Sign Here"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#EAE9EC",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#dfdddd",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE9EC",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerText: { fontWeight: "600", color: "#4F4B58", fontSize: 18 },
  listContainer: { flex: 1 },
  row: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE9EC",
    alignItems: "center",
  },
  cellText: { color: "#27262C", fontSize: 18 },
  signatureBox: {
    padding: 4,
    borderWidth: 1,
    borderColor: "#EAE9EC",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  signatureImage: { height: 40, width: "100%" },
  timestamp: { fontSize: 16, color: "#A09CAB", marginTop: 2 },
  signLink: { color: "#A09CAB", textDecorationLine: "underline" },
  emptyState: { padding: 20, alignItems: "center" },
  emptyText: { color: "#A09CAB" },
});

export default ContentPreparersTab;
