/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--color-primary) / <alpha-value>)",
          dark: "hsl(var(--color-primary-dark) / <alpha-value>)",
        },
        secondary: "hsl(var(--color-secondary) / <alpha-value>)",
        tertiary: "hsl(var(--color-tertiary) / <alpha-value>)",
        background: "hsl(var(--color-background) / <alpha-value>)",
        surface: {
          DEFAULT: "hsl(var(--color-surface) / <alpha-value>)",
          elevated: "hsl(var(--color-surface-elevated) / <alpha-value>)",
        },
        foreground: "hsl(var(--color-text) / <alpha-value>)",
        muted: "hsl(var(--color-text-secondary) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
        error: "hsl(var(--color-error) / <alpha-value>)",
      },
      fontFamily: {
        manrope: ["Manrope"],
        "manrope-bold": ["Manrope-Bold"],
        "manrope-semibold": ["Manrope-SemiBold"],
        "manrope-medium": ["Manrope-Medium"],
        inter: ["Inter"],
        "inter-medium": ["Inter-Medium"],
        "inter-semibold": ["Inter-SemiBold"],
        "inter-bold": ["Inter-Bold"],
      },
      borderRadius: {
        card: "16px",
        "card-lg": "20px",
      },
      spacing: {
        "safe-bottom": "34px",
      },
    },
  },
  plugins: [],
};
