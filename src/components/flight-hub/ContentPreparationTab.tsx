import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { DeleteIcon } from "../../assets/icons";
import { useAuthStore } from "../../store/useAuthStore";
import { useFlightPreparationStore } from "../../store/useFlightPreparationStore";
import { formatDate } from "../../utils/dateFormatter";
import { SignatureModal } from "./SharedComponents";

interface ContentPreparersTabProps {
  flightId: string;
  deliveryId: string;
  onDeletePreparer?: (id: string) => void;
  onUpdateSignature?: (id: string, signature: string) => void;
}

const ContentPreparersTab: React.FC<ContentPreparersTabProps> = ({
  flightId,
  deliveryId,
  onDeletePreparer,
  onUpdateSignature,
}) => {
  const { userSignatures, checkUserSignature } = useFlightPreparationStore();

  const [loading, setLoading] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signingUserId, setSigningUserId] = useState<string | null>(null);

  const { user } = useAuthStore();
  useEffect(() => {
    const fetchData = async () => {
      if (flightId && deliveryId && user?.id) {
        setLoading(true);
        await checkUserSignature(flightId, deliveryId);
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId, deliveryId, user?.id]);

  const handleSignClick = (userId: string) => {
    setSigningUserId(userId);
    setShowSignatureModal(true);
  };

  const handleSaveSignature = (signature: string) => {
    if (signingUserId && onUpdateSignature) {
      onUpdateSignature(signingUserId, signature);
      setSigningUserId(null);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-bg-surface h-40">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

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
          Staff #
        </Text>
        <Text className="flex-[2] font-semibold text-text-secondary text-lg">
          Signature
        </Text>
        <Text className="flex-1 font-semibold text-text-secondary text-lg text-center">
          Action
        </Text>
      </View>

      <ScrollView className="flex-1">
        {userSignatures && userSignatures.length > 0 ? (
          userSignatures.map((item) => (
            <View
              key={item.id}
              className="flex-row p-3 border-b border-border-muted items-center"
            >
              <Text className="flex-[2] text-text-primary text-lg">
                {item.userFirstName} {item.userLastName}
              </Text>
              <Text className="flex-[2] text-text-primary text-lg">
                {item.userType}
              </Text>
              <Text className="flex-1 text-text-primary text-lg">
                {item.userBadgeNumber || "-"}
              </Text>

              <View className="flex-[2]">
                {item.signature ? (
                  <View className="p-1 border border-border-muted rounded-lg bg-bg-surface">
                    <Image
                      source={{ uri: item.signature }}
                      className="h-10 w-full"
                      resizeMode="contain"
                    />
                    {item.createdAt && (
                      <Text className="text-xs text-right text-text-tertiary mt-0.5">
                        {formatDate(String(item.createdAt))}
                      </Text>
                    )}
                  </View>
                ) : (
                  <Pressable onPress={() => handleSignClick(item.userId)}>
                    <Text className="text-bg-button underline">
                      Click here to sign
                    </Text>
                  </Pressable>
                )}
              </View>

              <View className="flex-1 items-center">
                <Pressable
                  onPress={() => onDeletePreparer && onDeletePreparer(item.id)}
                >
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
              No Content Preparers yet.
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
