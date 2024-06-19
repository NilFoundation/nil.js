import type { UserConfig } from "@commitlint/types";

const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [0, "always", 100],
    "footer-max-line-length": [0, "always", 100],
    "footer-leading-blank": [0, "always"],
    "references-empty": [2, "never"],
    "type-empty": [0, "never"],
    "subject-empty": [0, "never"],
  },
  ignores: [(message) => message.includes("version packages")],
  defaultIgnores: false,
} satisfies UserConfig;

// biome-ignore lint/style/noDefaultExport: <explanation>
export default config;
