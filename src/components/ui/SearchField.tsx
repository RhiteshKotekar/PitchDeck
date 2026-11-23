import React from "react";
import { View, TextInput, type TextInputProps, type ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/theme";

interface SearchFieldProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export function SearchField({ containerStyle, style, ...props }: SearchFieldProps) {
  const colors = useColors();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 14,
          paddingHorizontal: 16,
          gap: 10,
          borderWidth: 1,
          borderColor: colors.border,
        },
        containerStyle,
      ]}
    >
      <Feather name="search" size={18} color={colors.textSecondary} />
      <TextInput
        placeholder="Search ideas..."
        placeholderTextColor={colors.textSecondary}
        style={[
          {
            flex: 1,
            fontFamily: "Inter",
            fontSize: 15,
            color: colors.text,
            paddingVertical: 12,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
}

