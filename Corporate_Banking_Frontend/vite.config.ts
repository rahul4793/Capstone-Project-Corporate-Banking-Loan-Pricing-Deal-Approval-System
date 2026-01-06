import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.ts",

    // ⭐ COVERAGE CONFIGURATION
    coverage: {
      provider: "v8",                 // Uses V8 engine for coverage
      reporter: ["text", "html", "lcov"], // Console + HTML + lcov
      reportsDirectory: "coverage",   // Output folder
      exclude: [
        "node_modules/",
        "src/main.tsx",
        "src/App.tsx",
        "**/*.d.ts"
      ]
    }
  }
});
