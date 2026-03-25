import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { UnifiedTask } from "../../types/task";
import { log } from "../../utils/logger";

interface TaskStep {
  id: string;
  label: string;
  hasForm: boolean;
  formLabel?: string;
}

interface DispatcherTaskDetailsProps {
  task: UnifiedTask;
}

type NavigationProp = StackNavigationProp<RootStackParamList, "Dashboard">;

export const DispatcherTaskDetails: React.FC<DispatcherTaskDetailsProps> = ({
  task,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setCheckedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const details = task.taskDetails || {};

  const steps: TaskStep[] = [
    {
      id: "a-check",
      label: "A-Check",
      hasForm: false,
    },
    {
      id: "job-type",
      label: details.jobType || "Job Type",
      hasForm: false,
    },
    { id: "declaration", label: "Declaration", hasForm: false },
  ];

  const handleStepPress = (step: TaskStep) => {
    if (step.id === "declaration") {
      log.info("Declaration step triggered", {
        details,
        flightId: details.flightId,
        flightNo: details.flightNo,
      });

      navigation.navigate("FlightDetails", {
        flightId: details.flightId || "mock-flight-id",
        flightNumber: details.flightNo || "Unknown",
        route: details.route || "Unknown",
        date: new Date().toISOString(),
        // @ts-ignore
        screen: "Deliveries",
        params: {
          openDriverDeclaration: true,
        },
      });
    } else {
      toggleStep(step.id);
    }
  };

  const assignedStaff = details.assignedStaff || {};
  const loaders = assignedStaff.loader || [];

  return (
    <View className="flex-row gap-4">
      {/* Left: flight details */}
      <View className="flex-1">
        <View className="flex-row flex-wrap gap-y-4">
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">Flight #</Text>
            <Text className="text-lg font-bold text-text-primary">
              {details.flightNo || "-"}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">
              Take Off Time
            </Text>
            <Text className="text-lg font-bold text-text-primary">
              {details.takeOffTime
                ? new Date(details.takeOffTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">
              Aircraft | Reg
            </Text>
            <Text className="text-lg font-bold text-text-primary">
              {details.aircraftReg || "-"}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">Truck</Text>
            <Text className="text-lg font-bold text-text-primary underline">
              {details.truckNo || "-"}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">Loading Bay</Text>
            <Text className="text-lg font-bold text-text-primary">
              {details.loadingBay || "-"}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">
              Reach Bay at
            </Text>
            <Text className="text-lg font-bold text-text-primary">
              {details.reachBayAt
                ? new Date(details.reachBayAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">Job Type</Text>
            <Text className="text-lg font-bold text-text-primary">
              {details.jobType || "-"}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">
              Time to Load
            </Text>
            <Text className="text-lg font-bold text-text-primary">
              {details.timeToLoad || "-"}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm text-text-tertiary mb-1">
              Galleys to Load
            </Text>
            <Text className="text-lg font-bold text-text-primary">
              {details.galleysToLoad || "-"}
            </Text>
          </View>
        </View>

        {/* Assigned Staff */}
        <View className="mt-4">
          <Text className="text-sm text-text-tertiary mb-2">
            Assigned Staff
          </Text>
          <View className="flex-row gap-2">
            <View className="w-10 h-10 rounded-full bg-bg-accent items-center justify-center border border-bg-button">
              <Text className="text-xs text-text-surface">D</Text>
            </View>
            {loaders.map((loader: any, i: number) => (
              <View
                key={loader?.id || `loader-${i}`}
                className="w-10 h-10 rounded-full bg-bg-tertiary items-center justify-center border border-border-muted"
              >
                <Text className="text-xs text-text-secondary">L</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Right: Next Steps */}
      <View className="w-48">
        <Text className="text-sm text-text-tertiary mb-3">Next Steps</Text>
        <View className="gap-3">
          {steps.map((step) => (
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
