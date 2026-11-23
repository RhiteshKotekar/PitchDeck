import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText, AppButton } from "@/components/ui";
import { useColors } from "@/theme";
import { Feather } from "@expo/vector-icons";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 24,
      }}
    >
      {/* Top spacer */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Brand icon */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <Feather name="zap" size={36} color="#FFFFFF" />
        </View>

        {/* Brand name */}
        <AppText variant="h1" align="center" style={{ fontSize: 32, marginBottom: 12 }}>
          Pitchboard
        </AppText>

        {/* Tagline */}
        <AppText
          variant="h3"
          align="center"
          style={{
            color: colors.primary,
            marginBottom: 16,
            lineHeight: 28,
          }}
        >
          Big ideas deserve a{"\n"}bigger stage.
        </AppText>

        {/* Description */}
        <AppText
          variant="body"
          color="secondary"
          align="center"
          style={{ maxWidth: 300, lineHeight: 24 }}
        >
          Join a community of builders. Share your startup ideas, get feedback,
          and discover what&apos;s next.
        </AppText>
      </View>

      {/* Bottom CTAs */}
      <View style={{ gap: 12 }}>
        <AppButton
          title="Get Started"
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => router.push("/(auth)/sign-up" as any)}
        />
        <AppButton
          title="I already have an account"
          variant="ghost"
          size="lg"
          fullWidth
          onPress={() => router.push("/(auth)/sign-in" as any)}
        />
      </View>
    </View>
  );
}

