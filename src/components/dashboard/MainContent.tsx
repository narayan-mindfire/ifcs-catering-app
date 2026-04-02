/* eslint-disable @typescript-eslint/no-unused-vars */
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RedirectDarkIcon } from "../../assets/icons";
import { useAuthStore } from "../../store/useAuthStore";
import { useTaskStore } from "../../store/useTaskStore";
import { useTimerStore } from "../../store/useTimerStore";
import { UnifiedTask } from "../../types/task";
import { formatTo24Hour, getShiftTimeRange } from "../../utils/dateFormatter";
import { AppButton } from "../common/AppButton";
import { DispatcherTaskDetails } from "./DispatcherTaskDetails";

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
  return formatTo24Hour(isoString);
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
    totalBreakMs,
    currentBreakSessionDuration,
  } = useTimerStore();

  const [showEndShiftModal, setShowEndShiftModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();
  const isToday = isSameDay(selectedDate, today);

  // Sync timer every second if shift is ON or BREAK
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (shiftState === "ON" || shiftState === "BREAK") {
      syncTime();
      intervalId = setInterval(() => {
        syncTime();
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [shiftState, syncTime]);

  // Calculate display times based on selected date
  const displayTime = Math.floor(totalWorkedMs / 1000) + currentSessionDuration;
  const displayBreakTime =
    Math.floor(totalBreakMs / 1000) + currentBreakSessionDuration;

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
    onSelectedDateChange(newDate);
  };

  const handleGoToToday = () => {
    onSelectedDateChange(new Date());
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "set" && date) {
        onSelectedDateChange(date);
      }
    } else {
      if (date) {
        onSelectedDateChange(date);
      }
    }
  };

  const confirmDateIOS = () => {
    setShowDatePicker(false);
  };

  const canGoNext = true;

  return (
    <>
      <View
        className={`bg-bg-surface border-2 rounded-2xl ${
          isToday ? "border-bg-button shadow-lg" : "border-border-muted"
        }`}
      >
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-border-muted">
          <TouchableOpacity
            onPress={handlePreviousDay}
            className="w-12 h-12 bg-bg-tertiary rounded-xl items-center justify-center"
          >
            <Text className="text-2xl text-text-primary font-bold">‹</Text>
          </TouchableOpacity>

          <View className="items-center gap-4">
            <TouchableOpacity onPress={openDatePicker}>
              <Text className="text-[22px] font-semibold text-text-primary">
                {formatDateDisplay(selectedDate)}
              </Text>
            </TouchableOpacity>

            {!isToday && (
              <TouchableOpacity
                onPress={handleGoToToday}
                className="bg-bg-accent flex-row px-3 py-0.5 rounded-full border border-bg-button"
              >
                <RedirectDarkIcon />
                <Text className="text-sm font-semibold text-bg-button">
                  Today
                </Text>
              </TouchableOpacity>
            )}
          </View>

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
            <View className="flex-[0.7] pr-3 py-2">
              <Text className="text-sm text-text-tertiary mb-2">Shift</Text>
              <Text className="text-lg font-semibold text-text-primary">
                {shiftType || "Not Started"}
              </Text>
            </View>

            <View className="w-px bg-border-secondary" />

            <View className="flex-[0.8] px-3 py-2">
              <Text className="text-sm text-text-tertiary mb-2">
                Shift Time
              </Text>
              <Text className="text-base font-semibold text-text-primary">
                {getShiftTimeRange(shiftType)}
              </Text>
            </View>

            <View className="w-px bg-border-secondary" />

            <View className="flex-[1.3] px-3 py-2">
              <Text className="text-sm text-text-tertiary mb-2">
                Worked Time
              </Text>
              <Text className="text-lg font-bold text-text-primary">
                {formatTimeHoursMinutes(displayTime)}
              </Text>
            </View>

            <View className="w-px bg-border-secondary" />

            <View className="flex-[1.3] pl-3 py-2">
              <Text className="text-sm text-text-tertiary mb-2">
                Break Time
              </Text>
              <Text className="text-lg font-bold text-text-primary">
                {formatTimeHoursMinutes(displayBreakTime)}
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
  const { tasks, isLoading, error, selectedTaskId, setSelectedTaskId } =
    useTaskStore();
  const { user } = useAuthStore();

  const selectedTask = useMemo(() => {
    return tasks.find((t) => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  // Only drivers can view task details
  const isDriver = true;

  const handleViewDetails = (task: UnifiedTask) => {
    if (isDriver) {
      setSelectedTaskId(task.id);
    }
  };

  const pendingCount = tasks.filter((t) => t.status === "PENDING").length;

  return (
    <View className="flex-1 mt-5 bg-bg-surface rounded-2xl p-5 shadow-sm">
      {selectedTask ? (
        <TaskDetailPanel
          task={selectedTask}
          onBack={() => setSelectedTaskId(null)}
        />
      ) : (
        <>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-text-primary">
              My Tasks
            </Text>
          </View>

          {/* Table Header */}
          <View className="flex-row bg-bg-tertiary py-3 px-3.5 rounded-[10px] mb-1.5">
            <Text className="w-10 text-sm font-bold text-text-secondary">
              No
            </Text>
            <Text className="flex-1 text-sm font-bold text-text-secondary">
              Task
            </Text>
            <Text className="w-20 text-sm font-bold text-text-secondary text-center">
              Time
            </Text>
            <Text className="w-28 text-sm font-bold text-text-secondary text-center">
              Status
            </Text>
            <Text className="w-32 text-sm font-bold text-text-secondary text-right">
              Action
            </Text>
          </View>

          {/* Table Body */}
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
              tasks.map((task, index) => {
                const isPending = task.status === "PENDING";
                return (
                  <View
                    key={task.id}
                    className="flex-row py-4 border-b border-bg-tertiary items-center px-3.5"
                  >
                    <Text className="w-10 text-base text-text-secondary">
                      {String(index + 1).padStart(2, "0")}
                    </Text>

                    <Text className="flex-1 text-base text-text-primary">
                      {task.taskDetails?.jobType} {task.title}
                    </Text>

                    <Text className="w-20 text-base text-text-primary text-center">
                      {formatTimeFromISO(task.startTime)}
                    </Text>

                    <View className="w-28 items-center">
                      <Text
                        className={`text-base font-semibold ${
                          isPending ? "text-[#F59E0B]" : "text-[#22C55E]"
                        }`}
                      >
                        {isPending ? "Pending" : task.status}
                      </Text>
                    </View>

                    {/* Action */}
                    <TouchableOpacity
                      className="w-32 items-end"
                      onPress={() => handleViewDetails(task)}
                      disabled={!isDriver}
                    >
                      <Text
                        className={`text-base font-semibold underline ${
                          isDriver ? "text-text-primary" : "text-text-muted"
                        }`}
                      >
                        View Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const TaskDetailPanel: React.FC<{
  task: UnifiedTask | null;
  onBack: () => void;
}> = ({ task, onBack }) => {
  if (!task) return null;

  const renderTaskDetails = () => {
    // Render Dispatcher task details for now, can be extended for other job types
    // Using task.sourceType or task.task_type
    const type = (task as any).task_type || task.sourceType;
    if (type === "DISPATCH") {
      return <DispatcherTaskDetails task={task} />;
    }
    return (
      <View className="py-10 items-center">
        <Text className="text-text-secondary">
          Details for {type} tasks are not implemented yet.
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1">
      {/* Header */}
      <TouchableOpacity onPress={onBack} className="flex-row items-center mb-5">
        <Text className="text-2xl text-text-primary mr-2">←</Text>
        <Text className="text-xl font-bold text-text-primary">
          {task.taskDetails?.jobType} {task.title}
        </Text>
      </TouchableOpacity>

      {/* Detail Content */}
      {renderTaskDetails()}
    </View>
  );
};

export const MainContent: React.FC = () => {
  const route = useRoute<any>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Handle selectedDate from navigation params
  useEffect(() => {
    const paramDate = route.params?.selectedDate;
    if (paramDate) {
      const parsedDate = new Date(paramDate);
      if (
        !isNaN(parsedDate.getTime()) &&
        !isSameDay(selectedDate, parsedDate)
      ) {
        setSelectedDate(parsedDate);
      }
    }
  }, [route.params?.selectedDate, selectedDate]);
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
