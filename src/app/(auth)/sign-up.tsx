import React, { useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText, AppButton, TextField, PasswordField, IconButton } from "@/components/ui";
import { useColors } from "@/theme";

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignUp = async () => {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      await signUp.create({
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || undefined,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? "Verification failed");
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
          {pendingVerification ? "Verify your email" : "Create account"}
        </AppText>
        <AppText variant="body" color="secondary" style={{ marginBottom: 32 }}>
          {pendingVerification
            ? `We sent a code to ${email}`
            : "Join the Pitchboard community"}
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

        {pendingVerification ? (
          <View style={{ gap: 20 }}>
            <TextField
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              icon="shield"
            />
            <AppButton
              title="Verify Email"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onPress={onVerify}
            />
          </View>
        ) : (
          <View style={{ gap: 20 }}>
            <TextField
              label="Full Name"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              icon="user"
            />
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
              placeholder="Create a strong password"
              value={password}
              onChangeText={setPassword}
            />
            <AppButton
              title="Create Account"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onPress={onSignUp}
              disabled={!name || !email || !password}
            />

            <Pressable
              onPress={() => router.replace("/(auth)/sign-in" as any)}
              style={{ alignSelf: "center", paddingVertical: 8 }}
            >
              <AppText variant="body" color="secondary">
                Already have an account?{" "}
                <AppText
                  variant="body"
                  color="inherit"
                  weight="semibold"
                  style={{ color: colors.primary }}
                >
                  Sign in
                </AppText>
              </AppText>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

