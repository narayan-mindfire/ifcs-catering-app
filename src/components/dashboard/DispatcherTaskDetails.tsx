import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import {
  BoxIcon,
  CheckIconSuccess,
  DeliveryIconTrue,
  DocsIcon,
  StringIconTrue,
} from "../../assets/icons";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuthStore } from "../../store/useAuthStore";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import { useTaskStore } from "../../store/useTaskStore";
import { UnifiedTask } from "../../types/task";
import { log } from "../../utils/logger";
import { AppButton } from "../common/AppButton";

interface TaskStep {
  id: string;
  label: string;
}

interface DispatcherTaskDetailsProps {
  task: UnifiedTask;
}

type NavigationProp = StackNavigationProp<RootStackParamList, "Dashboard">;
const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatSeconds = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
};

export const DispatcherTaskDetails: React.FC<DispatcherTaskDetailsProps> = ({
  task,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { deliveries, fetchDeliveries } = useDeliveryStore();
  const {
    taskStepsStatus,
    setStepStatus,
    taskTimerState,
    setTaskTimer,
    syncTaskCompletion,
  } = useTaskStore();
  const checkedSteps = useMemo(
    () => taskStepsStatus[task.id] || {},
    [taskStepsStatus, task.id],
  );
  const { timeLeft = 0, isTimerRunning = false } =
    taskTimerState[task.id] || {};

  const details = task.taskDetails || {};

  // Logic to check if declaration is signed on backend
  const isDeclarationSigned = useMemo(() => {
    if (!deliveries.length) return false;
    return deliveries.some(
      (d) =>
        d.driverSignature &&
        (d.driverId === user?.id ||
          d.driverStaffId === user?.badgeNumber ||
          d.driverStaffId === user?.raicNumber),
    );
  }, [deliveries, user]);
  log.info("Is Declaration Signed?", { isDeclarationSigned, deliveries, user });

  // Automatically sync declaration step status
  useEffect(() => {
    if (isDeclarationSigned && !checkedSteps["declaration"]) {
      setStepStatus(task.id, "declaration", true);
    }
  }, [isDeclarationSigned, checkedSteps, setStepStatus, task.id]);

  // Fetch deliveries for the flight associated with the task
  useEffect(() => {
    if (details.flightId) {
      fetchDeliveries(details.flightId);
    }
  }, [details.flightId, fetchDeliveries]);

  const toggleStep = (id: string) => {
    // Prevent any changes if the task is already completed
    if (task.status === "COMPLETE") return;

    // Prevent manual toggle for declaration if it's already signed on the backend
    if (id === "declaration" && isDeclarationSigned) return;

    const isChecking = !checkedSteps[id];
    setStepStatus(task.id, id, isChecking);

    if (id === "job-type") {
      if (isChecking) {
        // Start counting up from 0
        setTaskTimer(task.id, 0, false);
      } else {
        setTaskTimer(task.id, 0, false);
      }
    }
  };

  // Initialize timer to 0 if step is already checked but timer state is missing
  useEffect(() => {
    if (checkedSteps["job-type"] && !taskTimerState[task.id]) {
      setTaskTimer(task.id, 0, false);
    }
  }, [checkedSteps, task.id, taskTimerState, setTaskTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTaskTimer(task.id, timeLeft + 1, true);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, task.id, setTaskTimer]);

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
        fromDashboard: true,
        taskId: task.id,
        taskDate: task.startTime?.split("T")[0],
      },
    });
  };

  const allStepsChecked = steps.every((step) => checkedSteps[step.id]);

  const handleMarkComplete = () => {
    const expectedCompletionTime = details.timeToLoad || "00:00:00";
    const actualCompletionTime = formatSeconds(timeLeft);

    const payload = {
      taskId: task.id,
      expectedCompletionTime,
      actualCompletionTime,
      jobType: details.jobType,
      flightNo: details.flightNo,
    };
    log.info("Mark Task as Complete Payload", payload);

    // Sync with backend using duration strings (HH:mm:ss)
    syncTaskCompletion(task.id, expectedCompletionTime, actualCompletionTime);
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
          {task.status === "COMPLETE" && (
            <>
              <View className="w-1/3">
                <Text className="text-sm text-text-tertiary mb-1">
                  Expected Completion
                </Text>
                <Text className="text-lg font-bold text-text-primary">
                  {task.expectedCompletionTime
                    ? new Date(task.expectedCompletionTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        },
                      )
                    : "-"}
                </Text>
              </View>
              <View className="w-1/3">
                <Text className="text-sm text-text-tertiary mb-1">
                  Actual Completion
                </Text>
                <Text className="text-lg font-bold text-text-primary">
                  {task.actualCompletionTime
                    ? new Date(task.actualCompletionTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        },
                      )
                    : "-"}
                </Text>
              </View>
            </>
          )}
        </View>

        <View className="mt-4">
          <Text className="text-sm text-text-tertiary mb-2">
            Assigned Staff
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row gap-3">
              {driver && (
                <View className="flex-row items-center bg-white border border-border-muted rounded-full p-1 pr-2">
                  <View className="w-8 h-8 rounded-full bg-bg-tertiary items-center justify-center mr-2">
                    <DeliveryIconTrue width={16} height={16} fill="#666" />
                  </View>
                  <View className="w-8 h-8 rounded-full bg-bg-accent items-center justify-center border border-bg-button">
                    <Text className="text-[10px] text-text-primary font-bold">
                      {getInitials(driver.name)}
                    </Text>
                  </View>
                </View>
              )}

              {loaders.length > 0 && (
                <View className="flex-row items-center bg-white border border-border-muted rounded-full p-1 pr-2">
                  <View className="w-8 h-8 rounded-full bg-bg-tertiary items-center justify-center mr-2">
                    <BoxIcon width={16} height={16} />
                  </View>
                  <View className="flex-row gap-1">
                    {loaders.map((loader: any, i: number) => (
                      <View
                        key={loader?.id || `loader-${i}`}
                        className="w-8 h-8 rounded-full bg-bg-accent border-bg-button items-center justify-center border"
                      >
                        <Text className="text-[10px] text-text-primary font-bold">
                          {getInitials(loader.name)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            <AppButton
              title={
                task.status === "COMPLETE"
                  ? "Task Completed"
                  : "Mark Task as Complete"
              }
              onPress={handleMarkComplete}
              disabled={!allStepsChecked || task.status === "COMPLETE"}
              IconComponent={
                <CheckIconSuccess
                  width={16}
                  height={16}
                  fill={
                    allStepsChecked && task.status !== "COMPLETE"
                      ? "#fff"
                      : "#999"
                  }
                />
              }
              style={{
                paddingVertical: 4,
                paddingHorizontal: 12,
                height: 42,
                backgroundColor:
                  task.status === "COMPLETE" ? "#E5E5E5" : undefined,
              }}
              textStyle={{
                fontSize: 12,
                color: task.status === "COMPLETE" ? "#666" : undefined,
              }}
            />
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
                  disabled={
                    (step.id === "declaration" && isDeclarationSigned) ||
                    task.status === "COMPLETE"
                  }
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    checkedSteps[step.id]
                      ? "bg-bg-button border-bg-button"
                      : "border-border-muted bg-transparent"
                  } ${
                    (step.id === "declaration" && isDeclarationSigned) ||
                    task.status === "COMPLETE"
                      ? "opacity-60"
                      : "opacity-100"
                  }`}
                >
                  {checkedSteps[step.id] && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleStepPress(step)}
                  disabled={
                    (step.id === "declaration" && isDeclarationSigned) ||
                    task.status === "COMPLETE"
                  }
                >
                  <Text
                    className={`text-base text-text-primary ${
                      (step.id === "declaration" && isDeclarationSigned) ||
                      task.status === "COMPLETE"
                        ? "text-text-tertiary"
                        : "text-text-primary"
                    }`}
                  >
                    {step.label}
                  </Text>
                </TouchableOpacity>
              </View>

              {step.id === "a-check" && checkedSteps["a-check"] && (
                <AppButton
                  title="Fill A-Check"
                  onPress={() => log.info("Fill A-Check pressed")}
                  disabled={task.status === "COMPLETE"}
                  IconComponent={
                    <DocsIcon width={14} height={14} fill="#fff" />
                  }
                  style={{ marginTop: 4, paddingVertical: 2, height: 34 }}
                  textStyle={{ fontSize: 10 }}
                />
              )}

              {step.id === "job-type" && checkedSteps["job-type"] && (
                <View className="mt-1 ml-7">
                  <Text className="text-bg-button font-bold text-lg mb-2">
                    {formatSeconds(timeLeft)}
                  </Text>
                  <View className="flex-row gap-2">
                    <AppButton
                      title={isTimerRunning ? "Pause" : "Start"}
                      onPress={() =>
                        setTaskTimer(task.id, timeLeft, !isTimerRunning)
                      }
                      disabled={task.status === "COMPLETE"}
                      style={{ marginTop: 4, paddingVertical: 2, height: 34 }}
                      textStyle={{ fontSize: 10 }}
                    />
                    <AppButton
                      title="Stop"
                      onPress={() => setTaskTimer(task.id, timeLeft, false)}
                      disabled={task.status === "COMPLETE"}
                      style={{
                        marginTop: 4,
                        paddingVertical: 2,
                        height: 34,
                        borderColor: "#602AF3",
                        backgroundColor: "#fff",
                      }}
                      textStyle={{ fontSize: 10, color: "#602AF3" }}
                    />
                  </View>
                </View>
              )}

              {step.id === "declaration" && checkedSteps["declaration"] && (
                <AppButton
                  title="Sign Declaration"
                  onPress={handleSignDeclaration}
                  disabled={task.status === "COMPLETE"}
                  IconComponent={
                    <StringIconTrue width={14} height={14} fill="#fff" />
                  }
                  style={{ marginTop: 4, paddingVertical: 2, height: 34 }}
                  textStyle={{ fontSize: 10 }}
                />
              )}
            </View>
          ))}
          {/* {allStepsChecked && task.status !== "COMPLETED" && (
            <View className="mt-4 border-t border-border-muted pt-4">
              <AppButton
                title={isLoading ? "Syncing..." : "Mark as Complete"}
                onPress={handleMarkComplete}
                loading={isLoading}
                disabled={isLoading}
                style={{ width: "100%", marginTop: 8 }}
              />
            </View>
          )} */}
        </View>
      </View>
    </View>
  );
};
