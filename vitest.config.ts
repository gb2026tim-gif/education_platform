import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    exclude: ["tests/**", "node_modules/**"], // Додай цей рядок обов'язково!
    globals: true,
    environment: "jsdom",
  },
});