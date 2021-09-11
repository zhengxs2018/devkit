import path from 'path'
import del from 'del'

import { findAndFilterLernaPackages } from '@zhengxs-devkit/lerna'

async function run() {
  const rootPath = path.dirname(__dirname)
  const packages = findAndFilterLernaPackages(rootPath, {
    exclude: ['@zhengxs-devkit/eslint-config', '@zhengxs-devkit/types'],
  })

  const mainFields = ['main', 'module', 'browser', 'unpkg']
  for (const pkg of packages) {
    const files: string[] = mainFields
      .map(key => pkg.get(key) as string)
      .concat('tsconfig.tsbuildinfo')

    const deletedFilePaths = await del(files.filter(Boolean), {
      cwd: rootPath,
    })

    console.log('Deleted files or Directories:\n', deletedFilePaths.join('\n'))
  }
}

run()
