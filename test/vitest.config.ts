import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    hookTimeout: 20_000,
    testTimeout: 20_000,
    globals: true,
    coverage: {
      reportsDirectory: "./test/coverage",
      provider: "v8",
      reportOnFailure: true,
    },
  },
});
