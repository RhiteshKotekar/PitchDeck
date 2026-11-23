import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";
import { useColors } from "@/theme";

interface RatingBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function RatingBadge({ score, size = "md" }: RatingBadgeProps) {
  const colors = useColors();

  const getScoreColor = () => {
    if (score >= 80) return colors.success ?? "#5A7A52";
    if (score >= 60) return colors.tertiary;
    if (score >= 40) return colors.primary;
    return colors.error;
  };

  const sizeMap = {
    sm: { container: 28, font: 11, label: 8 },
    md: { container: 36, font: 14, label: 10 },
    lg: { container: 48, font: 18, label: 12 },
  };

  const s = sizeMap[size];

  return (
    <View
      style={{
        width: s.container,
        height: s.container,
        borderRadius: s.container / 2,
        backgroundColor: getScoreColor() + "18",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppText
        variant="label"
        color="inherit"
        style={{
          color: getScoreColor(),
          fontSize: s.font,
          fontFamily: "Manrope-Bold",
        }}
      >
        {score}
      </AppText>
    </View>
  );
}

