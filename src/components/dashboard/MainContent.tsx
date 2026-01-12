import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  // Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RedirectDarkIcon } from "../../assets/icons";
import { useTimerStore } from "../../store/useTimerStore";
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

const EndShiftModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-5">
        <View className="bg-bg-surface rounded-2xl p-6 w-full max-w-[500px] shadow-lg">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-text-primary">
              End Shift?
            </Text>

            <TouchableOpacity onPress={onClose} className="p-1">
              <View className="w-6 h-6 relative justify-center items-center">
                <View className="w-6 h-0.5 bg-text-secondary absolute rotate-45" />
                <View className="w-6 h-0.5 bg-text-secondary absolute -rotate-45" />
              </View>
            </TouchableOpacity>
          </View>

          <Text className="text-lg text-text-secondary mb-3">
            Are you sure, you want to end your Shift?
          </Text>

          <Text className="text-lg text-text-secondary mb-6">
            This can not be undone!
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-bg-surface border-2 border-border-secondary py-3.5 rounded-xl"
            >
              <Text className="text-center text-lg font-semibold text-text-primary">
                No, Don&apos;t End.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 bg-[#EF4444] py-3.5 rounded-xl"
            >
              <Text className="text-center text-lg font-semibold text-text-surface">
                Yes, End My Shift!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ShiftControlCard: React.FC = () => {
  const {
    shiftState,
    totalWorkingTimeToday,
    currentSessionDuration,
    startShift,
    pauseShift,
    resumeShift,
    endShift,
    syncTime,
  } = useTimerStore();

  // const [isEnabled, setIsEnabled] = React.useState(false);
  const [showEndShiftModal, setShowEndShiftModal] = useState(false);
  // const toggleSwitch = () => setIsEnabled((prev) => !prev);

  // Sync timer every second if shift is ON
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (shiftState === "ON") {
      syncTime(); // Immediate sync on mount/resume
      intervalId = setInterval(() => {
        syncTime();
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [shiftState, syncTime]);

  const displayTime = totalWorkingTimeToday + currentSessionDuration;

  const handleStartShift = () => {
    startShift();
  };

  const handleEndShiftClick = () => {
    setShowEndShiftModal(true);
  };

  const handleEndShiftConfirm = () => {
    endShift();
    setShowEndShiftModal(false);
  };

  const handleBreakToggle = () => {
    if (shiftState === "ON") {
      pauseShift();
    } else {
      resumeShift();
    }
  };

  return (
    <>
      <View className="bg-bg-surface rounded-2xl p-5 shadow-sm">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-[22px] font-medium text-text-primary">
            Thu 11 13, Thu
          </Text>
          {/* <Switch
            trackColor={{ false: "#767577", true: "#b399f9ff" }}
            thumbColor={isEnabled ? "#602AF3" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          /> */}
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
              {formatTime(displayTime)}
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
                onPress={handleEndShiftClick}
                IconComponent={
                  <View className="w-2.5 h-2.5 bg-text-surface rounded-sm mr-2" />
                }
                style={{ flex: 1, marginLeft: 10 }}
              />
            </>
          )}
        </View>
      </View>

      <EndShiftModal
        visible={showEndShiftModal}
        onClose={() => setShowEndShiftModal(false)}
        onConfirm={handleEndShiftConfirm}
      />
    </>
  );
};

const TasksCard: React.FC = () => {
  return (
    <View className="flex-1 mt-5 bg-bg-surface rounded-2xl p-5 shadow-sm">
      <Text className="text-xl font-bold mb-4 text-text-primary">My Tasks</Text>

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
            <TouchableOpacity className="flex-[2] items-end pe-10">
              <RedirectDarkIcon />
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
