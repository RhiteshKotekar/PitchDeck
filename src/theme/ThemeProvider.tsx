import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, type ThemeMode, type ResolvedTheme } from "./tokens";

const THEME_KEY = "@pitchboard_theme";

export type ColorPalette = {
  primary: string;
  primaryDark: string;
  secondary: string;
  tertiary: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  gold: string;
  silver: string;
  bronze: string;
};

interface ThemeContextType {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  colors: ColorPalette;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  resolved: "light",
  colors: Colors.light,
  setMode: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setModeState(saved);
      }
      setLoaded(true);
    });
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(THEME_KEY, newMode);
  }, []);

  const resolved: ResolvedTheme =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

  const colors = Colors[resolved];
  const isDark = resolved === "dark";

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ mode, resolved, colors, setMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useColors() {
  return useContext(ThemeContext).colors;
}

