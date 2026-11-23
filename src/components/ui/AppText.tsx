import React from "react";
import { Text, type TextProps } from "react-native";
import { useTheme } from "@/theme";

interface AppTextProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "subtitle" | "body" | "caption" | "label";
  color?: "primary" | "secondary" | "muted" | "error" | "inherit";
  weight?: "regular" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
}

export function AppText({
  variant = "body",
  color = "primary",
  weight,
  align,
  style,
  children,
  ...props
}: AppTextProps) {
  const { colors } = useTheme();

  const variantStyles = {
    h1: { fontSize: 28, lineHeight: 34, fontFamily: "Manrope-Bold" },
    h2: { fontSize: 22, lineHeight: 28, fontFamily: "Manrope-Bold" },
    h3: { fontSize: 18, lineHeight: 24, fontFamily: "Manrope-SemiBold" },
    subtitle: { fontSize: 16, lineHeight: 22, fontFamily: "Manrope-Medium" },
    body: { fontSize: 15, lineHeight: 22, fontFamily: "Inter" },
    caption: { fontSize: 13, lineHeight: 18, fontFamily: "Inter" },
    label: { fontSize: 12, lineHeight: 16, fontFamily: "Inter-Medium" },
  };

  const colorMap = {
    primary: colors.text,
    secondary: colors.textSecondary,
    muted: colors.textSecondary,
    error: colors.error,
    inherit: undefined,
  };

  const weightMap = {
    regular: undefined,
    medium: "Inter-Medium" as const,
    semibold: "Inter-SemiBold" as const,
    bold: "Inter-Bold" as const,
  };

  return (
    <Text
      style={[
        variantStyles[variant],
        colorMap[color] !== undefined && { color: colorMap[color] },
        weight && { fontFamily: weightMap[weight] },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

