/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        arial: ["Arial", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
        roboto: ["roboto", "sans-serif"],
      },
      colors: {
        bg: {
          accent: "#E2D8FD",
          button: "#602AF3",
          primary: "#B79EFA",
          secondary: "#dfdddd",
          tertiary: "#F5F5F5",
          quaternary: "#faf9f9",
          surface: "#FFFFFF",
        },
        text: {
          primary: "#27262C",
          secondary: "#4F4B58",
          tertiary: "#A09CAB",
          muted: "#7A7A7A",
          surface: "#FFFFFF",
        },
        border: {
          accent: "#B79EFA",
          secondary: "#c1c2c3",
          muted: "#EAE9EC",
        },
        brand: {
          blue: "#00529b",
          purple: "#602AF3",
          indigo: "#5046e5",
        },
        ui: {
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#3b82f6",
        },
        memoHighlight: "#FFDD99",
        inactive: "#8e8e93",
        placeholder: "#9CA3AF",
        plane: "#D1D5DB",
        text: {
          primary: "#27262C",
          secondary: "#4F4B58",
          tertiary: "#A09CAB",
          muted: "#7A7A7A",
          surface: "#FFFFFF",
          placeholder: "#94a3b8",
          dark: "#333",
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
