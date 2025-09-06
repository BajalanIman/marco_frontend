// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    // Serve tiles as static files
    fs: {
      strict: false, // Allow serving files outside root
      allow: ["."],
    },
    proxy: {
      "/api": {
        target: "http://localhost:8800", // your real backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
