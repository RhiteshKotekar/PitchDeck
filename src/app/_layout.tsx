import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@/lib/auth";
import { ThemeProvider, useTheme } from "@/theme";
import { ToastProvider, AppText, AppButton } from "@/components/ui";
import { setTokenGetter } from "@/lib/api";
import Constants from "expo-constants";

import "../../global.css";

SplashScreen.preventAutoHideAsync().catch(() => {});

const CLERK_KEY =
  Constants.expoConfig?.extra?.clerkPublishableKey ||
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      setTokenGetter(() => getToken());
    }
  }, [isLoaded, getToken]);

  useEffect(() => {
    if (!isLoaded) return;

    const currentSeg = (segments as string[])[0];
    const inAuthGroup = currentSeg === "(auth)";

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/welcome" as any);
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)" as any);
    }
  }, [isLoaded, isSignedIn, segments, router]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope: Manrope_400Regular,
    "Manrope-Medium": Manrope_500Medium,
    "Manrope-SemiBold": Manrope_600SemiBold,
    "Manrope-Bold": Manrope_700Bold,
    Inter: Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  // If no Clerk Publishable Key is configured, show a helpful setup guide instead of crashing
  if (!CLERK_KEY) {
    return (
      <ThemeProvider>
        <ThemedStatusBar />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            backgroundColor: "#F5EFE5",
            gap: 16,
          }}
        >
          <AppText variant="h1" align="center">Pitchboard</AppText>
          <AppText variant="subtitle" color="secondary" align="center">
            Clerk Authentication Setup Required
          </AppText>
          <AppText variant="body" color="secondary" align="center" style={{ maxWidth: 320 }}>
            To use authentication, please add your Clerk publishable key to{" "}
            <AppText variant="body" weight="bold">.env</AppText> as:
            {"\n\n"}
            EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
          </AppText>
          <View style={{ marginTop: 12, width: "100%", maxWidth: 300 }}>
            <AppButton
              title="Open Mock Mode"
              variant="primary"
              onPress={() => {
                // Allows developer to explore UI with a placeholder
              }}
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ClerkProvider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
        <ToastProvider>
          <AuthGate>
              <ThemedStatusBar />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
          </AuthGate>
        </ToastProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
