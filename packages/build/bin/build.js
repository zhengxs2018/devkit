#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const { Command } = require('commander')
const isNil = require('lodash/isNil')

const pkg = require('../package.json')
const { run, runInLerna } = require('../dist/build')

const program = new Command('build')

program
  .usage('[packages]')
  .option('-c, --config <file>', '配置文件名称')
  .option('-l, --lerna', '是否 lerna 工程，默认根据 lerna.json 判断')
  .option('-e, --exclude [excludes...]', '需要排除的包名称列表，仅 lerna 工程')
  .option('-s, --skip-private', '跳过私有模块，仅 lerna 工程')
  .version(pkg.version, '--version, -v', '显示版本')
  .action((opts, { args }) => {
    const lerna = isNil(opts.lerna) ? opts.lerna : isLernaProject()
    const config = typeof opts['config'] === 'string' ? opts['config'] : null

    if (lerna) {
      return runInLerna({
        cwd: process.cwd(),
        configFilePath: config,
        include: args,
        exclude: opts['exclude'],
        skipPrivate: opts['skipPrivate'],
      })
    }

    return run({
      cwd: process.cwd(),
      configFilePath: config,
    })
  })

function isLernaProject() {
  return fs.existsSync(path.join(process.cwd(), 'lerna.json'))
}

if (require.main === module) {
  program.parse(process.argv)
} else {
  module.exports = program
}
