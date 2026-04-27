import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { CheckIconActive, TimerIcon } from "../../assets/icons";
import { useAuthStore } from "../../store/useAuthStore";
import { useTaskStore } from "../../store/useTaskStore";
import { UnifiedTask } from "../../types/task";
import { formatDurationSeconds } from "../../utils/dateFormatter";
import { log } from "../../utils/logger";
import { AppButton } from "../common/AppButton";

interface ProductionTaskDetailsProps {
  task: UnifiedTask;
}

export const ProductionTaskDetails: React.FC<ProductionTaskDetailsProps> = ({
  task,
}) => {
  const { user } = useAuthStore();
  const taskTimerState = useTaskStore((state) => state.taskTimerState);
  const setTaskTimer = useTaskStore((state) => state.setTaskTimer);
  const syncTaskCompletion = useTaskStore((state) => state.syncTaskCompletion);
  const isLoading = useTaskStore((state) => state.isLoading);
  const taskId = task.id;
  const {
    accumulatedTime = 0,
    startTime = null,
    isTimerRunning = false,
  } = taskId ? taskTimerState[taskId] || {} : {};

  const [currentTime, setCurrentTime] = useState(0);

  const [hasStopped, setHasStopped] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      if (isTimerRunning && startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setCurrentTime(accumulatedTime + elapsed);
      } else {
        setCurrentTime(accumulatedTime);
      }
    };

    calculateTime();

    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(calculateTime, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, startTime, accumulatedTime]);

  const handleStart = () => {
    if (taskId) {
      setTaskTimer(taskId, currentTime, true);
    }
    setHasStopped(false);
  };

  const handlePause = () => {
    if (taskId) {
      setTaskTimer(taskId, currentTime, false);
    }
  };

  const handleStop = () => {
    if (taskId) {
      setTaskTimer(taskId, currentTime, false);
    }
    setHasStopped(true);
  };

  const handleComplete = async () => {
    if (!user?.id || !taskId) return;
    try {
      const actualTime = formatDurationSeconds(currentTime);
      await syncTaskCompletion(taskId, user.id, undefined, actualTime);
      Alert.alert("Success", "Task completed successfully");
    } catch (err) {
      log.error("Failed to complete task:", err);
      Alert.alert("Error", "Failed to complete task");
    }
  };

  if (!task) return null;

  const isCompleted = task.status === "COMPLETE";
  const batchNo = task.metadata?.batchNo as string | undefined;

  return (
    <View className="flex-1 bg-bg-surface rounded-xl overflow-hidden border border-border-muted">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col">
          <View className="mb-4">
            <View className="mb-3">
              <Text className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-1">
                Description
              </Text>
              <Text className="text-text-primary text-xl font-bold leading-tight">
                {task.description}
              </Text>
              {batchNo && (
                <View className="flex-row mt-3 items-center">
                  <View className="bg-bg-tertiary px-3 py-1 rounded-full border border-border-muted">
                    <Text className="text-text-secondary text-xs font-medium">
                      Batch:{" "}
                      <Text className="text-text-primary font-bold">
                        {batchNo}
                      </Text>
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View className="w-full">
            {/* Timer Section */}
            <View className="items-center py-6 bg-bg-tertiary rounded-2xl mb-6 border border-border-muted shadow-inner">
              <View className="flex-row items-center gap-2 mb-3">
                <View className="bg-bg-accent/10 p-1.5 rounded-full">
                  <TimerIcon width={18} height={18} color="#602AF3" />
                </View>
                <Text className="text-text-secondary font-bold tracking-widest uppercase text-xs">
                  Timer
                </Text>
              </View>
              <Text className="text-4xl font-black text-text-primary mb-2 font-mono tracking-tighter">
                {formatDurationSeconds(currentTime)}
              </Text>
              <Text className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                HH : MM : SS
              </Text>
            </View>

            {/* Controls Section */}
            {!isCompleted && (
              <View className="flex-row justify-center gap-6 mb-4">
                {!isTimerRunning ? (
                  <TouchableOpacity
                    onPress={handleStart}
                    className="bg-[#602AF3] w-20 h-20 rounded-full items-center justify-center shadow-xl shadow-[#602AF3]/30 active:scale-95 transition-transform"
                  >
                    <View className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                    <Text className="text-white font-black text-[9px] mt-1.5 uppercase tracking-widest">
                      Start
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handlePause}
                    className="bg-orange-500 w-20 h-20 rounded-full items-center justify-center shadow-xl shadow-orange-500/30 active:scale-95 transition-transform"
                  >
                    <View className="flex-row gap-1">
                      <View className="w-2.5 h-8 bg-white rounded-full" />
                      <View className="w-2.5 h-8 bg-white rounded-full" />
                    </View>
                    <Text className="text-white font-black text-[9px] mt-1.5 uppercase tracking-widest">
                      Pause
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleStop}
                  className="bg-red-500 w-20 h-20 rounded-full items-center justify-center shadow-xl active:scale-95 transition-transform"
                  disabled={currentTime === 0}
                >
                  <View className="w-6 h-6 bg-white rounded-md" />
                  <Text className="text-white font-black text-[9px] mt-1.5 uppercase tracking-widest">
                    Stop
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {isCompleted && (
              <View className="items-center py-6 bg-green-50 rounded-2xl border border-green-200 mb-4 shadow-sm">
                <View className="bg-green-500 p-3 rounded-full mb-3 shadow-md shadow-green-500/20">
                  <CheckIconActive />
                </View>
                <Text className="text-2xl font-black text-green-800 tracking-tight">
                  Task Completed
                </Text>
                {/* <Text className="text-green-600 font-bold mt-1 text-base">
                  Actual Time:{" "}
                  <Text className="text-green-800 font-black font-mono">
                    {task.actualCompletionTime ||
                      formatDurationSeconds(currentTime)}
                  </Text>
                </Text> */}
              </View>
            )}
          </View>
        </View>

        <View className="mt-auto pt-6 border-t border-border-muted">
          {!isCompleted && (
            <View>
              <AppButton
                title="Complete Task"
                onPress={handleComplete}
                disabled={!hasStopped || isLoading}
                loading={isLoading}
                type={hasStopped ? "primary" : "secondary"}
                style={{ height: 50, borderRadius: 12 }}
                textStyle={{ fontSize: 16, fontWeight: "800" }}
              />
              {!hasStopped && currentTime > 0 && (
                <Text className="text-text-muted text-center text-[10px] mt-3 uppercase tracking-[0.1em] font-bold opacity-70">
                  Hit Stop to enable completion
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
