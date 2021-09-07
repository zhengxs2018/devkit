/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@zhengxs-devkit/eslint-config'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'tsdoc/syntax': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
