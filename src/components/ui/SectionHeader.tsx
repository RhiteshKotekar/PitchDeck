import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, right }: SectionHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 8,
      }}
    >
      <View style={{ flex: 1 }}>
        <AppText variant="h3">{title}</AppText>
        {subtitle && (
          <AppText variant="caption" color="secondary" style={{ marginTop: 2 }}>
            {subtitle}
          </AppText>
        )}
      </View>
      {right}
    </View>
  );
}

