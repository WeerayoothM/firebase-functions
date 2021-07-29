module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    quotes: [
      "error",
      "double",
      {
        allowTemplateLiterals: true,
      },
    ],
    "object-curly-spacing": ["error", "always", { arraysInObjects: true }],
    "quote-props": ["error", "as-needed"],
    indent: ["error", 2],
  },
};
