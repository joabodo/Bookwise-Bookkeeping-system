import dotenv from "dotenv";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      api: path.resolve(__dirname, "./src/api"),
      assets: path.resolve(__dirname, "./src/assets/"),
      components: path.resolve(__dirname, "./src/components/"),
      constants: path.resolve(__dirname, "./src/constants/"),
      contexts: path.resolve(__dirname, "./src/contexts/"),
      hooks: path.resolve(__dirname, "./src/hooks/"),
      layouts: path.resolve(__dirname, "./src/layouts/"),
      services: path.resolve(__dirname, "./src/services/"),
      utils: path.resolve(__dirname, "./src/utils/"),
      views: path.resolve(__dirname, "./src/views/"),
      src: path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": process.env,
  },
});
