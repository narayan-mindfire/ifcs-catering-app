import React, { useState } from "react";
import { View, Text, Pressable, Image, ScrollView } from "react-native";
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
    <View className="flex-1 border border-border-muted rounded-xl bg-bg-surface">
      <View className="flex-row bg-bg-secondary p-3 border-b border-border-muted rounded-t-xl">
        <Text className="flex-[2] font-semibold text-text-secondary text-lg">
          Full Name
        </Text>
        <Text className="flex-[2] font-semibold text-text-secondary text-lg">
          Type
        </Text>
        <Text className="flex-1 font-semibold text-text-secondary text-lg">
          RAIC #
        </Text>
        <Text className="flex-[2] font-semibold text-text-secondary text-lg">
          Signature
        </Text>
        <Text className="flex-1 font-semibold text-text-secondary text-lg text-center">
          Action
        </Text>
      </View>

      <ScrollView className="flex-1">
        {preparers.length > 0 ? (
          preparers.map((preparer) => (
            <View
              key={preparer.id}
              className="flex-row p-3 border-b border-border-muted items-center"
            >
              <Text className="flex-[2] text-text-primary text-lg">
                {preparer.fullName}
              </Text>
              <Text className="flex-[2] text-text-primary text-lg">
                {preparer.type}
              </Text>
              <Text className="flex-1 text-text-primary text-lg">
                {preparer.raicNumber}
              </Text>

              <View className="flex-[2]">
                {preparer.signature ? (
                  <View className="p-1 border border-border-muted rounded-lg bg-bg-surface">
                    <Image
                      source={{ uri: preparer.signature }}
                      className="h-10 w-full"
                      resizeMode="contain"
                    />
                    {preparer.signedAt && (
                      <Text className="text-base text-text-tertiary mt-0.5">
                        {new Date(preparer.signedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                ) : (
                  <Pressable onPress={() => handleSignClick(preparer.id)}>
                    <Text className="text-text-tertiary underline">
                      Click here to sign
                    </Text>
                  </Pressable>
                )}
              </View>

              <View className="flex-1 items-center">
                <Pressable onPress={() => onDeletePreparer(preparer.id)}>
                  {DeleteIcon ? (
                    <DeleteIcon width={24} height={24} />
                  ) : (
                    <Text className="text-red-500">Delete</Text>
                  )}
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View className="p-5 items-center">
            <Text className="text-text-tertiary">
              No Content Preparers found
            </Text>
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

export default ContentPreparersTab;
