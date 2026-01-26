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
  ]),
  // Custom rules for bundle hygiene
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Restrict direct imports of heavy libraries
      // GSAP should only be dynamically imported in animation components
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "gsap",
              message:
                "Direct GSAP imports are not allowed. Use dynamic imports: await import('gsap'). See components/gsap/animations/ for patterns.",
            },
            {
              name: "gsap/ScrollTrigger",
              message:
                "Direct ScrollTrigger imports are not allowed. Use dynamic imports: await import('gsap/ScrollTrigger').",
            },
            {
              name: "@gsap/react",
              message:
                "Direct @gsap/react imports are not allowed. Use animation wrappers from components/gsap/ instead.",
            },
            {
              name: "d3",
              message:
                "Direct d3 imports are not allowed. Use selective imports like: import { select } from 'd3-selection'. This reduces bundle size from ~500KB to ~20-50KB.",
            },
          ],
          patterns: [
            {
              group: ["gsap/*", "!gsap/ScrollTrigger"],
              message:
                "Direct GSAP plugin imports are not allowed. Use dynamic imports.",
            },
          ],
        },
      ],
    },
  },
  // Allow dynamic imports in GSAP animation components
  {
    files: ["components/gsap/animations/**/*.{ts,tsx}"],
    rules: {
      // These files are allowed to dynamically import GSAP
      "no-restricted-imports": "off",
    },
  },
  // Allow selective D3 imports in D3 chart components
  {
    files: ["components/d3/**/*.{ts,tsx}"],
    rules: {
      // D3 charts use selective imports which is fine
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "d3",
              message:
                "Direct d3 imports are not allowed. Use selective imports like: import { select } from 'd3-selection'.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
