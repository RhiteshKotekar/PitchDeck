import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";
import { useColors } from "@/theme";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  const colors = useColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        gap: 4,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {icon}
      <AppText variant="h2" style={{ fontFamily: "Manrope-Bold" }}>
        {value}
      </AppText>
      <AppText variant="caption" color="secondary">
        {label}
      </AppText>
    </View>
  );
}

