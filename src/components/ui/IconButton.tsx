import React from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/theme";

interface IconButtonProps extends Omit<PressableProps, "style"> {
  name: keyof typeof Feather.glyphMap;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function IconButton({ name, size = 22, color, style, ...props }: IconButtonProps) {
  const colors = useColors();

  return (
    <Pressable
      style={({ pressed }) => [
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.6 : 1,
        },
        style,
      ]}
      hitSlop={4}
      {...props}
    >
      <Feather name={name} size={size} color={color ?? colors.text} />
    </Pressable>
  );
}

