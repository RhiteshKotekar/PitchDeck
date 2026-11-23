import React from "react";
import { View, type ViewStyle } from "react-native";
import { useColors } from "@/theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const colors = useColors();

  return (
    <View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity: 0.5,
        },
        style,
      ]}
    />
  );
}

export function IdeaCardSkeleton() {
  const colors = useColors();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        gap: 10,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Skeleton width={32} height={32} borderRadius={16} />
        <View style={{ flex: 1, gap: 4 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="30%" height={10} />
        </View>
        <Skeleton width={36} height={36} borderRadius={18} />
      </View>
      <Skeleton width="80%" height={16} />
      <Skeleton width="100%" height={12} />
      <Skeleton width="40%" height={12} />
    </View>
  );
}

