import React, { useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText, AppButton, TextField, PasswordField, IconButton } from "@/components/ui";
import { useColors } from "@/theme";

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { signUp } = useSignUp();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => {
    if (pendingVerification) {
      setPendingVerification(false);
      setCode("");
      setError("");
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(auth)/welcome" as any);
    }
  };

  const onSignUp = async () => {
    setError("");
    setLoading(true);

    try {
      const [firstName, ...lastNameParts] = name.trim().split(/\s+/);
      const signUpParams: any = {
        firstName,
        lastName: lastNameParts.join(" ") || undefined,
        emailAddress: email.trim(),
        password,
      };

      if (username.trim()) {
        signUpParams.username = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      }

      let { error: signUpError } = await signUp.password(signUpParams);

      // If Clerk rejected because username is disabled in dashboard settings, retry without username
      if (signUpError && signUpParams.username && signUpError.message?.toLowerCase().includes("username")) {
        delete signUpParams.username;
        const retry = await signUp.password(signUpParams);
        signUpError = retry.error;
      }

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      const { error: verificationError } = await signUp.verifications.sendEmailCode();
      if (verificationError) {
        setError(verificationError.message);
        return;
      }
      setPendingVerification(true);
    } catch (err: any) {
      setError(err?.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    setError("");
    setLoading(true);

    try {
      const { error: verificationError } = await signUp.verifications.verifyEmailCode({ code: code.trim() });
      if (verificationError) {
        setError(verificationError.message);
        return;
      }

      // If Clerk still requires missing fields (e.g. username is mandatory in Clerk dashboard):
      if (signUp.status !== "complete" && signUp.missingFields && signUp.missingFields.length > 0) {
        for (const missingField of signUp.missingFields) {
          if (missingField === ("username" as any)) {
            const cleanUser = (username.trim() || email.split("@")[0] || "founder")
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, "")
              .slice(0, 15);
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            const autoUser = `${cleanUser}_${randomSuffix}`;
            const { error: updateErr } = await signUp.update({ username: autoUser });
            if (updateErr) {
              console.warn("Could not auto-set username:", updateErr.message);
            }
          }
        }
      }

      if (signUp.status === "complete") {
        const { error: finalizeError } = await signUp.finalize();
        if (finalizeError) {
          setError(finalizeError.message);
          return;
        }
        router.replace("/(tabs)" as any);
      } else {
        const missing = signUp.missingFields?.join(", ") || "additional fields";
        setError(`Email verified, but sign-up is waiting on: ${missing}.`);
      }
    } catch (err: any) {
      setError(err?.message ?? "Verification failed");
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
          onPress={handleBack}
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
              label="Username (optional)"
              placeholder="e.g. founder_name"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              icon="at-sign"
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

