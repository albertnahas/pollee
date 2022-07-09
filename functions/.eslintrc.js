module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 9,
  },
  extends: ["eslint:recommended"],
  rules: {
    quotes: ["error", "double"],
  },
}
