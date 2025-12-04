import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { JSDOM } from "jsdom";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/test/**/*.test.jsx"],
    setupFiles: ["./src/test/setup.js"],
  },
  // Configurar jsdom para que esté disponible globalmente
  define: {
    global: "globalThis",
  },
});
