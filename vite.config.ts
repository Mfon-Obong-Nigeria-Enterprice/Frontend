import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  server: {
    port: 5173, // Change frontend to use port 5173
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Backend runs on port 3000
        changeOrigin: true,
        secure: false, // Local development doesn't need SSL
        // Don't rewrite - keep /api prefix for local backend
      },
    },
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173, // Update HMR port too
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
