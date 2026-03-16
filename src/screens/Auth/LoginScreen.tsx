import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/useAuthStore";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }
    try {
      await login(username, password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert("Login Failed", "Please check your credentials.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-8"
      >
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-blue-600 rounded-3xl items-center justify-center mb-6 shadow-xl shadow-blue-600/40">
            <Text className="text-white text-5xl font-extrabold tracking-tighter">
              IF
            </Text>
          </View>
          <Text className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Welcome Back
          </Text>
          <Text className="text-slate-400 text-base font-medium">
            Sign in to continue to CATERING APP
          </Text>
        </View>

        <View className="gap-y-4">
          <View className="bg-slate-800/80 rounded-2xl border border-slate-700 px-5 py-4">
            <TextInput
              placeholder="Username"
              placeholderTextColor="#94a3b8"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              className="text-white text-lg font-medium"
            />
          </View>

          <View className="bg-slate-800/80 rounded-2xl border border-slate-700 px-5 py-4">
            <TextInput
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="text-white text-lg font-medium"
            />
          </View>
        </View>

        <TouchableOpacity className="self-end mt-4 mb-8">
          <Text className="text-blue-400 font-semibold text-sm">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className={`bg-blue-600 rounded-2xl py-4 items-center shadow-lg shadow-blue-600/30 ${isLoading ? "opacity-70" : ""}`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold tracking-wide">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-10">
          <Text className="text-slate-400 font-medium">
            Don&apos;t have an account?{" "}
          </Text>
          <TouchableOpacity>
            <Text className="text-blue-400 font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
