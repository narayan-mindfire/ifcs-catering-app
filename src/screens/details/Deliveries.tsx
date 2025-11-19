import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
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
      crewCompliance: null, // <--- ADDED INITIALIZATION
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
          ? { ...d, securityCompliance: compliance, updatedAt: new Date() } // <--- FIXED KEY (was tsaCompliance)
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
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>
            Deliveries ({deliveries.length})
          </Text>
          <Pressable onPress={handleAddNewDelivery} style={styles.addButton}>
            {AddIcon ? (
              <AddIcon width={16} height={16} />
            ) : (
              <Text style={{ fontSize: 16, color: "#27262C" }}>+</Text>
            )}
            <Text style={styles.addButtonText}>Add New Delivery</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.deliveryList}>
          {deliveries.map((delivery) => (
            <Pressable
              key={delivery.id}
              onPress={() => setSelectedDeliveryId(delivery.id)}
              style={[
                styles.deliveryItem,
                selectedDeliveryId === delivery.id
                  ? styles.deliveryItemSelected
                  : null,
              ]}
            >
              <Text
                style={[
                  styles.deliveryItemText,
                  selectedDeliveryId === delivery.id && {
                    color: "#27262C",
                    fontWeight: "600",
                  },
                ]}
              >
                Delivery {delivery.deliveryNumber}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.mainContent}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#602AF3" />
          </View>
        ) : selectedDelivery ? (
          <>
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabBarContent} // Use contentContainerStyle for inner layout
                style={styles.tabBar} // Style for the ScrollView itself
              >
                <Pressable
                  onPress={() => setActiveTab("dispatcher")}
                  style={[
                    styles.tabButton,
                    activeTab === "dispatcher" && styles.tabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "dispatcher" && styles.tabTextActive,
                    ]}
                  >
                    Dispatcher Comments
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab("preparers")}
                  style={[
                    styles.tabButton,
                    activeTab === "preparers" && styles.tabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "preparers" && styles.tabTextActive,
                    ]}
                  >
                    Content Preparers
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab("tsa")}
                  style={[
                    styles.tabButton,
                    activeTab === "tsa" && styles.tabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "tsa" && styles.tabTextActive,
                    ]}
                  >
                    Security Compliance
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab("driver")}
                  style={[
                    styles.tabButton,
                    activeTab === "driver" && styles.tabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "driver" && styles.tabTextActive,
                    ]}
                  >
                    Driver&apos;s Declaration
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab("crew")}
                  style={[
                    styles.tabButton,
                    activeTab === "crew" && styles.tabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "crew" && styles.tabTextActive,
                    ]}
                  >
                    Crew Compliance
                  </Text>
                </Pressable>
              </ScrollView>
            </View>

            <View style={styles.contentArea}>
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
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No delivery selected</Text>
            <Text style={styles.emptySub}>
              Add a new delivery or select one from the sidebar
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },

  sidebar: {
    width: 260,
    borderRightWidth: 1,
    borderRightColor: "#EAE9EC",
    padding: 16,
    backgroundColor: "#fff",
  },
  sidebarHeader: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE9EC",
    marginBottom: 16,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#27262C",
    marginBottom: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: { fontSize: 18, color: "#27262C" },
  deliveryList: { flex: 1 },
  deliveryItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  deliveryItemSelected: {
    backgroundColor: "#E2D8FD",
    borderWidth: 1,
    borderColor: "#B79EFA",
  },
  deliveryItemText: { fontSize: 16, color: "#27262C" },

  mainContent: { flex: 1, flexDirection: "column" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  tabContainer: {
    padding: 16,
    paddingBottom: 0,
    backgroundColor: "#fff",
    height: 60,
    width: "auto",
  },

  tabBar: {
    flexGrow: 0,
  },

  tabBarContent: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    padding: 1,
    alignItems: "center",
    minWidth: "100%",
    justifyContent: "space-between",
  },

  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabActive: { backgroundColor: "#dfdddd" },
  tabText: { fontSize: 18, color: "#4F4B58" },
  tabTextActive: { color: "#27262C", fontWeight: "600" },

  contentArea: { flex: 1, padding: 16, backgroundColor: "#fff" },

  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 18, color: "#A09CAB", marginBottom: 8 },
  emptySub: { fontSize: 14, color: "#A09CAB" },
});

export default DeliveriesScreen;
