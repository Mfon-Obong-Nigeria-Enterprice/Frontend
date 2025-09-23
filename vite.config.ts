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
    proxy: {
      "/api": {
        target: "https://mfon-obong-enterprise.onrender.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 3000,
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'yup', 'zod'],
          'vendor-utils': ['axios', 'date-fns', 'dayjs', 'uuid', 'clsx'],
          'vendor-excel': ['exceljs', 'xlsx', 'papaparse']
        }
      }
    },
    // Increase chunk size warning limit since we're now chunking properly
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging in production
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
  },
  // Enable dependency pre-bundling for faster dev
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'zustand'
    ]
  }
});
