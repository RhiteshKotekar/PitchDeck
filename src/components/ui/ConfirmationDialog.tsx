import React from "react";
import { View, Pressable, Modal } from "react-native";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";
import { useColors } from "@/theme";

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmationDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  onConfirm,
  onCancel,
  loading,
}: ConfirmationDialogProps) {
  const colors = useColors();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        onPress={onCancel}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <Pressable
          style={{
            width: "100%",
            backgroundColor: colors.surfaceElevated,
            borderRadius: 20,
            padding: 24,
            gap: 12,
          }}
        >
          <AppText variant="h3">{title}</AppText>
          <AppText variant="body" color="secondary">
            {message}
          </AppText>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <AppButton
                title={cancelLabel}
                variant="outline"
                onPress={onCancel}
                fullWidth
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppButton
                title={confirmLabel}
                variant={variant === "destructive" ? "destructive" : "primary"}
                onPress={onConfirm}
                loading={loading}
                fullWidth
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

