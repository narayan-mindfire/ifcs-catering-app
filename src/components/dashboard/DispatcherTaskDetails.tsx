import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useMemo } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import {
  BoxIcon,
  CheckIconSuccess,
  DeliveryIconTrue,
  DocsIcon,
  StringIconTrue,
} from "../../assets/icons";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { deliveryService } from "../../services/deliveryService";
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
  const deliveries = useDeliveryStore((state) => state.deliveries);
  const fetchDeliveries = useDeliveryStore((state) => state.fetchDeliveries);
  const taskStepsStatus = useTaskStore((state) => state.taskStepsStatus);
  const setStepStatus = useTaskStore((state) => state.setStepStatus);
  const taskTimerState = useTaskStore((state) => state.taskTimerState);
  const setTaskTimer = useTaskStore((state) => state.setTaskTimer);
  const syncTaskCompletion = useTaskStore((state) => state.syncTaskCompletion);
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
  // log.info("Is Declaration Signed?", { isDeclarationSigned, deliveries, user });

  // Automatically sync declaration step status
  useEffect(() => {
    if (isDeclarationSigned && !checkedSteps["declaration"]) {
      setStepStatus(task.id, "declaration", true);
    }
  }, [isDeclarationSigned, checkedSteps, setStepStatus, task.id]);

  // Fetch deliveries for the flight associated with the task only when flight changes
  const lastFetchedFlightId = React.useRef<string | null>(null);
  useEffect(() => {
    if (details.flightId && lastFetchedFlightId.current !== details.flightId) {
      lastFetchedFlightId.current = details.flightId;
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
    let interval: ReturnType<typeof setInterval>;
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

  const handleSignDeclaration = async () => {
    log.info("Declaration step triggered", {
      details,
      flightId: details.flightId,
      flightNo: details.flightNo,
      dispatchAssignmentId: task.metadata?.dispatchAssignmentId,
    });

    if (!details.flightId) {
      Alert.alert("Error", "Flight information missing from task.");
      return;
    }

    try {
      log.info(
        `GETTING DELIVERIES FOR FLIGHT: ${details.flightId} FILTERED BY: ${task.metadata?.dispatchAssignmentId}`,
      );
      const filteredDeliveries = await deliveryService.getDeliveries(
        details.flightId,
        task.metadata?.dispatchAssignmentId,
      );

      log.info(`API RETURNED ${filteredDeliveries?.length || 0} DELIVERIES`);
      if (filteredDeliveries && filteredDeliveries.length > 0) {
        // Detailed check for assignment matching
        log.info(
          "DELIVERY DATA RECEIVED:",
          filteredDeliveries.map((d) => ({
            id: d.id,
            name: d.deliveryName,
            assignmentId: d.dispatchAssignmentId,
          })),
        );

        // Find the specific delivery for this task, or fallback to the first one returned
        const targetDelivery =
          filteredDeliveries.find((d) => d.dispatchAssignmentId === task.id) ||
          filteredDeliveries[0];

        log.info("CHOSEN TARGET DELIVERY:", {
          id: targetDelivery.id,
          matchesAssignment: targetDelivery.dispatchAssignmentId === task.id,
        });

        // Path A: Delivery Found
        log.info("Navigating to Declaration with deliveries", {
          targetDeliveryId: targetDelivery.id,
        });
        navigation.navigate("FlightDetails", {
          flightId: details.flightId,
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
            selectedDeliveryId: targetDelivery.id,
          },
        });
      } else {
        // Path B: No Delivery
        log.info(
          "NO DELIVERIES FOUND FOR THIS ASSIGNMENT. REDIRECTING TO PREPARATIONS.",
        );
        Alert.alert(
          "Action Required",
          "User has to do load scan for at least one label before doing signature.",
        );
        navigation.navigate("FlightDetails", {
          flightId: details.flightId,
          flightNumber: details.flightNo || "Unknown",
          route: details.route || "Unknown",
          date: new Date().toISOString(),
          // @ts-ignore
          screen: "Preparations",
          params: {
            fromDashboard: true,
            taskId: task.id,
          },
        });
      }
    } catch (err) {
      log.error("SIGN DECLARATION FLOW FAILED:", err);
      Alert.alert("Error", "Failed to verify deliveries. Please try again.");
    }
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
    if (user?.id) {
      syncTaskCompletion(
        task.id,
        user.id,
        expectedCompletionTime,
        actualCompletionTime,
      );
    }
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
                  Expected Duration
                </Text>
                <Text className="text-lg font-bold text-text-primary">
                  {task.expectedCompletionTime || "-"}
                </Text>
              </View>
              <View className="w-1/3">
                <Text className="text-sm text-text-tertiary mb-1">
                  Actual Duration
                </Text>
                <Text className="text-lg font-bold text-text-primary">
                  {task.actualCompletionTime || "-"}
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
          {/* {allStepsChecked && task.status !== "COMPLETE" && (
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
