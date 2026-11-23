import React, { useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText, AppButton, TextField, PasswordField, IconButton } from "@/components/ui";
import { useColors } from "@/theme";

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignIn = async () => {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        setError("Sign in incomplete. Please try again.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <IconButton
          name="arrow-left"
          onPress={() => router.back()}
          style={{ marginLeft: -12, marginBottom: 16 }}
        />

        <AppText variant="h1" style={{ marginBottom: 8 }}>
          Welcome back
        </AppText>
        <AppText variant="body" color="secondary" style={{ marginBottom: 32 }}>
          Sign in to continue building
        </AppText>

        {error ? (
          <View
            style={{
              backgroundColor: colors.error + "15",
              borderRadius: 12,
              padding: 14,
              marginBottom: 20,
            }}
          >
            <AppText variant="caption" color="error">
              {error}
            </AppText>
          </View>
        ) : null}

        <View style={{ gap: 20 }}>
          <TextField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            icon="mail"
          />
          <PasswordField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
          />

          <AppButton
            title="Sign In"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onPress={onSignIn}
            disabled={!email || !password}
          />

          <Pressable
            onPress={() => router.replace("/(auth)/sign-up" as any)}
            style={{ alignSelf: "center", paddingVertical: 8 }}
          >
            <AppText variant="body" color="secondary">
              Don&apos;t have an account?{" "}
              <AppText
                variant="body"
                color="inherit"
                weight="semibold"
                style={{ color: colors.primary }}
              >
                Sign up
              </AppText>
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

