import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { StackNavigationProp } from "@react-navigation/stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { RootStackParamList } from "../../App";

type NavigationProp = StackNavigationProp<RootStackParamList, "QRCodeScanner">;

interface Props {
  navigation: NavigationProp;
}

const QRCodeScannerScreen: React.FC<Props> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const translateY = useSharedValue(0);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission]);

  useEffect(() => {
    if (!scanned) {
      translateY.value = withRepeat(
        withTiming(290, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanned]);

  const lineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!permission) return <View className="flex-1 bg-black" />;

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center px-6">
        <Text className="text-white text-center text-xl mb-6 font-medium">
          Camera access is required to scan QR codes.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-[#5046e5] px-8 py-4 rounded-xl"
        >
          <Text className="text-white font-bold text-lg">
            Allow Camera Access
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-6">
          <Text className="text-gray-400 text-lg">Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    Alert.alert("Flight Detected", `Flight ID: ${data}`, [
      {
        text: "View Flight",
        onPress: () => {
          console.log("Navigating to flight:", data);
          navigation.goBack();
        },
      },
      {
        text: "Scan Another",
        onPress: () => setScanned(false),
        style: "cancel",
      },
    ]);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden={true} />
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View className="flex-1 bg-black/60">
          <View className="absolute top-12 right-8 z-10">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-black/40 p-3 rounded-full border border-white/20"
            >
              <Text className="text-white text-xl font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-center items-center">
            <Text className="text-white font-medium text-xl mb-10 opacity-90">
              Align QR code within the frame
            </Text>

            <View className="w-[300px] h-[300px] relative bg-transparent overflow-hidden">
              <View className="absolute top-0 left-0 w-10 h-10 border-t-[6px] border-l-[6px] border-[#5046e5] rounded-tl-xl" />
              <View className="absolute top-0 right-0 w-10 h-10 border-t-[6px] border-r-[6px] border-[#5046e5] rounded-tr-xl" />
              <View className="absolute bottom-0 left-0 w-10 h-10 border-b-[6px] border-l-[6px] border-[#5046e5] rounded-bl-xl" />
              <View className="absolute bottom-0 right-0 w-10 h-10 border-b-[6px] border-r-[6px] border-[#5046e5] rounded-br-xl" />

              {!scanned && (
                <Animated.View
                  style={[
                    lineAnimatedStyle,
                    {
                      shadowColor: "#5046e5",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 1,
                      shadowRadius: 10,
                      elevation: 5,
                    },
                  ]}
                  className="w-full h-[2px] bg-[#5046e5] absolute top-0"
                />
              )}
            </View>

            <View className="absolute bottom-20">
              <TouchableOpacity
                onPress={() => handleBarCodeScanned({ data: "WY913" })}
                className="bg-white/10 border border-white/30 px-6 py-3 rounded-full"
              >
                <Text className="text-white/80 font-medium">
                  Debug: Simulate Scan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default QRCodeScannerScreen;
