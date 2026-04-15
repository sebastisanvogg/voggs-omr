import type { Config } from "tailwindcss";
import { brandTokens } from "./brand/brand-tokens";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "./brand/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: { ...brandTokens.colors },
      borderRadius: { ...brandTokens.radii },
      boxShadow: { ...brandTokens.shadows },
      fontFamily: {
        sans: [...brandTokens.fonts.sans],
        mono: [...brandTokens.fonts.mono],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.04)", opacity: "0.85" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "pulse-ring": "pulse-ring 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
