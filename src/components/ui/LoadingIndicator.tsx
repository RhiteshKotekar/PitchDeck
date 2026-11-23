import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useColors } from "@/theme";

interface LoadingIndicatorProps {
  size?: "small" | "large";
  fullScreen?: boolean;
}

export function LoadingIndicator({ size = "large", fullScreen = false }: LoadingIndicatorProps) {
  const colors = useColors();

  if (fullScreen) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size={size} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ padding: 24, alignItems: "center" }}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}

