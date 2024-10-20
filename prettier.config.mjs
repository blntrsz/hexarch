/** @type {import("prettier").Config} */
const config = {
  plugins: ["@ianvs/prettier-plugin-sort-imports"],

  importOrder: [
    "<THIRD_PARTY_MODULES>", // Imports not matched by other special words or groups.
    "<BUILTIN_MODULES>", // Node.js built-in modules
    "",
    "^#common/(.*)$",
    "^#infrastructure(.*)$",
    "^#domain/(.*)$",
    "^#use-cases/(.*)$",
    "^#(.*)$",
    "",
    "^[.]", // relative imports
  ],
};

export default config;
