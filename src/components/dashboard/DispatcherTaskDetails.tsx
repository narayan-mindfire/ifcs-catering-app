import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { RootStackParamList } from "../../navigation/AppNavigator";

interface TaskStep {
  id: string;
  label: string;
  hasForm: boolean;
  formLabel?: string;
}

interface TaskDetail {
  taskId: string;
  jobType: string;
  flightNumber: string;
  takeOffTime: string;
  aircraft: string;
  registration: string;
  truck: string;
  loadingBay: string;
  reachBayAt: string;
  timeToLoad: string;
  galleysToLoad: string;
  assignedStaff: string[];
  nextSteps: TaskStep[];
  flightId?: string; // Added for navigation
}

interface DispatcherTaskDetailsProps {
  task: TaskDetail;
  checkedSteps: Record<string, boolean>;
  onToggleStep: (id: string) => void;
}

type NavigationProp = StackNavigationProp<RootStackParamList, "Dashboard">;

export const DispatcherTaskDetails: React.FC<DispatcherTaskDetailsProps> = ({
  task,
  checkedSteps,
  onToggleStep,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleStepPress = (step: TaskStep) => {
    if (step.id === "declaration") {
      navigation.navigate("FlightDetails", {
        flightId: task.flightId || "mock-flight-id",
        flightNumber: task.flightNumber,
        route: "KWI-DXB", // Mock route
        date: new Date().toISOString(),
        // @ts-ignore - passing extra params for tab navigation handling
        screen: "Deliveries",
        params: {
          openDriverDeclaration: true,
        },
      });
    } else {
      onToggleStep(step.id);
    }
  };

  return (
    <View className="flex-row gap-4">
      {/* Left: flight details */}
      <View className="flex-1">
        <View className="flex-row flex-wrap gap-y-4">
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">Flight #</Text>
            <Text className="text-lg font-bold text-text-primary">
              {task.flightNumber}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">
              Take Off Time
            </Text>
            <Text className="text-lg font-bold text-text-primary">
              {task.takeOffTime}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">
              Aircraft | Reg
            </Text>
            <Text className="text-lg font-bold text-text-primary">
              {task.aircraft} | {task.registration}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">Truck</Text>
            <Text className="text-lg font-bold text-text-primary underline">
              {task.truck}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">Loading Bay</Text>
            <Text className="text-lg font-bold text-text-primary">
              {task.loadingBay}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">
              Reach Bay at
            </Text>
            <Text className="text-lg font-bold text-text-primary">
              {task.reachBayAt}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">Job Type</Text>
            <Text className="text-lg font-bold text-text-primary">
              {task.jobType}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">
              Time to Load
            </Text>
            <Text className="text-lg font-bold text-text-primary">
              {task.timeToLoad}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">
              Galleys to Load
            </Text>
            <Text className="text-lg font-bold text-text-primary">
              {task.galleysToLoad}
            </Text>
          </View>
        </View>

        {/* Assigned Staff */}
        <View className="mt-4">
          <Text className="text-sm text-text-tertiary mb-2">
            Assigned Staff
          </Text>
          <View className="flex-row gap-2">
            {task.assignedStaff.map((s, i) => (
              <View
                key={i}
                className="w-10 h-10 rounded-full bg-bg-tertiary items-center justify-center border border-border-muted"
              >
                <Text className="text-xs text-text-secondary">{s[0]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Right: Next Steps */}
      <View className="w-48">
        <Text className="text-sm text-text-tertiary mb-3">Next Steps</Text>
        <View className="gap-3">
          {task.nextSteps.map((step) => (
            <View key={step.id}>
              <View className="flex-row items-center gap-2 mb-1">
                <TouchableOpacity
                  onPress={() => handleStepPress(step)}
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    checkedSteps[step.id]
                      ? "bg-[#602AF3] border-[#602AF3]"
                      : "border-border-muted bg-transparent"
                  }`}
                >
                  {checkedSteps[step.id] && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStepPress(step)}>
                  <Text className="text-base text-text-primary">
                    {step.label}
                  </Text>
                </TouchableOpacity>
              </View>
              {step.hasForm && (
                <TouchableOpacity className="border border-[#602AF3] rounded-xl py-2 px-3 mt-1">
                  <Text className="text-[#602AF3] text-sm font-semibold text-center">
                    {step.formLabel}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
