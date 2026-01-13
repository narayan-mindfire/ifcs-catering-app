import React, { useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { UserDropdown } from "../components/common/UserDropdown";
import { MainContent } from "../components/dashboard/MainContent";
import { Sidebar } from "../components/dashboard/Sidebar";
import { useAuthStore } from "../store/useAuthStore";
import { log } from "../utils/logger";

const useAuth = () => ({
  signOut: () => log.info("MOCK: Logout action fired"),
});

const DashboardContent: React.FC = () => {
  const { width } = useWindowDimensions();
  const { signOut } = useAuth();
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);
  const { user } = useAuthStore();

  const layoutStyles = useMemo(() => {
    const isLargeScreen = width > 1024;
    return {
      sidebarFlex: 4,
      mainContentFlex: isLargeScreen ? 6 : 5,
    };
  }, [width]);

  const handleCloseDropdown = () => setIsUserDropdownVisible(false);

  return (
    <View className="flex-1 bg-bg-quaternary">
      <View className="flex-1 flex-row py-5">
        <View
          className="ml-5 mr-2.5"
          style={{ flex: layoutStyles.sidebarFlex }}
        >
          <Sidebar
            userName={user?.firstName + " " + user?.lastName}
            position={"OAC Operations"}
          />
        </View>

        <View
          className="rounded-2xl overflow-hidden shadow-sm mr-5 bg-bg-surface"
          style={{ flex: layoutStyles.mainContentFlex }}
        >
          <MainContent />
        </View>
      </View>

      <UserDropdown
        visible={isUserDropdownVisible}
        onClose={handleCloseDropdown}
        onLogout={signOut}
      />
    </View>
  );
};

const DashboardScreen: React.FC = () => {
  return <DashboardContent />;
};

export default DashboardScreen;
