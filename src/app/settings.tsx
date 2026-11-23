import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import {
  AppText,
  AppButton,
  Avatar,
  IconButton,
  ConfirmationDialog,
} from "@/components/ui";
import { useTheme, useColors } from "@/theme";
import type { ThemeMode } from "@/theme";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { mode, setMode } = useTheme();
  const { signOut } = useAuth();
  const { user } = useUser();
  const [showSignOut, setShowSignOut] = React.useState(false);

  const themeOptions: { key: ThemeMode; label: string; icon: keyof typeof Feather.glyphMap }[] = [
    { key: "light", label: "Light", icon: "sun" },
    { key: "dark", label: "Dark", icon: "moon" },
    { key: "system", label: "System", icon: "smartphone" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // Handle silently
    }
    setShowSignOut(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <IconButton name="arrow-left" onPress={() => router.back()} />
          <AppText variant="h2">Settings</AppText>
        </View>

        {/* Profile section */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Avatar name={user?.firstName ?? "U"} size={48} />
          <View style={{ flex: 1 }}>
            <AppText variant="subtitle" weight="semibold">
              {user?.firstName} {user?.lastName}
            </AppText>
            <AppText variant="caption" color="secondary">
              {user?.primaryEmailAddress?.emailAddress}
            </AppText>
          </View>
        </View>

        {/* Theme */}
        <AppText variant="label" color="secondary" style={{ marginLeft: 4, marginBottom: 10 }}>
          APPEARANCE
        </AppText>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 24,
          }}
        >
          {themeOptions.map((opt, i) => (
            <Pressable
              key={opt.key}
              onPress={() => setMode(opt.key)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderBottomWidth: i < themeOptions.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <Feather name={opt.icon} size={20} color={colors.text} />
              <AppText variant="body" weight="medium" style={{ flex: 1 }}>
                {opt.label}
              </AppText>
              {mode === opt.key && (
                <Feather name="check" size={20} color={colors.primary} />
              )}
            </Pressable>
          ))}
        </View>

        {/* About */}
        <AppText variant="label" color="secondary" style={{ marginLeft: 4, marginBottom: 10 }}>
          ABOUT
        </AppText>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            <Feather name="info" size={20} color={colors.text} />
            <AppText variant="body" weight="medium" style={{ flex: 1 }}>
              Version
            </AppText>
            <AppText variant="body" color="secondary">1.0.0</AppText>
          </View>
        </View>

        {/* Sign out */}
        <AppButton
          title="Sign Out"
          variant="outline"
          size="lg"
          fullWidth
          onPress={() => setShowSignOut(true)}
          icon={<Feather name="log-out" size={18} color={colors.text} />}
        />
      </ScrollView>

      <ConfirmationDialog
        visible={showSignOut}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
        variant="destructive"
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOut(false)}
      />
    </View>
  );
}

