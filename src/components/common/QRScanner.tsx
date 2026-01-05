import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  scanned: boolean;
  title?: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onClose,
  scanned,
  title = "Align QR code within the frame",
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [zoom, setZoom] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const translateY = useSharedValue(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setIsActive(true);

    return () => {
      mountedRef.current = false;
      setIsActive(false);
    };
  }, []);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!scanned && isActive) {
      translateY.value = withRepeat(
        withTiming(290, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
    } else {
      translateY.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanned, isActive]);

  const lineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleClose = () => {
    setIsActive(false);
    // Small delay to ensure camera cleanup before closing
    setTimeout(() => {
      if (mountedRef.current) {
        onClose();
      }
    }, 100);
  };

  const handleScan = (data: string) => {
    if (mountedRef.current && isActive) {
      onScan(data);
    }
  };

  if (!permission) return <View className="flex-1 bg-black" />;

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center px-6">
        <Text className="text-white text-center text-xl mb-6 font-medium">
          Camera access is required.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-[#5046e5] px-8 py-4 rounded-xl"
        >
          <Text className="text-white font-bold text-lg">Grant Access</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClose} className="mt-6">
          <Text className="text-gray-400 text-lg">Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isActive) {
    return <View className="flex-1 bg-black" />;
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        zoom={zoom}
        onBarcodeScanned={
          scanned ? undefined : (result) => handleScan(result.data)
        }
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      <View
        style={StyleSheet.absoluteFillObject}
        className="flex-1 bg-black/60"
      >
        <View className="absolute top-12 right-8 z-10">
          <TouchableOpacity
            onPress={handleClose}
            className="bg-black/40 p-3 rounded-full border border-white/20"
          >
            <Text className="text-white text-xl font-bold">✕</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center items-center">
          <Text className="text-white font-medium text-xl mb-10 opacity-90">
            {title}
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
          <View className="flex-row items-center gap-4 mt-12 bg-black/40 px-6 py-3 rounded-full border border-white/10">
            <TouchableOpacity onPress={() => setZoom(Math.max(0, zoom - 0.1))}>
              <Text className="text-white text-3xl font-bold">-</Text>
            </TouchableOpacity>
            <Text className="text-white font-mono min-w-[60px] text-center">
              {(zoom * 10).toFixed(1)}x
            </Text>
            <TouchableOpacity onPress={() => setZoom(Math.min(1, zoom + 0.1))}>
              <Text className="text-white text-3xl font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
