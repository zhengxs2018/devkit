import path from 'path'
import { runInLerna } from '@zhengxs-devkit/build'

runInLerna({
  cwd: path.dirname(__dirname),
  exclude: ['@zhengxs-devkit/eslint-config', '@zhengxs-devkit/types'],
})
