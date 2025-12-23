import React from "react";

import {
  ArchiveIcon,
  BracketIcon,
  DresserIcon,
  TrayIcon,
  WashingMachineIcon,
} from "../../assets/icons";

export const getIconForPreparationType = (type: string) => {
  const lowerType = type?.toLowerCase() || "";
  if (lowerType.includes("bond")) return <ArchiveIcon width={20} height={20} />;
  if (lowerType.includes("dry")) return <BracketIcon width={20} height={20} />;
  if (lowerType.includes("laundry"))
    return <WashingMachineIcon width={20} height={20} />;
  if (lowerType.includes("loading"))
    return <DresserIcon width={20} height={20} />;
  if (lowerType.includes("tray")) return <TrayIcon width={20} height={20} />;
  return <DresserIcon width={20} height={20} />;
};
