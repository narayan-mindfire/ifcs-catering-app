import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { DropdownIcon, UserIcon } from "../../assets/icons";
import { EmairatesIcon } from "../../assets/logos";
type RootStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type StackNavigationProp<T extends RootStackParamList> = any;

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface HeaderProps {
  userName: string;
  onUserPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, onUserPress }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View
      className="flex flex-row items-center justify-between px-5 py-4 
                 bg-bg-surface border-b border-border-muted relative z-10 mt-3"
    >
      <View className="flex-1">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Dashboard");
          }}
        >
          <View>
            <Image
              source={require("../../assets/images/galleyx.png")}
              className="h-[35px] w-[180px] md:h-10 md:w-[200px]"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>

      <View className="flex-1 flex flex-row items-center justify-end pr-[120px]">
        <View>
          <TouchableOpacity
            className="flex flex-row items-center mr-5"
            onPress={onUserPress}
          >
            <View className="w-[35px] h-[35px] rounded-full justify-center items-center mr-2">
              <Text className="text-lg">
                <UserIcon />
              </Text>
            </View>
            <Text className="text-base md:text-lg font-semibold text-text-secondary mr-1.5">
              {userName} <DropdownIcon />
            </Text>
          </TouchableOpacity>
        </View>
        <View className="absolute right-5 bottom-[-30px] z-10">
          <View
            className="bg-red-700 w-[65px] h-[60px] md:w-[60px] md:h-[65px] 
                       rounded-lg justify-center items-center"
          >
            <EmairatesIcon height={65} width={60} />
          </View>
        </View>
      </View>
    </View>
  );
};
