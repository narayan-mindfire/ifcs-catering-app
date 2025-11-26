import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AddIcon } from "../../assets/icons";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import ContentPreparersTab from "../../components/flight-hub/ContentPreparationTab";
import DispatcherCommentsTab from "../../components/flight-hub/DispatcherCommentsTab";
import DriversDeclarationTab from "../../components/flight-hub/DriversDeclarationTab";
import SecurityComplianceTab from "../../components/flight-hub/SecurityComplianceTab";
import CrewComplianceTab from "../../components/flight-hub/CrewComplianceTab";
import {
  Delivery,
  ContentPreparer,
  SecurityCompliance,
  DriversDeclaration,
  CrewCompliance,
} from "../../types/deliveries";
import { useFlightStore } from "../../store/useFlightStore";

type TabType = "dispatcher" | "preparers" | "security" | "driver" | "crew";

const DeliveriesScreen: React.FC = () => {
  const flightId = useFlightStore((state) => state.selectedFlight?.id);

  const {
    deliveries,
    selectedDeliveryId,
    isLoading,
    error,
    fetchDeliveries,
    selectDelivery,
    createDelivery,
    updateDelivery,
    addSignature,
    deleteDelivery,
  } = useDeliveryStore();

  const [activeTab, setActiveTab] = useState<TabType>("dispatcher");

  useEffect(() => {
    if (flightId) {
      fetchDeliveries(flightId);
    }
  }, [flightId, fetchDeliveries]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const selectedDelivery = deliveries.find((d) => d.id === selectedDeliveryId);

  // ✅ UPDATED: Now includes Driver and Crew in the list
  const getContentPreparers = (d: Delivery): ContentPreparer[] => {
    const list: ContentPreparer[] = [];

    // 1. TSA
    if (d.tsaName || d.tsaRacNumber) {
      list.push({
        id: `${d.id}-security`,
        fieldPrefix: "security",
        fullName: d.tsaName || "",
        type: "Third Party Security Guard",
        raicNumber: d.tsaRacNumber || "",
        signature: d.tsaSignature || null,
        signedAt: d.tsaSignatureTimestampDisplay
          ? new Date(d.tsaSignatureTimestampDisplay)
          : null,
        note: d.tsaComment,
      });
    }

    // 2. Security (Airline Rep)
    if (d.securityName || d.securityRacNumber) {
      list.push({
        id: `${d.id}-sec`,
        fieldPrefix: "security",
        fullName: d.securityName || "",
        type: "Airline Representative",
        raicNumber: d.securityRacNumber || "",
        signature: d.securitySignature || null,
        signedAt: d.securitySignatureTimestampDisplay
          ? new Date(d.securitySignatureTimestampDisplay)
          : null,
        note: d.securityComment,
      });
    }

    // 3. Driver
    if (d.driverName || d.driverRacNumber) {
      list.push({
        id: `${d.id}-driver`,
        fieldPrefix: "driver",
        fullName: d.driverName || "",
        type: "Driver",
        raicNumber: d.driverRacNumber || "",
        signature: d.driverSignature || null,
        signedAt: d.createdAt ? new Date(d.createdAt) : null, // Uses creation time as proxy if no specific sign date
        note: d.dispatcherComment,
      });
    }

    // 4. Crew
    if (d.crewName || d.crewRacNumber) {
      list.push({
        id: `${d.id}-crew`,
        fieldPrefix: "crew",
        fullName: d.crewName || "",
        type: "Crew",
        raicNumber: d.crewRacNumber || "",
        signature: d.crewSignature || null,
        signedAt: d.crewSignatureTimestampDisplay
          ? new Date(d.crewSignatureTimestampDisplay)
          : null,
        note: d.crewComment,
      });
    }

    return list;
  };

  const getDriversDeclaration = (d: Delivery): DriversDeclaration => ({
    driverName: d.driverName || "",
    raicNumber: d.driverRacNumber || "",
    truckSeal: d.truckSeal || "",
    company: d.driverCompany || "",
    sealIntact: !!d.driverSignature,
    confirmationText: "I (the driver) confirm the SEAL is intact",
    signature: d.driverSignature || null,
    signedAt: d.createdAt ? new Date(d.createdAt) : null,
  });

  const getCrewCompliance = (d: Delivery): CrewCompliance => ({
    isCompliant: !!d.crewSignature,
    confirmationText: "I confirm crew compliance",
    signature: d.crewSignature || null,
    signedAt: d.crewSignatureTimestampDisplay
      ? new Date(d.crewSignatureTimestampDisplay)
      : null,
    name: d.crewName,
    raicNumber: d.crewRacNumber,
  });

  const getSecurityCompliance = (d: Delivery): SecurityCompliance => ({
    isCompliant: !!d.securitySignature,
    confirmationText: "Security checks passed",
    signature: d.securitySignature || null,
    signedAt: d.securitySignatureTimestampDisplay
      ? new Date(d.securitySignatureTimestampDisplay)
      : null,
    name: d.securityName,
    raicNumber: d.securityRacNumber,
  });

  const handleAddNewDelivery = () => {
    const name = `Delivery ${deliveries.length + 1}`;
    createDelivery(flightId!, name);
  };

  const handleDeleteDelivery = (deliveryId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this delivery?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteDelivery(flightId!, deliveryId),
        },
      ],
    );
  };

  // Note: Only adds TSA/Security via this specific button in ContentPreparersTab
  // Driver/Crew usually added via their specific tabs, but if needed, logic is here.
  const handleAddPreparer = (preparer: any) => {
    if (!selectedDeliveryId) return;
    const d = selectedDelivery!;
    const payload: Partial<Delivery> = {};

    if (!d.tsaName) {
      payload.tsaName = preparer.fullName;
      payload.tsaRacNumber = preparer.raicNumber;
      payload.tsaComment = preparer.note;
    } else if (!d.securityName) {
      payload.securityName = preparer.fullName;
      payload.securityRacNumber = preparer.raicNumber;
      payload.securityComment = preparer.note;
    } else {
      Alert.alert(
        "Error",
        "Slots full. Please use specific tabs for Driver/Crew.",
      );
      return;
    }

    updateDelivery(flightId!, selectedDeliveryId, payload);
  };

  // ✅ UPDATED: Handles signatures for Driver and Crew from the list
  const handleUpdatePreparerSignature = (
    preparerId: string,
    signature: string,
  ) => {
    if (!selectedDeliveryId) return;

    if (preparerId.endsWith("-security")) {
      addSignature(flightId!, selectedDeliveryId, "security", signature);
    } else if (preparerId.endsWith("-sec")) {
      updateDelivery(flightId!, selectedDeliveryId, {
        securitySignature: signature,
        securitySignatureTimestampDisplay: new Date().toISOString(),
      });
    } else if (preparerId.endsWith("-driver")) {
      addSignature(flightId!, selectedDeliveryId, "driver", signature);
    } else if (preparerId.endsWith("-crew")) {
      addSignature(flightId!, selectedDeliveryId, "crew", signature);
    }
  };

  // ✅ UPDATED: Handles deletion for Driver and Crew from the list
  const handleDeletePreparer = (id: string) => {
    if (!selectedDeliveryId) return;

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this preparer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const payload: Partial<Delivery> = {};

            if (id.endsWith("-security")) {
              payload.tsaName = "";
              payload.tsaRacNumber = "";
              payload.tsaComment = "";
              payload.tsaSignature = "";
            } else if (id.endsWith("-sec")) {
              payload.securityName = "";
              payload.securityRacNumber = "";
              payload.securityComment = "";
              payload.securitySignature = "";
            } else if (id.endsWith("-driver")) {
              payload.driverName = "";
              payload.driverRacNumber = "";
              payload.driverCompany = "";
              payload.driverSignature = "";
              payload.truckSeal = "";
            } else if (id.endsWith("-crew")) {
              payload.crewName = "";
              payload.crewRacNumber = "";
              payload.crewSignature = "";
            }

            updateDelivery(flightId!, selectedDeliveryId, payload);
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 flex-row bg-bg-surface">
      {/* Sidebar */}
      <View className="w-[260px] border-r border-border-muted p-4 bg-bg-surface">
        <View className="pb-4 border-b border-border-muted mb-4">
          <Text className="text-lg font-semibold text-text-primary mb-3">
            Deliveries ({deliveries.length})
          </Text>
          <Pressable
            onPress={handleAddNewDelivery}
            disabled={isLoading}
            className={`flex-row items-center justify-center bg-bg-tertiary p-2.5 rounded-lg gap-2 ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            {AddIcon ? (
              <AddIcon width={16} height={16} />
            ) : (
              <Text className="text-lg">+</Text>
            )}
            <Text className="text-lg text-text-primary">Add New Delivery</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1">
          {deliveries.map((delivery) => (
            <Pressable
              key={delivery.id}
              onPress={() => selectDelivery(delivery.id)}
              onLongPress={() => handleDeleteDelivery(delivery.id)}
              className={`p-3 rounded-lg mb-2 ${
                selectedDeliveryId === delivery.id
                  ? "bg-bg-accent border border-bg-primary"
                  : "bg-bg-tertiary"
              }`}
            >
              <Text
                className={`text-base ${
                  selectedDeliveryId === delivery.id
                    ? "text-text-primary font-semibold"
                    : "text-text-primary"
                }`}
              >
                {delivery.deliveryName}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <View className="flex-1 flex-col">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#602AF3" />
            <Text className="text-text-tertiary mt-4">Loading...</Text>
          </View>
        ) : selectedDelivery ? (
          <>
            {/* Tabs */}
            <View className="p-4 pb-0 bg-bg-surface h-[60px] w-auto">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  backgroundColor: "#f0f0f0",
                  borderRadius: 25,
                  padding: 1,
                  alignItems: "center",
                  minWidth: "100%",
                  justifyContent: "space-between",
                }}
              >
                <TabButton
                  title="Dispatcher Comments"
                  active={activeTab === "dispatcher"}
                  onPress={() => setActiveTab("dispatcher")}
                />
                <TabButton
                  title="Content Preparers"
                  active={activeTab === "preparers"}
                  onPress={() => setActiveTab("preparers")}
                />
                <TabButton
                  title="Security Compliance"
                  active={activeTab === "security"}
                  onPress={() => setActiveTab("security")}
                />
                <TabButton
                  title="Driver Compliance"
                  active={activeTab === "driver"}
                  onPress={() => setActiveTab("driver")}
                />
                <TabButton
                  title="Crew Compliance"
                  active={activeTab === "crew"}
                  onPress={() => setActiveTab("crew")}
                />
              </ScrollView>
            </View>

            {/* Tab Content */}
            <View className="flex-1 p-4 bg-bg-surface">
              {activeTab === "dispatcher" && <DispatcherCommentsTab />}

              {activeTab === "preparers" && (
                <ContentPreparersTab
                  preparers={getContentPreparers(selectedDelivery)}
                  onDeletePreparer={handleDeletePreparer}
                  onUpdateSignature={handleUpdatePreparerSignature}
                />
              )}

              {activeTab === "security" && (
                <SecurityComplianceTab
                  onAddPreparer={handleAddPreparer}
                  securityCompliance={getSecurityCompliance(selectedDelivery)}
                  onUpdateCompliance={(comp) => {
                    if (!selectedDeliveryId) return;

                    const payload: Partial<Delivery> = {
                      securityName: comp.name,
                      securityRacNumber: comp.raicNumber,
                    };

                    if (
                      comp.signature &&
                      comp.signature !== selectedDelivery.securitySignature
                    ) {
                      addSignature(
                        flightId!,
                        selectedDeliveryId,
                        "security",
                        comp.signature,
                      );
                    } else {
                      updateDelivery(flightId!, selectedDeliveryId, payload);
                    }
                  }}
                />
              )}

              {activeTab === "driver" && (
                <DriversDeclarationTab
                  driversDeclaration={getDriversDeclaration(selectedDelivery)}
                  onUpdateDeclaration={(decl) => {
                    if (!selectedDeliveryId) return;

                    const payload: Partial<Delivery> = {
                      driverName: decl.driverName,
                      driverRacNumber: decl.raicNumber,
                      truckSeal: decl.truckSeal,
                      driverCompany: decl.company,
                    };

                    if (
                      decl.signature &&
                      decl.signature !== selectedDelivery.driverSignature
                    ) {
                      addSignature(
                        flightId!,
                        selectedDeliveryId,
                        "driver",
                        decl.signature,
                      );
                    }
                    updateDelivery(flightId!, selectedDeliveryId, payload);
                  }}
                />
              )}

              {activeTab === "crew" && (
                <CrewComplianceTab
                  onAddPreparer={handleAddPreparer}
                  crewCompliance={getCrewCompliance(selectedDelivery)}
                  onUpdateCompliance={(comp) => {
                    if (!selectedDeliveryId) return;

                    const payload: Partial<Delivery> = {
                      crewName: comp.name,
                      crewRacNumber: comp.raicNumber,
                    };

                    if (
                      comp.signature &&
                      comp.signature !== selectedDelivery.crewSignature
                    ) {
                      addSignature(
                        flightId!,
                        selectedDeliveryId,
                        "crew",
                        comp.signature,
                      );
                    } else {
                      updateDelivery(flightId!, selectedDeliveryId, payload);
                    }
                  }}
                />
              )}
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-text-tertiary mb-2">
              No delivery selected
            </Text>
            <Text className="text-3xl text-text-tertiary">
              Add a new delivery or select one
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const TabButton = ({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className={`py-2.5 px-5 rounded-[20px] ${active ? "bg-bg-secondary" : ""}`}
  >
    <Text
      className={`text-lg ${
        active ? "text-text-primary font-semibold" : "text-text-secondary"
      }`}
    >
      {title}
    </Text>
  </Pressable>
);

export default DeliveriesScreen;
