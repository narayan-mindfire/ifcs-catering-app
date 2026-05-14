import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { DropdownIcon, UserIcon } from "@/assets/icons";
import { useAuthStore } from "@/store/useAuthStore";

export const Header: React.FC<{ onUserPress: () => void }> = ({
  onUserPress,
}) => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  return (
    <View className="flex flex-row items-center justify-between px-5 py-4 bg-bg-surface border-b border-border-muted relative z-10 mt-3">
      <View className="flex-1">
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Image
            source={require("../../assets/images/galleyx.png")}
            className="h-[35px] w-[180px] md:h-10 md:w-[200px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 flex-row items-center justify-end pr-[120px]">
        <TouchableOpacity
          className="flex-row items-center mr-5"
          onPress={onUserPress}
        >
          <View className="w-[35px] h-[35px] rounded-full justify-center items-center mr-2">
            {user && user.picture ? (
              <Image
                source={{ uri: user.picture }}
                className="w-[30px] h-[30px]"
                resizeMode="contain"
              />
            ) : (
              <UserIcon />
            )}
          </View>

          <Text className="text-base md:text-lg font-semibold text-text-secondary mr-1.5">
            {user
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
              : "Loading..."}{" "}
            <DropdownIcon />
          </Text>
        </TouchableOpacity>

        <View className="absolute right-5 bottom-[-30px] z-10">
          <View className="h-[80px] md:h-[85px] rounded-lg justify-center items-center">
            <Image
              source={require("../../assets/images/TRANSOM.png")}
              className="w-[75px] h-[70px]"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </View>
  );
};
