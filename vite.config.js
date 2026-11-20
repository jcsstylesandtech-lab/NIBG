import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" keeps every asset path relative, so the build runs from any
// folder or static host (and inside the Claude preview).
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
