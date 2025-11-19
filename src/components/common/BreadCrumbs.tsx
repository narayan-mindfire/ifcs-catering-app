import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface GenericBreadcrumbProps {
  items: BreadcrumbItem[];
}

export const BreadCrumb: React.FC<GenericBreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const hasAction = !!item.onPress && !isLast;

        if (isLast) {
          return (
            <React.Fragment key={index}>
              <Text style={styles.currentActiveText}>{item.label}</Text>
            </React.Fragment>
          );
        }
        const itemContent = (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            disabled={!hasAction}
            style={styles.breadcrumbItem}
          >
            <Text style={hasAction ? styles.linkText : styles.staticText}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
        const separator = !isLast && <Text style={styles.separator}>›</Text>;

        return (
          <React.Fragment key={index}>
            {itemContent}
            {separator}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  breadcrumbItem: {
    marginHorizontal: 4,
  },
  linkText: {
    fontSize: 18,
    color: "#6e6d6dff",
    fontWeight: "500",
  },
  staticText: {
    fontSize: 18,
    color: "#232222ff",
    fontWeight: "400",
  },
  currentActiveText: {
    fontSize: 22,
    color: "#3a3939",
    fontWeight: "700",
  },
  separator: {
    fontSize: 18,
    color: "#999999",
    marginHorizontal: 8,
  },
});
