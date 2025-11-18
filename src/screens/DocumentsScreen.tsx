import { View } from "react-native";
import React from "react";
import { BreadCrumb } from "../components/common/BreadCrumbs";
import { RootStackParamList } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type DocumentsScreenRouteProp = RouteProp<RootStackParamList, "Documents">;
type DocumentsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Documents"
>;

interface Props {
  route: DocumentsScreenRouteProp;
  navigation: DocumentsScreenNavigationProp;
}

const DocumentsScreen: React.FC<Props> = ({ navigation }) => {
  const breadcrumbItems = [
    {
      label: "Dashboard",
      onPress: () => navigation.navigate("Dashboard"),
    },
    {
      label: "Documents",
    },
  ];
  return (
    <View>
      <BreadCrumb items={breadcrumbItems} />
    </View>
  );
};

export default DocumentsScreen;
