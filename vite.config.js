import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url"; // Add this import
import { dirname } from "path"; // Add this import

const __filename = fileURLToPath(import.meta.url); // Define __filename
const __dirname = dirname(__filename); // Define __dirname

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
