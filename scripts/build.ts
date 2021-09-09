import path from 'path'
import { buildForLerna } from '@zhengxs-devkit/build'

buildForLerna({
  cwd: path.dirname(__dirname),
  pkgs: {
    exclude: ['@zhengxs-devkit/eslint-config'],
  },
})
