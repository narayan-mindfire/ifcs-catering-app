import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { BoxIcon, DeliveryIconTrue } from "../../assets/icons";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { UnifiedTask } from "../../types/task";
import { log } from "../../utils/logger";

interface TaskStep {
  id: string;
  label: string;
}

interface DispatcherTaskDetailsProps {
  task: UnifiedTask;
}

type NavigationProp = StackNavigationProp<RootStackParamList, "Dashboard">;

export const DispatcherTaskDetails: React.FC<DispatcherTaskDetailsProps> = ({
  task,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const details = task.taskDetails || {};
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const parseTimeToSeconds = (timeStr: string) => {
    if (!timeStr || !timeStr.includes(":")) return 0;
    const parts = timeStr.split(":").map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const formatSeconds = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
  };

  const toggleStep = (id: string) => {
    const isChecking = !checkedSteps[id];
    setCheckedSteps((prev) => ({ ...prev, [id]: isChecking }));

    if (id === "job-type") {
      if (isChecking) {
        const initialSeconds = parseTimeToSeconds(
          details.timeToLoad || "00:10:00",
        );
        setTimeLeft(initialSeconds);
        setIsTimerRunning(false);
      } else {
        setIsTimerRunning(false);
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const steps: TaskStep[] = [
    {
      id: "a-check",
      label: "A-Check",
    },
    {
      id: "job-type",
      label: details.jobType || "Job Type",
    },
    { id: "declaration", label: "Declaration" },
  ];

  const handleStepPress = (step: TaskStep) => {
    toggleStep(step.id);
  };

  const handleSignDeclaration = () => {
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
  };

  const allStepsChecked = steps.every((step) => checkedSteps[step.id]);

  const handleMarkComplete = () => {
    const initialSeconds = parseTimeToSeconds(details.timeToLoad || "00:10:00");
    const timeTakenSeconds = Math.max(0, initialSeconds - timeLeft);
    const payload = {
      taskId: task.id,
      timeTaken: formatSeconds(timeTakenSeconds),
      timeTakenSeconds,
      jobType: details.jobType,
      flightNo: details.flightNo,
    };
    log.info("Mark Task as Complete Payload", payload);
  };

  const assignedStaff = details.assignedStaff || {};
  const loaders = assignedStaff.loader || [];
  const driver = assignedStaff.driver;

  return (
    <View className="flex-row gap-4 border border-border-muted rounded-xl p-4">
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

        <View className="mt-4">
          <Text className="text-sm text-text-tertiary mb-2">
            Assigned Staff
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row gap-3">
              {/* Driver Capsule */}
              {driver && (
                <View className="flex-row items-center bg-white border border-border-muted rounded-full p-1 pr-2">
                  <View className="w-8 h-8 rounded-full bg-bg-tertiary items-center justify-center mr-2">
                    <DeliveryIconTrue width={16} height={16} fill="#666" />
                  </View>
                  <View className="w-8 h-8 rounded-full bg-bg-accent items-center justify-center border border-bg-button">
                    <Text className="text-[10px] text-text-surface font-bold">
                      {getInitials(driver.name)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Loaders Capsule */}
              {loaders.length > 0 && (
                <View className="flex-row items-center bg-white border border-border-muted rounded-full p-1 pr-2">
                  <View className="w-8 h-8 rounded-full bg-bg-tertiary items-center justify-center mr-2">
                    <BoxIcon width={16} height={16} />
                  </View>
                  <View className="flex-row gap-1">
                    {loaders.map((loader: any, i: number) => (
                      <View
                        key={loader?.id || `loader-${i}`}
                        className="w-8 h-8 rounded-full bg-bg-tertiary items-center justify-center border border-border-muted"
                      >
                        <Text className="text-[10px] text-text-secondary font-bold">
                          {getInitials(loader.name)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Mark Task as Complete Button */}
            <TouchableOpacity
              onPress={handleMarkComplete}
              disabled={!allStepsChecked}
              className={`py-2.5 px-6 rounded-xl border ${
                allStepsChecked
                  ? "bg-[#602AF3] border-[#602AF3]"
                  : "bg-bg-surface border-border-muted opacity-50"
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  allStepsChecked ? "text-white" : "text-text-muted"
                }`}
              >
                Mark Task as Complete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="w-64 border-l-[1px] pl-8 border-border-secondary">
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

              {step.id === "a-check" && checkedSteps["a-check"] && (
                <TouchableOpacity className="border border-[#602AF3] rounded-xl py-2 px-3 mt-1">
                  <Text className="text-[#602AF3] text-sm font-semibold text-center">
                    Fill A-Check
                  </Text>
                </TouchableOpacity>
              )}

              {step.id === "job-type" && checkedSteps["job-type"] && (
                <View className="mt-1 ml-7">
                  <Text className="text-[#602AF3] font-bold text-lg mb-2">
                    {formatSeconds(timeLeft)}
                  </Text>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => setIsTimerRunning(!isTimerRunning)}
                      className="bg-[#602AF3] rounded-lg py-1.5 px-3"
                    >
                      <Text className="text-white text-xs font-semibold">
                        {isTimerRunning ? "Pause Timer" : "Start Timer"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setIsTimerRunning(false)}
                      className="border border-[#602AF3] rounded-lg py-1.5 px-3"
                    >
                      <Text className="text-[#602AF3] text-xs font-semibold">
                        Stop
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {step.id === "declaration" && checkedSteps["declaration"] && (
                <TouchableOpacity
                  onPress={handleSignDeclaration}
                  className="bg-[#602AF3] rounded-xl py-2 px-3 mt-1"
                >
                  <Text className="text-white text-sm font-semibold text-center">
                    Sign Declaration
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
