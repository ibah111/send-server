module.exports = {
  env: {
    node: true,
    es6: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    "prettier/prettier": "error",
    "no-undef": "off",
    "no-empty": "off",
  },
};
