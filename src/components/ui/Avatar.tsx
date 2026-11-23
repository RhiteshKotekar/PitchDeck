import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";
import { useColors } from "@/theme";

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
}

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const colors = useColors();
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // We're not using expo-image here to keep it simple; use a colored circle with initials
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppText
        variant="label"
        color="inherit"
        style={{
          color: "#FFFFFF",
          fontSize: size * 0.36,
          fontFamily: "Manrope-Bold",
        }}
      >
        {initials}
      </AppText>
    </View>
  );
}

