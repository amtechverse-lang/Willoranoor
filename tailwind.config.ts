import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        beige: {
          50: "#fdfaf6",
          100: "#f9f4ea",
          200: "#f0e6d3",
          300: "#e8dfd3",
          400: "#ddd0bc",
          500: "#cfc0a8",
          DEFAULT: "#f5f0e8",
          dark: "#e8dfd3",
        },
        charcoal: {
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#bdbdbd",
          300: "#9e9e9e",
          400: "#757575",
          500: "#616161",
          600: "#4a4a4a",
          700: "#3a3a3a",
          800: "#333333",
          900: "#2c2c2c",
          DEFAULT: "#2c2c2c",
        },
        gold: {
          400: "#d4bc7e",
          500: "#c9a96e",
          600: "#b8914d",
          DEFAULT: "#c9a962",
          light: "#d4bc7e",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        elegant:
          "0 4px 24px -4px rgb(44 44 44 / 0.08), 0 2px 8px -2px rgb(44 44 44 / 0.04)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
