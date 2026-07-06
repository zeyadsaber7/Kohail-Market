/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette — single source of truth for the site's colors.
        // Change here to re-theme the whole store.
        brand: {
          DEFAULT: "#0e2a4d", // calm dark blue (primary)
          dark: "#0a1f38",
          light: "#153a63",
          soft: "#e8eef6",
          50: "#eef3f9",
        },
      },
      fontFamily: {
        sans: ["Cairo", "Tahoma", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,42,77,0.04), 0 2px 8px rgba(14,42,77,0.06)",
        "card-hover": "0 8px 24px rgba(14,42,77,0.12), 0 2px 6px rgba(14,42,77,0.06)",
        soft: "0 4px 20px rgba(14,42,77,0.06)",
        glow: "0 0 0 4px rgba(14,42,77,0.08)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeInScale: {
          "0%": { opacity: 0, transform: "scale(0.96)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        toastIn: {
          "0%": { opacity: 0, transform: "translateY(24px) scale(0.95)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
      },
      animation: {
        fadeIn: "fadeIn .5s ease both",
        fadeInScale: "fadeInScale .35s ease both",
        toastIn: "toastIn .35s cubic-bezier(.34,1.56,.64,1) both",
        shimmer: "shimmer 1.6s infinite linear",
        floatSlow: "floatSlow 4s ease-in-out infinite",
        pulseSoft: "pulseSoft 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.22,1,.36,1)",
      },
    },
  },
  plugins: [],
};
