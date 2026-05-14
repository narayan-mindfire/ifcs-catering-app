import { zodResolver } from "@hookform/resolvers/zod";
import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { z } from "zod";

import { MicrosoftLogo } from "../../assets/icons";
import { useAuthStore } from "../../store/useAuthStore";
import { Colors } from "../../theme/colors";

WebBrowser.maybeCompleteAuthSession();

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const decoded = atob(base64);

    const jsonPayload = decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (_e) {
    return null;
  }
};

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { login, loginWithSSO, isLoading: authLoading } = useAuthStore();
  const [nonce] = useState(() => Crypto.randomUUID());

  const discovery = AuthSession.useAutoDiscovery(
    `https://login.microsoftonline.com/${process.env.EXPO_PUBLIC_AZURE_TENANT_ID || "common"}/v2.0`,
  );

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_AZURE_CLIENT_ID || "",
      scopes: ["openid", "profile", "email", "offline_access"],
      responseType: AuthSession.ResponseType.IdToken,
      extraParams: {
        nonce: nonce,
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
        const decoded = decodeJWT(params.id_token);
        if (decoded && decoded.nonce !== nonce) {
          Alert.alert(
            "Security Error",
            "Authentication failed: Nonce mismatch. This could indicate a replay attack.",
          );
          return;
        }

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
  }, [response, nonce]);

  const handleLogin = async (data: LoginFormValues) => {
    try {
      await login(data.username, data.password);
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
          <View>
            <View className="bg-slate-800/80 rounded-2xl border border-slate-700 px-5 py-4">
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Username"
                    placeholderTextColor={Colors.text.placeholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    className="text-white text-lg font-medium"
                  />
                )}
              />
            </View>
            {errors.username && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.username.message}
              </Text>
            )}
          </View>

          <View>
            <View className="bg-slate-800/80 rounded-2xl border border-slate-700 px-5 py-4">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={Colors.text.placeholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    className="text-white text-lg font-medium"
                  />
                )}
              />
            </View>
            {errors.password && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                {errors.password.message}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit(handleLogin)}
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
