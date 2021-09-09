// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const path = require('path')
const { findLernaPackages } = require('@zhengxs-devkit/lerna')

const packages = findLernaPackages(__dirname, {
  exclude: ['@zhengxs-devkit/eslint-config'],
})

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  rootDir: __dirname,
  projects: packages.map(pkg => {
    return {
      displayName: pkg.name,
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: [path.join(pkg.location, '**/*.(spec|test).ts')],
    }
  }),
}
