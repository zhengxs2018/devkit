// 文件参考：https://github.com/vuejs/vue-next/blob/3ff94faca1816316c61d557fe8cc79277eaa8db6/scripts/build.js#L120
import path from 'path'
import { existsSync } from 'fs'

import chalk from 'chalk'
import minimist, { ParsedArgs } from 'minimist'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import {
  LernaPackage,
  getLernaPackages,
  filterLernaPackages,
} from '@zhengxs-devkit/lerna'

const ROOT_PATH = path.dirname(__dirname)

async function apiExtractor(pkg: LernaPackage) {
  const extractorConfigPath = path.resolve(pkg.location, `api-extractor.json`)
  if (!existsSync(extractorConfigPath)) return

  console.log()
  console.log(
    chalk.yellow`{bold API Extractor for ${path.relative(
      ROOT_PATH,
      pkg.location
    )}...}`
  )

  const extractorConfig =
    ExtractorConfig.loadFileAndPrepare(extractorConfigPath)

  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  })

  if (extractorResult.succeeded) {
    console.log(chalk.green`{bold API Extractor completed successfully.}`)
  } else {
    console.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`
    )
    process.exitCode = 1
  }
}

type CommandOptions = {
  e?: string | string[]
  exclude?: string | string[]
}

async function run(argv: CommandOptions & ParsedArgs) {
  const packages = await filterLernaPackages(
    getLernaPackages(ROOT_PATH),
    argv._,
    argv.e || argv.exclude
  )

  return Promise.allSettled(packages.map(apiExtractor))
}

run(minimist(process.argv.slice(2)))
