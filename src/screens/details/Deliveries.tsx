import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { AddIcon } from "../../assets/icons";
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

type TabType = "dispatcher" | "preparers" | "tsa" | "driver" | "crew";

const DeliveriesScreen: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<TabType>("dispatcher");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const selectedDelivery = deliveries.find((d) => d.id === selectedDeliveryId);

  const handleAddNewDelivery = () => {
    const newDelivery: Delivery = {
      id: uuidv4(),
      deliveryNumber: deliveries.length + 1,
      contentPreparers: [],
      securityCompliance: null,
      crewCompliance: null,
      driversDeclaration: null,
      securityDeclaration: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDeliveries([...deliveries, newDelivery]);
    setSelectedDeliveryId(newDelivery.id);
  };

  const handleAddPreparer = (
    preparer: Omit<ContentPreparer, "id" | "signature" | "signedAt">,
  ) => {
    if (!selectedDeliveryId) return;
    const newPreparer: ContentPreparer = {
      ...preparer,
      id: uuidv4(),
      signature: null,
      signedAt: null,
    };
    setDeliveries(
      deliveries.map((d) =>
        d.id === selectedDeliveryId
          ? {
              ...d,
              contentPreparers: [...d.contentPreparers, newPreparer],
              updatedAt: new Date(),
            }
          : d,
      ),
    );
  };

  const handleDeletePreparer = (preparerId: string) => {
    if (!selectedDeliveryId) return;
    setDeliveries(
      deliveries.map((d) =>
        d.id === selectedDeliveryId
          ? {
              ...d,
              contentPreparers: d.contentPreparers.filter(
                (p) => p.id !== preparerId,
              ),
              updatedAt: new Date(),
            }
          : d,
      ),
    );
  };

  const handleUpdatePreparerSignature = (
    preparerId: string,
    signature: string,
  ) => {
    if (!selectedDeliveryId) return;
    setDeliveries(
      deliveries.map((d) =>
        d.id === selectedDeliveryId
          ? {
              ...d,
              contentPreparers: d.contentPreparers.map((p) =>
                p.id === preparerId
                  ? { ...p, signature, signedAt: new Date() }
                  : p,
              ),
              updatedAt: new Date(),
            }
          : d,
      ),
    );
  };

  const handleUpdateSecurityCompliance = (compliance: SecurityCompliance) => {
    if (!selectedDeliveryId) return;
    setDeliveries(
      deliveries.map((d) =>
        d.id === selectedDeliveryId
          ? { ...d, securityCompliance: compliance, updatedAt: new Date() }
          : d,
      ),
    );
  };

  const handleUpdateCrewCompliance = (compliance: CrewCompliance) => {
    if (!selectedDeliveryId) return;
    setDeliveries(
      deliveries.map((d) =>
        d.id === selectedDeliveryId
          ? { ...d, crewCompliance: compliance, updatedAt: new Date() }
          : d,
      ),
    );
  };

  const handleUpdateDriversDeclaration = (declaration: DriversDeclaration) => {
    if (!selectedDeliveryId) return;
    setDeliveries(
      deliveries.map((d) =>
        d.id === selectedDeliveryId
          ? { ...d, driversDeclaration: declaration, updatedAt: new Date() }
          : d,
      ),
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
            className="flex-row items-center justify-center bg-bg-tertiary p-2.5 rounded-lg gap-2"
          >
            {AddIcon ? (
              <AddIcon width={16} height={16} />
            ) : (
              <Text className="text-lg text-text-primary">+</Text>
            )}
            <Text className="text-lg text-text-primary">Add New Delivery</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1">
          {deliveries.map((delivery) => (
            <Pressable
              key={delivery.id}
              onPress={() => setSelectedDeliveryId(delivery.id)}
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
                Delivery {delivery.deliveryNumber}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="flex-1 flex-col">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#602AF3" />
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
                style={{ flexGrow: 0 }}
              >
                <Pressable
                  onPress={() => setActiveTab("dispatcher")}
                  className={`py-2.5 px-5 rounded-[20px] ${
                    activeTab === "dispatcher" ? "bg-bg-secondary" : ""
                  }`}
                >
                  <Text
                    className={`text-lg ${
                      activeTab === "dispatcher"
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    Dispatcher Comments
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab("preparers")}
                  className={`py-2.5 px-5 rounded-[20px] ${
                    activeTab === "preparers" ? "bg-bg-secondary" : ""
                  }`}
                >
                  <Text
                    className={`text-lg ${
                      activeTab === "preparers"
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    Content Preparers
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab("tsa")}
                  className={`py-2.5 px-5 rounded-[20px] ${
                    activeTab === "tsa" ? "bg-bg-secondary" : ""
                  }`}
                >
                  <Text
                    className={`text-lg ${
                      activeTab === "tsa"
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    Security Compliance
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab("driver")}
                  className={`py-2.5 px-5 rounded-[20px] ${
                    activeTab === "driver" ? "bg-bg-secondary" : ""
                  }`}
                >
                  <Text
                    className={`text-lg ${
                      activeTab === "driver"
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    Driver&apos;s Declaration
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab("crew")}
                  className={`py-2.5 px-5 rounded-[20px] ${
                    activeTab === "crew" ? "bg-bg-secondary" : ""
                  }`}
                >
                  <Text
                    className={`text-lg ${
                      activeTab === "crew"
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    Crew Compliance
                  </Text>
                </Pressable>
              </ScrollView>
            </View>

            <View className="flex-1 p-4 bg-bg-surface">
              {activeTab === "dispatcher" && <DispatcherCommentsTab />}
              {activeTab === "preparers" && (
                <ContentPreparersTab
                  preparers={selectedDelivery.contentPreparers}
                  onDeletePreparer={handleDeletePreparer}
                  onUpdateSignature={handleUpdatePreparerSignature}
                />
              )}
              {activeTab === "tsa" && (
                <SecurityComplianceTab
                  onAddPreparer={handleAddPreparer}
                  securityCompliance={selectedDelivery.securityCompliance}
                  onUpdateCompliance={handleUpdateSecurityCompliance}
                />
              )}
              {activeTab === "driver" && (
                <DriversDeclarationTab
                  driversDeclaration={selectedDelivery.driversDeclaration}
                  onUpdateDeclaration={handleUpdateDriversDeclaration}
                />
              )}
              {activeTab === "crew" && (
                <CrewComplianceTab
                  onAddPreparer={handleAddPreparer}
                  crewCompliance={selectedDelivery.crewCompliance}
                  onUpdateCompliance={handleUpdateCrewCompliance}
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
              Add a new delivery or select one from the sidebar
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DeliveriesScreen;
