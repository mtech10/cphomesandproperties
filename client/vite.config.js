import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Forwards /api requests to the Express server during development
      // so the frontend can call relative paths like /api/realtors/register
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
