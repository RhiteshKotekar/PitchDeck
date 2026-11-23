import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";
import { useColors } from "@/theme";

interface EmptyStateProps {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "inbox",
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const colors = useColors();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.surface,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <Feather name={icon} size={28} color={colors.textSecondary} />
      </View>
      <AppText variant="h3" align="center">
        {title}
      </AppText>
      <AppText variant="body" color="secondary" align="center">
        {message}
      </AppText>
      {actionLabel && onAction && (
        <AppButton
          title={actionLabel}
          variant="primary"
          size="sm"
          onPress={onAction}
          style={{ marginTop: 8 }}
        />
      )}
    </View>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) {
  const colors = useColors();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.error + "15",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <Feather name="alert-circle" size={28} color={colors.error} />
      </View>
      <AppText variant="h3" align="center">
        Oops!
      </AppText>
      <AppText variant="body" color="secondary" align="center">
        {message}
      </AppText>
      {onRetry && (
        <AppButton
          title="Try Again"
          variant="outline"
          size="sm"
          onPress={onRetry}
          style={{ marginTop: 8 }}
        />
      )}
    </View>
  );
}

