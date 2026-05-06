import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MicrosoftLogo } from "../../assets/icons";
import { useAuthStore } from "../../store/useAuthStore";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithSSO, isLoading: authLoading } = useAuthStore();

  const discovery = AuthSession.useAutoDiscovery(
    `https://login.microsoftonline.com/${process.env.EXPO_PUBLIC_AZURE_TENANT_ID || "common"}/v2.0`,
  );

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_AZURE_CLIENT_ID || "",
      scopes: ["openid", "profile", "email", "offline_access"],
      responseType: AuthSession.ResponseType.IdToken,
      extraParams: {
        nonce: "custom_nonce_value", // In a real app, generate a unique nonce
      },
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "msauth.com.ifcs-catering.app",
        path: "auth",
      }),
    },
    discovery,
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { params } = response;
      if (params.id_token) {
        loginWithSSO(params.id_token).catch((err) => {
          Alert.alert(
            "SSO Login Failed",
            err.message || "Failed to log in with Microsoft.",
          );
        });
      } else if (params.code) {
        loginWithSSO(params.code).catch((err) => {
          Alert.alert(
            "SSO Login Failed",
            err.message || "Failed to log in with Microsoft.",
          );
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

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
        className="flex-1 justify-center px-64"
      >
        <View className="items-center mb-12">
          <Image
            source={require("../../assets/images/galleyx.png")}
            className="h-[35px] w-[180px] mb-8 md:h-10 md:w-[200px]"
            resizeMode="contain"
          />
          <Text className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Welcome Back
          </Text>
          <Text className="text-slate-400 text-base font-medium">
            Sign in to continue to the LOAD APP
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

        <TouchableOpacity
          onPress={handleLogin}
          disabled={authLoading}
          className={`bg-blue-600 rounded-2xl py-4 mt-8 items-center shadow-lg shadow-blue-600/30 ${authLoading ? "opacity-70" : ""}`}
        >
          {authLoading && !request ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold tracking-wide">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center my-8">
          <View className="flex-1 h-[1px] bg-slate-700" />
          <Text className="mx-4 text-slate-500 font-medium">OR</Text>
          <View className="flex-1 h-[1px] bg-slate-700" />
        </View>

        <TouchableOpacity
          onPress={() => promptAsync()}
          disabled={!request || authLoading}
          className={`bg-white rounded-2xl py-2 flex-row justify-center items-center gap-x-3 self-center px-8 shadow-lg ${!request || authLoading ? "opacity-50" : ""}`}
        >
          <MicrosoftLogo width={20} height={20} />
          <Text className="text-slate-900 text-lg font-bold tracking-wide">
            Sign In with Microsoft
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
