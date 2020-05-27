module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "@vue/prettier",
  ],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-undef": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-useless-escape": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-prototype-builtins":
      process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-constant-condition":
      process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};
