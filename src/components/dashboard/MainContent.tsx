import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import { AppButton } from "../common/AppButton";

const mockTasks = [
  {
    id: "101",
    task: "Load Galley 1",
    flight: "EK203",
    time: "10:30",
    status: "Pending",
  },
  {
    id: "102",
    task: "Check Seals",
    flight: "EK203",
    time: "10:45",
    status: "Pending",
  },
  {
    id: "103",
    task: "Final Count",
    flight: "BA198",
    time: "11:00",
    status: "In Progress",
  },
  {
    id: "104",
    task: "Deliver Docs",
    flight: "BA198",
    time: "11:15",
    status: "Completed",
  },
];

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const ShiftControlCard: React.FC = () => {
  type ShiftState = "OFF" | "ON" | "BREAK";
  const [shiftState, setShiftState] = useState<ShiftState>("OFF");
  const [workingTimeInSeconds, setWorkingTimeInSeconds] = useState(0);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  useEffect(() => {
    if (shiftState === "ON") {
      const intervalId = setInterval(() => {
        setWorkingTimeInSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [shiftState]);

  const handleStartShift = () => {
    setWorkingTimeInSeconds(0);
    setShiftState("ON");
  };

  const handleEndShift = () => {
    setWorkingTimeInSeconds(0);
    setShiftState("OFF");
  };

  const handleBreakToggle = () => {
    setShiftState((prev) => (prev === "ON" ? "BREAK" : "ON"));
  };

  return (
    <View className="bg-bg-surface rounded-2xl p-5 shadow-sm">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-[22px] font-medium text-text-primary">
          Thu 11 13, Thu
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#b399f9ff" }}
          thumbColor={isEnabled ? "#602AF3" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <View className="flex-row mb-5">
        <View className="flex-[3.5] pr-2.5">
          <Text className="text-lg text-text-secondary mb-1">My Shift</Text>
          <Text className="text-lg font-bold text-text-primary">
            10:00 AM - 6:00 PM
          </Text>
        </View>

        <View className="flex-[2.5] pl-2.5">
          <Text className="text-lg text-text-secondary mb-1">
            Today&apos;s Working Time
          </Text>
          <Text className="text-lg font-bold text-text-primary">
            {formatTime(workingTimeInSeconds)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        {shiftState === "OFF" ? (
          <AppButton
            title="Start Shift"
            type="primary"
            onPress={handleStartShift}
            style={{ flex: 1 }}
          />
        ) : (
          <>
            <AppButton
              title={shiftState === "BREAK" ? "On Break" : "Start a Break"}
              type={shiftState === "BREAK" ? "primary" : "secondary"}
              onPress={handleBreakToggle}
              IconComponent={
                shiftState === "BREAK" ? (
                  <View className="w-2.5 h-3 border-l-[4px] border-r-[4px] border-text-surface mr-2" />
                ) : (
                  <View className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-text-primary mr-2" />
                )
              }
              style={{ flex: 3, marginRight: 10 }}
            />

            <AppButton
              title="End Shift"
              type="danger"
              onPress={handleEndShift}
              IconComponent={
                <View className="w-2.5 h-2.5 bg-text-surface rounded-sm mr-2" />
              }
              style={{ flex: 1, marginLeft: 10 }}
            />
          </>
        )}
      </View>
    </View>
  );
};

const TasksCard: React.FC = () => {
  return (
    <View className="flex-1 mt-5 bg-bg-surface rounded-2xl p-5 shadow-sm">
      <Text className="text-xl font-bold mb-4 text-text-primary">My Tasks</Text>

      {/* Header */}
      <View className="flex-row bg-bg-tertiary py-4 px-3.5 rounded-[10px] mb-1.5">
        <Text className="flex-1 text-lg font-bold text-text-secondary">ID</Text>
        <Text className="flex-[3] text-lg font-bold text-text-secondary">
          Task
        </Text>
        <Text className="flex-[2] text-lg font-bold text-text-secondary">
          Flight#
        </Text>
        <Text className="flex-[2] text-lg font-bold text-text-secondary">
          Time
        </Text>
        <Text className="flex-[2] text-lg font-bold text-text-secondary">
          Status
        </Text>
        <Text className="flex-[2] text-lg font-bold text-text-secondary text-right">
          Action
        </Text>
      </View>

      {/* List */}
      <ScrollView className="flex-1">
        {mockTasks.map((task) => (
          <View
            key={task.id}
            className="flex-row py-4 border-b border-bg-tertiary items-center"
          >
            <Text className="flex-1 text-lg text-text-primary">{task.id}</Text>
            <Text className="flex-[3] text-lg text-text-primary">
              {task.task}
            </Text>
            <Text className="flex-[2] text-lg text-text-primary">
              {task.flight}
            </Text>
            <Text className="flex-[2] text-lg text-text-primary">
              {task.time}
            </Text>
            <Text className="flex-[2] text-lg text-text-primary">
              {task.status}
            </Text>
            <TouchableOpacity className="flex-[2] items-end">
              <Text className="text-xl font-bold text-text-secondary px-2">
                ...
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export const MainContent: React.FC = () => {
  return (
    <View className="flex-1">
      <ShiftControlCard />
      <TasksCard />
    </View>
  );
};
