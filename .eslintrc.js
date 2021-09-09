/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@zhengxs-devkit/eslint-config'],
  overrides: [
    {
      files: ['scripts/*.ts', '*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'tsdoc/syntax': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
