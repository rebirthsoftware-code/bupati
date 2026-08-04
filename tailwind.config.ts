import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fffdf9",
          100: "#fff8ee",
          200: "#fdeed8",
          300: "#f8e0bf",
        },
        mint: {
          50: "#effcf7",
          100: "#d6f7ec",
          200: "#aeeeda",
          300: "#77dfc3",
          400: "#41c8a6",
          500: "#20ad8d",
          600: "#128b73",
          700: "#106f5d",
          800: "#11584b",
          900: "#0f4941",
        },
        coral: {
          50: "#fff3f1",
          100: "#ffe4df",
          200: "#ffcdc4",
          300: "#ffab9b",
          400: "#ff7d63",
          500: "#fa5738",
          600: "#e73b1c",
          700: "#c22d13",
          800: "#a02914",
          900: "#842818",
        },
        ink: {
          50: "#f6f6f7",
          400: "#8c8a95",
          600: "#55525f",
          800: "#2f2c38",
          900: "#1d1b24",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        soft: "0 18px 40px -22px rgba(29, 27, 36, 0.28)",
        lift: "0 28px 60px -28px rgba(29, 27, 36, 0.35)",
        glow: "0 0 0 6px rgba(65, 200, 166, 0.16)",
      },
      keyframes: {
        "paw-float": {
          "0%, 100%": { transform: "translateY(0) rotate(var(--paw-rot, 0deg))" },
          "50%": { transform: "translateY(-14px) rotate(var(--paw-rot, 0deg))" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "paw-float": "paw-float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "pop-in": "pop-in 0.35s ease-out both",
        wiggle: "wiggle 1.2s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
