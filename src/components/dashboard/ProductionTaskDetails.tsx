import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { CheckIconSuccess, TimerIcon } from "../../assets/icons";
import { useAuthStore } from "../../store/useAuthStore";
import { useTaskStore } from "../../store/useTaskStore";
import { UnifiedTask } from "../../types/task";
import { log } from "../../utils/logger";
import { AppButton } from "../common/AppButton";

interface ProductionTaskDetailsProps {
  task: UnifiedTask;
}

const formatSeconds = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
};

export const ProductionTaskDetails: React.FC<ProductionTaskDetailsProps> = ({
  task,
}) => {
  const { user } = useAuthStore();
  const taskTimerState = useTaskStore((state) => state.taskTimerState);
  const setTaskTimer = useTaskStore((state) => state.setTaskTimer);
  const syncTaskCompletion = useTaskStore((state) => state.syncTaskCompletion);
  const isLoading = useTaskStore((state) => state.isLoading);

  const taskId = task?.id;
  const { timeLeft = 0, isTimerRunning = false } = taskId
    ? taskTimerState[taskId] || {}
    : {};

  // local state to know if it was stopped to enable completion button
  const [hasStopped, setHasStopped] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && taskId) {
      interval = setInterval(() => {
        setTaskTimer(taskId, timeLeft + 1, true);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, taskId, setTaskTimer]);

  const handleStart = () => {
    if (taskId) setTaskTimer(taskId, timeLeft, true);
    setHasStopped(false);
  };

  const handlePause = () => {
    if (taskId) setTaskTimer(taskId, timeLeft, false);
  };

  const handleStop = () => {
    if (taskId) setTaskTimer(taskId, timeLeft, false);
    setHasStopped(true);
  };

  const handleComplete = async () => {
    if (!user?.id || !taskId) return;
    try {
      const actualTime = formatSeconds(timeLeft);
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
    <View className="bg-bg-surface rounded-xl overflow-hidden border border-border-muted min-h-[300px]">
      <View className="p-6">
        <View className="mb-2">
          <Text className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-1">
            Description
          </Text>
          <Text className="text-text-primary text-lg font-semibold">
            {task.description}
          </Text>
          {batchNo && (
            <View className="flex-row mt-3 items-center">
              <View className="bg-bg-tertiary px-3 py-1 rounded-full">
                <Text className="text-text-secondary text-sm">
                  Batch: <Text className="font-bold">{batchNo}</Text>
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Timer Section */}
        <View className="items-center py-5 bg-bg-tertiary rounded-3xl mb-4 border border-border-muted shadow-inner">
          <View className="flex-row items-center gap-3 mb-2">
            <TimerIcon width={24} height={24} color="#602AF3" />
            <Text className="text-text-secondary font-medium tracking-widest uppercase">
              Timer
            </Text>
          </View>
          <Text className="text-4xl font-black text-text-primary mb-2 font-mono">
            {formatSeconds(timeLeft)}
          </Text>
          <Text className="text-text-muted text-sm font-medium uppercase tracking-[0.2em]">
            HH : MM : SS
          </Text>
        </View>

        {/* Controls Section */}
        {!isCompleted && (
          <View className="flex-row justify-center gap-6">
            {!isTimerRunning ? (
              <TouchableOpacity
                onPress={handleStart}
                className="bg-[#602AF3] w-20 h-20 rounded-full items-center justify-center shadow-lg shadow-[#602AF3]/30"
              >
                <View className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                <Text className="text-white font-bold text-xs mt-1 uppercase">
                  Start
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handlePause}
                className="bg-orange-500 w-20 h-20 rounded-full items-center justify-center shadow-lg shadow-orange-500/30"
              >
                <View className="flex-row gap-1">
                  <View className="w-2.5 h-8 bg-white rounded-sm" />
                  <View className="w-2.5 h-8 bg-white rounded-sm" />
                </View>
                <Text className="text-white font-bold text-xs mt-1 uppercase">
                  Pause
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleStop}
              className="bg-red-500 w-20 h-20 rounded-full items-center justify-center shadow-lg shadow-red-500/30"
              disabled={timeLeft === 0}
              style={{ opacity: timeLeft === 0 ? 0.5 : 1 }}
            >
              <View className="w-6 h-6 bg-white rounded-sm" />
              <Text className="text-white font-bold text-xs mt-1 uppercase">
                Stop
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isCompleted && (
          <View className="items-center py-6 bg-green-50 rounded-2xl border border-green-100 mb-2">
            <View className="bg-green-500 p-3 rounded-full mb-3">
              <CheckIconSuccess width={32} height={32} />
            </View>
            <Text className="text-2xl font-bold text-green-700">
              Task Completed
            </Text>
            <Text className="text-green-600 font-medium mt-1">
              Actual Time:{" "}
              {task.actualCompletionTime || formatSeconds(timeLeft)}
            </Text>
          </View>
        )}
      </View>

      {!isCompleted && (
        <View className="mt-auto p-6 border-t border-border-muted bg-bg-surface">
          <AppButton
            title="Complete Task"
            onPress={handleComplete}
            disabled={!hasStopped || isLoading}
            loading={isLoading}
            type={hasStopped ? "primary" : "secondary"}
          />
          {!hasStopped && timeLeft > 0 && (
            <Text className="text-text-muted text-center text-xs mt-3 uppercase tracking-wider font-medium">
              Hit Stop to enable completion
            </Text>
          )}
        </View>
      )}
    </View>
  );
};
