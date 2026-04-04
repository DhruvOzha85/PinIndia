/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: "#0A0A0F",
        paper: "#F5F0E8",
        saffron: "#FF6B35",
        teal: "#00A896",
        gold: "#F0A500",
        muted: "#6B7280",
      },
    },
  },
  plugins: [],
};
