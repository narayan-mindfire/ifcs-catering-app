import { StyleSheet, View } from "react-native";
import DashboardScreen from "./src/screens/DashboardScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <DashboardScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
