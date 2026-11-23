// Design tokens as plain values for use outside NativeWind
export const Colors = {
  light: {
    primary: "#C65D32",
    primaryDark: "#A94B2A",
    secondary: "#74816A",
    tertiary: "#E6A15C",
    background: "#F5EFE5",
    surface: "#FBF8F2",
    surfaceElevated: "#FFFDF9",
    text: "#292720",
    textSecondary: "#81786D",
    border: "#E6E1D7",
    error: "#A94B3C",
    success: "#5A7A52",
    // Leaderboard
    gold: "#D4A34A",
    silver: "#A8A8A8",
    bronze: "#B87333",
  },
  dark: {
    primary: "#D4784E",
    primaryDark: "#C65D32",
    secondary: "#74816A",
    tertiary: "#E6A15C",
    background: "#211F1B",
    surface: "#2B2823",
    surfaceElevated: "#343029",
    text: "#F5EFE5",
    textSecondary: "#B9AEA0",
    border: "#494238",
    error: "#CF6B5E",
    success: "#6B8F62",
    gold: "#D4A34A",
    silver: "#A8A8A8",
    bronze: "#B87333",
  },
} as const;

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const Categories = [
  "All",
  "Technology",
  "Health",
  "Education",
  "Finance",
  "Sustainability",
  "Social",
  "Commerce",
  "Entertainment",
  "Productivity",
] as const;

export type Category = (typeof Categories)[number];

