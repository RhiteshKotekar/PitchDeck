import React from "react";
import {
  Pressable,
  ActivityIndicator,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { AppText } from "./AppText";
import { useColors } from "@/theme";

interface AppButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function AppButton({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  icon,
  iconPosition = "left",
  fullWidth = false,
  style,
  ...props
}: AppButtonProps) {
  const colors = useColors();

  const sizeStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    sm: {
      container: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
      text: { fontSize: 13 },
    },
    md: {
      container: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
      text: { fontSize: 15 },
    },
    lg: {
      container: { paddingHorizontal: 32, paddingVertical: 18, borderRadius: 16 },
      text: { fontSize: 16 },
    },
  };

  const variantStyles: Record<
    string,
    { container: ViewStyle; text: TextStyle; pressedBg: string }
  > = {
    primary: {
      container: { backgroundColor: colors.primary },
      text: { color: "#FFFFFF", fontFamily: "Inter-SemiBold" },
      pressedBg: colors.primaryDark,
    },
    secondary: {
      container: { backgroundColor: colors.secondary },
      text: { color: "#FFFFFF", fontFamily: "Inter-SemiBold" },
      pressedBg: "#637859",
    },
    outline: {
      container: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: colors.border,
      },
      text: { color: colors.text, fontFamily: "Inter-Medium" },
      pressedBg: colors.surface,
    },
    ghost: {
      container: { backgroundColor: "transparent" },
      text: { color: colors.primary, fontFamily: "Inter-Medium" },
      pressedBg: colors.surface,
    },
    destructive: {
      container: { backgroundColor: colors.error },
      text: { color: "#FFFFFF", fontFamily: "Inter-SemiBold" },
      pressedBg: "#8A3D30",
    },
  };

  const vs = variantStyles[variant];
  const ss = sizeStyles[size];

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: disabled ? 0.5 : 1,
        },
        ss.container,
        vs.container,
        pressed && { backgroundColor: vs.pressedBg },
        fullWidth && { width: "100%" as unknown as number },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? colors.primary : "#FFF"}
        />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <AppText
            style={[ss.text, vs.text]}
            color="inherit"
          >
            {title}
          </AppText>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </Pressable>
  );
}

