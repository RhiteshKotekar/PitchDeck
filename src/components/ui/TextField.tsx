import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { AppText } from "./AppText";
import { useColors } from "@/theme";
import { Feather } from "@expo/vector-icons";

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: keyof typeof Feather.glyphMap;
  containerStyle?: ViewStyle;
  maxLength?: number;
  showCount?: boolean;
}

export function TextField({
  label,
  error,
  hint,
  icon,
  containerStyle,
  maxLength,
  showCount,
  value,
  onFocus,
  onBlur,
  style,
  ...props
}: TextFieldProps) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
      ? colors.primary
      : colors.border;

  return (
    <View style={[{ gap: 6 }, containerStyle]}>
      {label && (
        <AppText variant="label" color="secondary" style={{ marginLeft: 4 }}>
          {label}
        </AppText>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderColor,
          borderRadius: 14,
          paddingHorizontal: 16,
          gap: 10,
        }}
      >
        {icon && (
          <Feather name={icon} size={18} color={colors.textSecondary} />
        )}
        <TextInput
          value={value}
          placeholderTextColor={colors.textSecondary}
          style={[
            {
              flex: 1,
              fontFamily: "Inter",
              fontSize: 15,
              color: colors.text,
              paddingVertical: 14,
            },
            style,
          ]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          maxLength={maxLength}
          {...props}
        />
        {showCount && maxLength && (
          <AppText variant="caption" color="muted">
            {(value?.length ?? 0)}/{maxLength}
          </AppText>
        )}
      </View>
      {error && (
        <AppText variant="caption" color="error" style={{ marginLeft: 4 }}>
          {error}
        </AppText>
      )}
      {hint && !error && (
        <AppText variant="caption" color="muted" style={{ marginLeft: 4 }}>
          {hint}
        </AppText>
      )}
    </View>
  );
}

interface PasswordFieldProps extends Omit<TextFieldProps, "icon"> {
  label?: string;
}

export function PasswordField({ label = "Password", ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const colors = useColors();

  return (
    <View style={{ gap: 6 }}>
      {label && (
        <AppText variant="label" color="secondary" style={{ marginLeft: 4 }}>
          {label}
        </AppText>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderColor: props.error ? colors.error : colors.border,
          borderRadius: 14,
          paddingHorizontal: 16,
          gap: 10,
        }}
      >
        <Feather name="lock" size={18} color={colors.textSecondary} />
        <TextInput
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!visible}
          style={{
            flex: 1,
            fontFamily: "Inter",
            fontSize: 15,
            color: colors.text,
            paddingVertical: 14,
          }}
          {...props}
        />
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
          <Feather
            name={visible ? "eye-off" : "eye"}
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>
      {props.error && (
        <AppText variant="caption" color="error" style={{ marginLeft: 4 }}>
          {props.error}
        </AppText>
      )}
    </View>
  );
}

