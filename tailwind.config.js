// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["Verdana", "Geneva", "Tahoma", "sans-serif"],
        custom2: ["Inter", "-apple-system", "Helvetica", "Arial", "sans-serif"],
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        slideIn: "slideIn 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
