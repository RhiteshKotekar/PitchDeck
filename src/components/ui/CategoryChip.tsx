import React from "react";
import { Pressable } from "react-native";
import { AppText } from "./AppText";
import { useColors } from "@/theme";

interface CategoryChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ label, selected = false, onPress }: CategoryChipProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: selected ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <AppText
        variant="caption"
        color="inherit"
        weight="medium"
        style={{ color: selected ? "#FFFFFF" : colors.textSecondary }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

