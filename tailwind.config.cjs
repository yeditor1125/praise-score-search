/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        warm: {
          50: "#fffdfa",
          100: "#fff8ef",
          200: "#ffeccd",
          300: "#f8dbab",
          400: "#f1c986",
          500: "#e6b45e",
          600: "#ca9444",
          700: "#9e6f35",
          800: "#6c4a26"
        }
      },
      boxShadow: {
        glow: "0 10px 30px rgba(202, 148, 68, 0.16)"
      }
    }
  },
  plugins: []
};
