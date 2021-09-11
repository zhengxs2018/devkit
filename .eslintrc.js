/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@zhengxs-devkit/eslint-config'],
  overrides: [
    {
      files: ['scripts/*.ts', 'examples/', '*.js'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-extraneous-dependencies': 'off',
        'tsdoc/syntax': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
