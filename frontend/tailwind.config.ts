import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ink: "#0a0a0a",
        paper: "#fafaf8",
        accent: "#2563EB",
        "accent-dark": "#1d4ed8",
        "accent-light": "#dbeafe",
        rule: "#e4e4e0",
      },
      boxShadow: {
        brutal: "4px 4px 0px #0a0a0a",
        "brutal-lg": "6px 6px 0px #0a0a0a",
        "brutal-xl": "8px 8px 0px #0a0a0a",
        "brutal-blue": "6px 6px 0px #2563EB",
      },
      letterSpacing: {
        swiss: "0.08em",
        wide2: "0.15em",
      },
    },
  },
  plugins: [],
};

export default config;
