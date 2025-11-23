import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { Sidebar } from "../components/dashboard/Sidebar";
import { UserDropdown } from "../components/common/UserDropdown";
import { MainContent } from "../components/dashboard/MainContent";

const useAuth = () => ({
  signOut: () => console.log("MOCK: Logout action fired"),
});

const DashboardContent: React.FC = () => {
  const { signOut } = useAuth();
  const [isUserDropdownVisible, setIsUserDropdownVisible] =
    useState<boolean>(false);
  const { width } = useWindowDimensions();

  const isLargeScreen = width > 1024;
  const sidebarFlex = isLargeScreen ? 4 : 4;
  const mainContentFlex = isLargeScreen ? 6 : 5;

  return (
    <View className="flex-1 bg-bg-quaternary">
      <View className="flex-1 flex-row py-5">
        <View className="ml-5 mr-2.5" style={{ flex: sidebarFlex }}>
          <Sidebar userName="Shitanshu" />
        </View>

        <View
          className="rounded-2xl overflow-hidden shadow-sm mr-5 bg-bg-surface"
          style={{ flex: mainContentFlex }}
        >
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

export default DashboardScreen;
