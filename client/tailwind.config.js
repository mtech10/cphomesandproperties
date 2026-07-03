module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: {
            DEFAULT: "#065f46",
            700: "#064e3b",
            600: "#047857",
          },
          gold: {
            DEFAULT: "#C59A37",
            600: "#B2872F",
          },
        },
      },
      boxShadow: {
        soft: "0 25px 60px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
