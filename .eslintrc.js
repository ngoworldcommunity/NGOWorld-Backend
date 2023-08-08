module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "jsx-quotes": ["error", "prefer-double"],
    semi: ["error", "always"],
    "no-multiple-empty-lines": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
