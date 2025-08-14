import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  server: {
    port: 3000,
    open: true,
    proxy:{
      "/api":{
        target:"https://mfon-obong-enterprise.onrender.com/api",
        changeOrigin:true,
        secure:true,
      }}
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
