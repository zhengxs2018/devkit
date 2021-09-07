/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  globals: {
    document: 'readonly',
    navigator: 'readonly',
    window: 'readonly',
  },
  plugins: ['@typescript-eslint', 'import', 'tsdoc'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  rules: {
    'tsdoc/syntax': 'warn',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
        optionalDependencies: false,
      },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'tsdoc/syntax': 'off',
      },
    },
    {
      files: ['test', '__test__', '*.{spec,test}.ts'],
      env: {
        jest: true,
      },
      rules: {
        'tsdoc/syntax': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
