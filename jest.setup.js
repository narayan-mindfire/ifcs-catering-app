/* eslint-env jest */

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

// Silence the warning: Animated: `useNativeDriver` is not supported
// jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Mock expo modules
jest.mock("expo-file-system/legacy", () => ({
  documentDirectory: "file:///",
  downloadAsync: jest.fn(() => Promise.resolve({ uri: "file:///test.pdf" })),
}));

jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock("expo-camera", () => ({
  Camera: "Camera",
  CameraType: { back: "back", front: "front" },
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native/Libraries/Components/View/View");
  return {
    GestureHandlerRootView: View,
    State: {},
    PanGestureHandler: View,
    gestureHandlerRootHOC: jest.fn(),
  };
});

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));
