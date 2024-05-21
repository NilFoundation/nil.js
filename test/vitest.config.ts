import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    hookTimeout: 60_000,
    testTimeout: 60_000,
    globals: true,
  },
});

// start testing with local node
// we will have something public in the future.
// or we can mock api in the future.
