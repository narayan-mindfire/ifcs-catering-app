import { View } from "react-native";
import React from "react";
import { Header } from "../components/dashboard/Header";
import { Breadcrumb } from "../components/common/BreadCrumbs";

const DocumentsScreen = () => {
  return (
    <View>
      <Header userName={"Shitanshu"} onUserPress={() => {}} />
      <Breadcrumb currentScreen={"Documents"} />
    </View>
  );
};

export default DocumentsScreen;
