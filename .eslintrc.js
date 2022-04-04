module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // strict: 'off',
    // 'func-names': 'off',
    // 'prefer-destructuring': 'off',
  },
  globals: {
    moment: "readonly",
    $: "readonly",
  }
};
