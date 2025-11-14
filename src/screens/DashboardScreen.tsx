import React, { useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";

const useAuth = () => ({
  signOut: () => console.log("MOCK: Logout action fired"),
});

import { Header } from "../components/dashboard/Header";
import { Sidebar } from "../components/dashboard/Sidebar";
import { UserDropdown } from "../components/common/UserDropdown";

import { MainContent } from "../components/dashboard/MainContent";

const DashboardContent: React.FC = () => {
  const { signOut } = useAuth();

  const [isUserDropdownVisible, setIsUserDropdownVisible] =
    useState<boolean>(false);

  const { width } = useWindowDimensions();

  const isLargeScreen = width > 1024;
  const sidebarFlex = isLargeScreen ? 4 : 5;
  const mainContentFlex = isLargeScreen ? 6 : 5;

  return (
    <View style={styles.container}>
      <Header
        userName="Shitanshu"
        onUserPress={() => setIsUserDropdownVisible(true)}
      />

      <View style={styles.bodyContainer}>
        <View style={[styles.sidebarContainer, { flex: sidebarFlex }]}>
          <Sidebar userName="Shitanshu" />
        </View>

        <View style={[styles.mainContent, { flex: mainContentFlex }]}>
          <MainContent />
        </View>
      </View>

      <UserDropdown
        visible={isUserDropdownVisible}
        onClose={() => setIsUserDropdownVisible(false)}
        onLogout={signOut}
      />
    </View>
  );
};

const DashboardScreen: React.FC = () => {
  return <DashboardContent />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 20,
  },
  sidebarContainer: {
    marginLeft: 20,
    marginRight: 10,
  },
  mainContent: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    marginRight: 20,
    backgroundColor: "#ffffff",
  },
});

export default DashboardScreen;
