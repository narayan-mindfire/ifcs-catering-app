import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
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

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours} Hrs ${formattedMinutes} Mins`;
};

const ShiftControlCard: React.FC = () => {
  type ShiftState = "OFF" | "ON" | "BREAK";
  const [shiftState, setShiftState] = useState<ShiftState>("OFF");
  const [workingTimeInSeconds, setWorkingTimeInSeconds] = useState(0);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    if (shiftState === "ON") {
      const intervalId = setInterval(() => {
        setWorkingTimeInSeconds((prevSeconds) => prevSeconds + 1);
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
    if (shiftState === "ON") {
      setShiftState("BREAK");
    } else if (shiftState === "BREAK") {
      setShiftState("ON");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.shiftHeader}>
        <Text style={styles.dateText}>Thu 11 13, Thu</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <View style={styles.shiftBody}>
        <View style={styles.shiftRight}>
          <Text style={styles.shiftTitle}>My Shift</Text>
          <Text style={styles.shiftTime}>10:00 AM - 6:00 PM</Text>
        </View>
        <View style={styles.shiftLeft}>
          <Text style={styles.shiftTitle}>Today's Working Time</Text>
          <Text style={styles.shiftTime}>
            {formatTime(workingTimeInSeconds)}
          </Text>
        </View>
      </View>

      <View style={styles.shiftFooter}>
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
                  <View style={styles.pauseIcon} />
                ) : (
                  <View style={styles.playIcon} />
                )
              }
              style={{ flex: 3, marginRight: 10 }}
            />

            <AppButton
              title="End Shift"
              type="danger"
              onPress={handleEndShift}
              IconComponent={<View style={styles.endIcon} />}
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
    <View style={[styles.card, { flex: 1, marginTop: 20 }]}>
      <Text style={styles.tasksTitle}>My Tasks</Text>

      {/* Task Table Header */}
      <View style={styles.taskTableHeader}>
        <Text style={[styles.taskHeaderText, { flex: 1 }]}>ID</Text>
        <Text style={[styles.taskHeaderText, { flex: 3 }]}>Task</Text>
        <Text style={[styles.taskHeaderText, { flex: 2 }]}>Flight#</Text>
        <Text style={[styles.taskHeaderText, { flex: 2 }]}>Time</Text>
        <Text style={[styles.taskHeaderText, { flex: 2 }]}>Status</Text>
        <Text style={[styles.taskHeaderText, { flex: 2, textAlign: "right" }]}>
          Action
        </Text>
      </View>

      {/* Task List */}
      <ScrollView style={styles.taskList}>
        {mockTasks.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <Text style={[styles.taskCell, { flex: 1 }]}>{task.id}</Text>
            <Text style={[styles.taskCell, { flex: 3 }]}>{task.task}</Text>
            <Text style={[styles.taskCell, { flex: 2 }]}>{task.flight}</Text>
            <Text style={[styles.taskCell, { flex: 2 }]}>{task.time}</Text>
            <Text style={[styles.taskCell, { flex: 2 }]}>{task.status}</Text>
            <TouchableOpacity style={{ flex: 2, alignItems: "flex-end" }}>
              <Text style={styles.actionButton}>...</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export const MainContent: React.FC = () => {
  return (
    <View style={styles.mainContainer}>
      <ShiftControlCard />
      <TasksCard />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  shiftHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dateText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#333",
  },
  shiftBody: {
    flexDirection: "row",
    marginBottom: 20,
  },
  shiftRight: {
    flex: 3,
    paddingRight: 10,
  },
  shiftLeft: {
    flex: 1,
    paddingLeft: 10,
  },
  shiftTitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 4,
  },
  shiftTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  shiftFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  startShiftButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6200EE",
    borderRadius: 8,
    paddingVertical: 12,
  },
  startShiftButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  breakButton: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 10,
  },
  breakButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  onBreakButton: {
    backgroundColor: "#6200EE",
  },
  onBreakButtonText: {
    color: "#ffffff",
  },
  endShiftButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D90429",
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 10,
  },
  endShiftButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  // Mock Icons
  playIcon: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 10,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#333",
    marginRight: 8,
  },
  pauseIcon: {
    width: 10,
    height: 12,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: "#FFFFFF",
    marginRight: 8,
  },
  endIcon: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 2,
    marginRight: 8,
  },
  // Task Card Styles
  tasksTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  taskTableHeader: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  taskList: {
    flex: 1,
  },
  taskRow: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    alignItems: "center",
  },
  taskCell: {
    fontSize: 18,
    color: "#333",
  },
  actionButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    paddingHorizontal: 8,
  },
});
