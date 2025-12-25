import React from "react";
import { View } from "react-native";

import {
  CrewCompliance,
  Delivery,
  DriversDeclaration,
  SecurityCompliance,
} from "../../types/deliveries";
import ContentPreparersTab from "../flight-hub/ContentPreparationTab";
import CrewComplianceTab from "../flight-hub/CrewComplianceTab";
import DriversDeclarationTab from "../flight-hub/DriversDeclarationTab";
import SecurityComplianceTab from "../flight-hub/SecurityComplianceTab";
import { TabType } from "./DeliveryTabs";

interface DeliveryContentProps {
  activeTab: TabType;
  flightId: string;
  selectedDelivery: Delivery;
  securityCompliance?: SecurityCompliance;
  driversDeclaration?: DriversDeclaration;
  crewCompliance?: CrewCompliance;

  // Handlers
  onDeletePreparer: (id: string) => void;
  onUpdateSignature: (id: string, signature: string) => void;
  onSecurityUpdate: (comp: SecurityCompliance) => Promise<void>;
  onDriverUpdate: (decl: DriversDeclaration) => Promise<void>;
  onCrewUpdate: (comp: CrewCompliance) => Promise<void>;
}

export const DeliveryContent: React.FC<DeliveryContentProps> = ({
  activeTab,
  flightId,
  selectedDelivery,
  securityCompliance,
  driversDeclaration,
  crewCompliance,
  onDeletePreparer,
  onUpdateSignature,
  onSecurityUpdate,
  onDriverUpdate,
  onCrewUpdate,
}) => {
  return (
    <View className="flex-1 p-4 bg-bg-surface">
      {activeTab === "preparers" && (
        <ContentPreparersTab
          flightId={flightId}
          deliveryId={selectedDelivery.id}
          onDeletePreparer={onDeletePreparer}
          onUpdateSignature={onUpdateSignature}
        />
      )}

      {activeTab === "security" && securityCompliance && (
        <SecurityComplianceTab
          securityCompliance={securityCompliance}
          onUpdateCompliance={onSecurityUpdate}
        />
      )}

      {activeTab === "driver" && driversDeclaration && (
        <DriversDeclarationTab
          driversDeclaration={driversDeclaration}
          onUpdateDeclaration={onDriverUpdate}
        />
      )}

      {activeTab === "crew" && crewCompliance && (
        <CrewComplianceTab
          crewCompliance={crewCompliance}
          onUpdateCompliance={onCrewUpdate}
        />
      )}
    </View>
  );
};
