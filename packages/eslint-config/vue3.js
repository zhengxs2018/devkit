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
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: true,
    },
    extraFileExtensions: ['.vue'],
    sourceType: 'module',
  },
  rules: {
    'vue/require-default-prop': 'off',
    // 'vue/return-in-computed-property': 'off',
    // template 中使用的组件名称必须用中横线的风格
    // god: <md-button></md-button>
    // bad: <MdButton></MdButton>
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: false,
        ignores: [],
      },
    ],
    // 组件定义的 name 必须和文件名称一致
    'vue/match-component-file-name': [
      'error',
      {
        extensions: ['js', 'jsx', 'ts', 'tsx', 'vue'],
        shouldMatchCase: false,
      },
    ],
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
    {
      files: ['*.vue'],
      rules: {
        // disable for setup script
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    {
      files: ['vite.config.ts', 'vite.config.*.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
