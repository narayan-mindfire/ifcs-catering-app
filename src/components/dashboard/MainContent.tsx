/* eslint-disable @typescript-eslint/no-unused-vars */
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuthStore } from "../../store/useAuthStore";
import { useTaskStore } from "../../store/useTaskStore";
import { useTimerStore } from "../../store/useTimerStore";
import { AppButton } from "../common/AppButton";

const formatTimeHoursMinutes = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")} Hrs ${String(minutes).padStart(2, "0")} Mins ${String(seconds).padStart(2, "0")} Secs`;
};

const formatDateDisplay = (date: Date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${dayName}, ${monthName} ${day} ${year}`;
};

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Worked time helper moved to store or handled via props

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
              className="flex-1 bg-bg-surface border-2 border-border-muted py-3.5 rounded-xl"
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

const formatTimeFromISO = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return "--:--";
  }
};

const formatDateForApi = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const ShiftControlCard: React.FC<{
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
}> = ({ selectedDate, onSelectedDateChange }) => {
  const {
    shiftState,
    totalWorkedMs,
    currentSessionDuration,
    shiftType,
    startShift,
    pauseShift,
    resumeShift,
    endShift,
    syncTime,
    fetchStatus,
    fetchHistory,
  } = useTimerStore();

  const [showEndShiftModal, setShowEndShiftModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();
  const isToday = isSameDay(selectedDate, today);

  // Sync timer every second if shift is ON
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (shiftState === "ON") {
      syncTime();
      intervalId = setInterval(() => {
        syncTime();
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [shiftState, syncTime]);

  // Calculate display time based on selected date
  const displayTime = Math.floor(totalWorkedMs / 1000) + currentSessionDuration;

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

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onSelectedDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);

    // Don't allow future dates
    if (!isSameDay(newDate, today) && newDate <= today) {
      onSelectedDateChange(newDate);
    } else if (isSameDay(newDate, today)) {
      onSelectedDateChange(today);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "set" && date) {
        if (date <= today) {
          onSelectedDateChange(date);
        }
      }
    } else {
      if (date && date <= today) {
        onSelectedDateChange(date);
      }
    }
  };

  const confirmDateIOS = () => {
    setShowDatePicker(false);
  };

  const canGoNext = !isSameDay(selectedDate, today);

  return (
    <>
      <View className="bg-bg-surface border-border-muted border-2 rounded-2xl">
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-border-muted">
          <TouchableOpacity
            onPress={handlePreviousDay}
            className="w-12 h-12 bg-bg-tertiary rounded-xl items-center justify-center"
          >
            <Text className="text-2xl text-text-primary font-bold">‹</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={openDatePicker}>
            <Text className="text-[22px] font-semibold text-text-primary">
              {formatDateDisplay(selectedDate)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNextDay}
            disabled={!canGoNext}
            className={`w-12 h-12 rounded-xl items-center justify-center ${
              canGoNext ? "bg-bg-tertiary" : "bg-border-muted"
            }`}
          >
            <Text
              className={`text-2xl font-bold ${
                canGoNext ? "text-text-primary" : "text-text-muted"
              }`}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 py-0 border-b border-border-muted">
          <View className="flex-row">
            <View className="flex-1 pr-3 py-2">
              <Text className="text-sm text-text-tertiary mb-2">Shift</Text>
              <Text className="text-xl font-semibold text-text-primary">
                {shiftType || "Not Started"}
              </Text>
            </View>

            <View className="w-px bg-border-secondary" />

            <View className="flex-1 px-3 py-2">
              <Text className="text-sm text-text-tertiary mb-2">
                Shift Time
              </Text>
              <Text className="text-lg font-semibold text-text-primary">
                {shiftType === "MORNING"
                  ? "10:00 AM - 6:00 PM"
                  : shiftType === "EVENING"
                    ? "6:00 PM - 2:00 AM"
                    : "--:--"}
              </Text>
            </View>

            <View className="w-px bg-border-secondary" />

            <View className="flex-1 pl-3 py-2">
              <Text className="text-sm text-text-tertiary mb-2">
                Worked Time
              </Text>
              <Text className="text-lg font-bold text-text-primary">
                {formatTimeHoursMinutes(displayTime)}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-5 py-4">
          <View className="flex-row justify-between">
            {shiftState === "OFF" || !isToday ? (
              <AppButton
                title="Start Shift"
                type="primary"
                onPress={handleStartShift}
                style={{ flex: 1 }}
                disabled={!isToday}
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
                  disabled={!isToday}
                />

                <AppButton
                  title="End Shift"
                  type="danger"
                  onPress={handleEndShiftClick}
                  IconComponent={
                    <View className="w-2.5 h-2.5 bg-text-surface rounded-sm mr-2" />
                  }
                  style={{ flex: 1, marginLeft: 10 }}
                  disabled={!isToday}
                />
              </>
            )}
          </View>
        </View>
      </View>

      {showDatePicker && (
        <View className="bg-black/50 absolute top-0 left-0 right-0 bottom-0 z-[1000] justify-center items-center">
          <View className="bg-bg-surface rounded-xl p-4 shadow-lg min-w-[300px]">
            <Text className="text-lg font-bold mb-4 text-center text-text-primary">
              Select Date
            </Text>

            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onDateChange}
              maximumDate={today}
              accentColor="#602AF3"
              textColor="#602AF3"
              style={{ height: Platform.OS === "ios" ? 300 : "auto" }}
            />

            {Platform.OS === "ios" && (
              <View className="flex-row justify-between mt-4 gap-3">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg items-center bg-bg-tertiary"
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text className="text-text-primary text-base font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg items-center bg-bg-button"
                  onPress={confirmDateIOS}
                >
                  <Text className="text-text-surface text-base font-semibold">
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      <EndShiftModal
        visible={showEndShiftModal}
        onClose={() => setShowEndShiftModal(false)}
        onConfirm={handleEndShiftConfirm}
      />
    </>
  );
};

const TasksCard: React.FC = () => {
  const { tasks, isLoading, error } = useTaskStore();

  return (
    <View className="flex-1 mt-5 bg-bg-surface rounded-2xl p-5 shadow-sm">
      <Text className="text-xl font-bold mb-4 text-text-primary">My Tasks</Text>

      <View className="flex-row bg-bg-tertiary py-4 px-3.5 rounded-[10px] mb-1.5">
        <Text className="flex-[3] text-lg font-bold text-text-secondary">
          Title
        </Text>
        <Text className="flex-[2] text-lg font-bold text-text-secondary">
          Type
        </Text>
        <Text className="flex-[2] text-lg font-bold text-text-secondary">
          Priority
        </Text>
        <Text className="flex-[2] text-lg font-bold text-text-secondary">
          Status
        </Text>
        <Text className="flex-[2] text-lg font-bold text-text-secondary text-right">
          Time
        </Text>
      </View>

      <ScrollView className="flex-1">
        {isLoading ? (
          <View className="py-10 items-center">
            <Text className="text-text-secondary">Loading tasks...</Text>
          </View>
        ) : error ? (
          <View className="py-10 items-center">
            <Text className="text-[#EF4444]">{error}</Text>
          </View>
        ) : tasks.length === 0 ? (
          <View className="py-10 items-center">
            <Text className="text-text-secondary">
              No tasks assigned for this day.
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <View
              key={task.id}
              className="flex-row py-4 border-b border-bg-tertiary items-center px-3.5"
            >
              <Text className="flex-[3] text-lg text-text-primary">
                {task.title}
              </Text>
              <Text className="flex-[2] text-lg text-text-primary">
                {task.sourceType}
              </Text>
              <Text className="flex-[2] text-lg text-text-primary">
                {task.priority}
              </Text>
              <Text className="flex-[2] text-lg text-text-primary">
                {task.status}
              </Text>
              <Text className="flex-[2] text-lg text-text-primary text-right">
                {formatTimeFromISO(task.startTime)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export const MainContent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useAuthStore();
  const { fetchTasks } = useTaskStore();
  const { fetchStatus, fetchHistory } = useTimerStore();

  useEffect(() => {
    if (user?.id) {
      const dateStr = formatDateForApi(selectedDate);
      fetchTasks(user.id, dateStr);

      if (isSameDay(selectedDate, new Date())) {
        fetchStatus();
      } else {
        fetchHistory(dateStr);
      }
    }
  }, [selectedDate, user?.id, fetchTasks, fetchStatus, fetchHistory]);

  return (
    <View className="flex-1">
      <ShiftControlCard
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
      />
      <TasksCard />
    </View>
  );
};
