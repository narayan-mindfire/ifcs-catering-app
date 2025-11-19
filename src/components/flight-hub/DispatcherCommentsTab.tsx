import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DispatcherCommentsTab: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No dispatcher comments available.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAE9EC",
    padding: 24,
    alignItems: "center",
  },
  text: { fontSize: 14, color: "#A09CAB" },
});

export default DispatcherCommentsTab;
