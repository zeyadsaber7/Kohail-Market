import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration — kept minimal and standard so the project
// can be deployed as-is to Vercel / Netlify / any static host.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
