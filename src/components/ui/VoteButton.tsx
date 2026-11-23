import React from "react";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { useColors } from "@/theme";

interface VoteButtonProps {
  count: number;
  hasVoted: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function VoteButton({ count, hasVoted, onPress, disabled }: VoteButtonProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: hasVoted ? colors.primary + "15" : colors.surface,
        borderWidth: 1,
        borderColor: hasVoted ? colors.primary : colors.border,
        opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
      })}
    >
      <Feather
        name={hasVoted ? "arrow-up" : "arrow-up"}
        size={16}
        color={hasVoted ? colors.primary : colors.textSecondary}
      />
      <AppText
        variant="caption"
        color="inherit"
        weight="semibold"
        style={{ color: hasVoted ? colors.primary : colors.textSecondary }}
      >
        {count}
      </AppText>
    </Pressable>
  );
}

