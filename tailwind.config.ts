import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        calculator: {
          bg: "hsl(220, 20%, 10%)",
          glass: "hsla(220, 20%, 15%, 0.7)",
          display: "hsl(220, 25%, 8%)",
          number: "hsl(220, 15%, 25%)",
          operation: "hsl(30, 100%, 40%)",
          equals: "hsl(145, 65%, 42%)",
          clear: "hsl(0, 75%, 60%)",
          text: "hsl(0, 0%, 95%)",
          textMuted: "hsl(0, 0%, 65%)",
        },
      },
      keyframes: {
        "pulse-result": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        "shake-error": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-8px)" },
          "40%": { transform: "translateX(8px)" },
          "60%": { transform: "translateX(-6px)" },
          "80%": { transform: "translateX(6px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "pulse-result": "pulse-result 0.3s ease-in-out",
        "shake-error": "shake-error 0.4s ease-in-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
      ringWidth: {
        "3": "3px",
      },
      ringColor: {
        focus: "hsl(145, 65%, 55%)",
      },
      minHeight: {
        "touch": "44px",
      },
      minWidth: {
        "touch": "44px",
      },
    },
  },
  plugins: [],
};

export default config;
