import React from "react";
import { Text, View } from "react-native";

interface TruckAssignment {
  id: string;
  assetName: string;
  vehicleNumber?: string;
  assetCategory?: string;
  dispatchAssignments?: {
    id: string;
    status: string;
    assignedStaff?: {
      userId: string;
      firstName: string;
      lastName: string;
      role: string;
    }[];
  }[];
}

interface DispatchPanelProps {
  trucks?: TruckAssignment[];
}

export const DispatchPanel: React.FC<DispatchPanelProps> = ({ trucks }) => {
  if (!trucks || trucks.length === 0) return null;

  return (
    <View className="bg-bg-surface rounded-xl p-4 mt-4 border border-border-muted">
      <Text className="text-text-secondary text-sm font-bold mb-3 uppercase tracking-wider">
        Dispatch Assignments
      </Text>
      <View className="flex-row flex-wrap gap-4">
        {trucks.map((truck) => (
          <View
            key={truck.id}
            className="flex-1 min-w-[250px] bg-bg-quaternary p-4 rounded-xl border border-border-muted"
          >
            <View className="flex-row justify-between items-start mb-3">
              <View>
                <Text className="text-text-primary font-bold text-base">
                  {truck.assetName}
                </Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <View className="bg-bg-tertiary px-2 py-0.5 rounded-full border border-border-muted">
                    <Text className="text-text-secondary text-[10px] font-bold">
                      {truck.vehicleNumber}
                    </Text>
                  </View>
                  <Text className="text-text-tertiary text-[10px]">
                    {truck.assetCategory}
                  </Text>
                </View>
              </View>
            </View>
            {truck.dispatchAssignments?.map((assignment) => (
              <View
                key={assignment.id}
                className="mt-2 pt-3 border-t border-border-muted"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-text-secondary text-[10px] font-bold uppercase">
                    Assigned Staff
                  </Text>
                  <View className="bg-green-100 px-1.5 py-0.5 rounded">
                    <Text className="text-green-700 text-[10px] font-bold">
                      {assignment.status}
                    </Text>
                  </View>
                </View>
                <View className="gap-y-2">
                  {assignment.assignedStaff?.map((staff) => (
                    <View
                      key={staff.userId}
                      className="flex-row justify-between items-center bg-bg-surface p-2 rounded-lg border border-border-muted"
                    >
                      <View>
                        <Text className="text-text-primary text-xs font-medium">
                          {staff.firstName} {staff.lastName}
                        </Text>
                      </View>
                      <View className="bg-bg-tertiary px-2 py-0.5 rounded border border-border-muted">
                        <Text className="text-text-tertiary text-[10px] font-bold">
                          {staff.role}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};
