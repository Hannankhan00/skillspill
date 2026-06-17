import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Prisma generated files
    "app/generated/**",
    "prisma/generated/**",
    // Python virtual environment — not JS/TS source
    "matching-service/venv/**",
    // CJS Node scripts — intentionally use require()
    "server.js",
    "test-mail.js",
    "fix_conflicts.js",
    // Prisma seed scripts (run via ts-node, not Next.js)
    "prisma/**",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@next/next/no-img-element": "warn",
      "react-hooks/set-state-in-effect": "warn",
      // Allow require() in files that legitimately use CommonJS
      "@typescript-eslint/no-require-imports": "warn",
    },
  },
]);

export default eslintConfig;
