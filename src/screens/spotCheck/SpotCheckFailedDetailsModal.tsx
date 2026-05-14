import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { FlightsIcon, NoFlightsIcon } from "@/assets/icons";
import { formatDateDetail } from "@/utils/dateFormatter";

interface Props {
  visible: boolean;
  onClose: () => void;
  data: any | null;
}

export const SpotCheckDetailsModal: React.FC<Props> = ({
  visible,
  onClose,
  data,
}) => {
  if (!data) return null;

  const isPass = data.isPass;
  const compliance = data.compliance;
  const hasImages = compliance?.images && compliance.images.length > 0;

  const DetailRow = ({ label, value, isFullWidth = false }: any) => (
    <View className={`mb-4 ${isFullWidth ? "w-full" : "w-[48%]"}`}>
      <Text className="text-xs text-text-tertiary mb-1 uppercase tracking-wider">
        {label}
      </Text>
      <Text className="text-sm text-text-primary font-medium">
        {value || "N/A"}
      </Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="h-[85%] bg-bg-surface rounded-t-3xl overflow-hidden">
          <View className="flex-row justify-between items-center p-5 border-b border-border-muted bg-bg-quaternary">
            <View>
              <Text className="text-lg font-bold text-text-primary">
                Check Details
              </Text>
              <Text className="text-sm text-text-secondary">
                ID: {data.id.slice(0, 8).toUpperCase()}...
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-bg-secondary justify-center items-center"
            >
              <Text>X</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View
              className={`p-6 items-center justify-center ${
                isPass ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <View
                className={`w-16 h-16 rounded-full items-center justify-center mb-2 ${
                  isPass ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {isPass ? <NoFlightsIcon /> : <FlightsIcon />}
              </View>
              <Text
                className={`text-xl font-bold ${
                  isPass ? "text-green-700" : "text-red-700"
                }`}
              >
                {isPass ? "Passed Check" : "Check Failed"}
              </Text>
              {!isPass && compliance?.reason && (
                <Text className="text-red-600 mt-1 font-medium">
                  {compliance.reason}
                </Text>
              )}
            </View>

            {!isPass && compliance && (
              <View className="p-5 border-b border-border-muted">
                <Text className="text-base font-bold text-text-primary mb-4">
                  Non-Compliance Report
                </Text>

                <View className="bg-bg-quaternary p-4 rounded-xl border border-border-muted mb-4">
                  <Text className="text-xs text-text-tertiary mb-1">
                    Inspector Remarks
                  </Text>
                  <Text className="text-text-secondary italic">
                    &rdquo;
                    {compliance.remarks || "No additional remarks provided."}
                    &quot;
                  </Text>
                </View>

                {hasImages ? (
                  <View>
                    <Text className="text-xs text-text-tertiary mb-3">
                      Visual Evidence ({compliance.images.length})
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="flex-row"
                    >
                      {compliance.images.map((img: any, index: number) => (
                        <View key={img.id} className="mr-3 relative">
                          <Image
                            source={{ uri: img.imageUrl }}
                            className="w-48 h-48 rounded-lg bg-bg-secondary border border-border-muted"
                            resizeMode="cover"
                          />
                          <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded">
                            <Text className="text-white text-[10px]">
                              #{index + 1}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <Text className="text-text-muted text-sm py-2">
                    No images attached to this report.
                  </Text>
                )}
              </View>
            )}

            <View className="p-5">
              <Text className="text-base font-bold text-text-primary mb-4">
                Flight & Item Information
              </Text>

              <View className="flex-row flex-wrap justify-between">
                <DetailRow
                  label="Item Name"
                  value={data.preparationName}
                  isFullWidth
                />
                <DetailRow
                  label="Flight"
                  value={`${data.carrier} (${data.flightNumber})`}
                />
                <DetailRow
                  label="Route"
                  value={`${data.departure} - ${data.arrival}`}
                />
                <DetailRow
                  label="Galley Position"
                  value={data.galleyDetails?.galleyPosition}
                />
                <DetailRow
                  label="Container/Stowage"
                  value={data.position || data.galleyDetails?.containerNumber}
                />
                <DetailRow
                  label="Loading Plan"
                  value={data.loadingPlan}
                  isFullWidth
                />
                <DetailRow
                  label="Check Time"
                  value={formatDateDetail(data.createdAt)}
                  isFullWidth
                />
              </View>
            </View>

            <View className="h-10" />
          </ScrollView>

          <View className="p-4 border-t border-border-muted bg-bg-surface">
            <TouchableOpacity
              onPress={onClose}
              className="bg-bg-button py-4 rounded-xl items-center shadow-sm"
            >
              <Text className="text-text-surface font-bold text-base">
                Close Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
