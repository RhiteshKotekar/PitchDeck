import React, { useEffect, useState, createContext, useContext, useCallback } from "react";
import { Animated, View } from "react-native";
import { AppText } from "./AppText";
import { useColors } from "@/theme";
import { Feather } from "@expo/vector-icons";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  show: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(-40));

  const show = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToast({ id, type, message });
  }, []);

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -40, duration: 200, useNativeDriver: true }),
        ]).start(() => setToast(null));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast, opacity, translateY]);

  const colors = useColors();

  const iconMap: Record<ToastType, keyof typeof Feather.glyphMap> = {
    success: "check-circle",
    error: "alert-circle",
    info: "info",
  };

  const colorMap: Record<ToastType, string> = {
    success: colors.success ?? "#5A7A52",
    error: colors.error,
    info: colors.primary,
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View
          style={{
            position: "absolute",
            top: 60,
            left: 20,
            right: 20,
            opacity,
            transform: [{ translateY }],
            zIndex: 9999,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: colors.surfaceElevated,
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Feather name={iconMap[toast.type]} size={20} color={colorMap[toast.type]} />
            <AppText variant="body" weight="medium" style={{ flex: 1 }}>
              {toast.message}
            </AppText>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

