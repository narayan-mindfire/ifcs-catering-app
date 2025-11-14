import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { SvgProps } from "react-native-svg";
import { RedirectIcon } from "../../assets/icons";

const { width } = Dimensions.get("window");

const isLargeScreen = width > 1024;
const titleFontSize = isLargeScreen ? 24 : 20;
const countFontSize = isLargeScreen ? 24 : 20;

interface NavigationCardProps {
  title: string;
  IconComponent: React.FC<SvgProps>;
  count?: string;
  onPress: () => void;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  title,
  IconComponent,
  count,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.navCard} onPress={onPress}>
      <BlurView
        intensity={20}
        tint="dark"
        style={[StyleSheet.absoluteFill, styles.blurView]}
      />
      <RedirectIcon
        style={styles.navCardArrow}
        fill="rgba(255, 255, 255, 0.7)"
        width={24}
        height={24}
      />
      <View style={styles.navCardMainContent}>
        <IconComponent width={40} height={40} style={styles.navCardIconImage} />
        <View style={styles.navCardTitleContainer}>
          {/* 4. Apply the dynamic font size */}
          <Text style={[styles.navCardTitle, { fontSize: titleFontSize }]}>
            {title}
          </Text>
          {count && (
            <Text style={[styles.navCardCount, { fontSize: countFontSize }]}>
              ({count})
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navCard: {
    borderRadius: 12,
    padding: 15,
    width: "48%",
    aspectRatio: 1.5,
    overflow: "hidden",
    justifyContent: "flex-start",
    borderColor: "#ffffff7c",
    backgroundColor: "#0000000d",
    borderWidth: 1,
  },
  navCardMainContent: {
    alignItems: "flex-start",
  },
  navCardTitleContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  navCardTitle: {
    fontWeight: "500",
    color: "#ffffff",
  },
  navCardIconImage: {
    marginBottom: 4,
  },
  navCardCount: {
    color: "#ffffff",
    marginLeft: 6,
  },
  navCardArrow: {
    position: "absolute",
    top: 10,
    right: 15,
  },
  blurView: {
    borderRadius: 12,
  },
});
