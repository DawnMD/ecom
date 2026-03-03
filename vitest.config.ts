import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["tests/integration/**/*.integration.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: ["tests/setup.ts"],
    clearMocks: true,
    restoreMocks: true,
  },
});
