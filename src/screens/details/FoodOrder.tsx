import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const FoodOrderScreen: React.FC = () => (
  <View style={styles.container}>
    <Text>Food Order Content</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
