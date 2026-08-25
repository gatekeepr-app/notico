/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{tsx,ts,html}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
          light: "#EDE9FE",
        },
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#fafafa",
        },
        border: {
          DEFAULT: "#e5e5ea",
          subtle: "#f0f0f3",
        },
        text: {
          DEFAULT: "#1d1d1f",
          secondary: "#86868b",
          tertiary: "#aeaeb2",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["SF Mono", "Fira Code", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
