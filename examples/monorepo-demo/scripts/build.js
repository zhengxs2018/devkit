const path = require('path')
const { runInLerna } = require('@zhengxs-devkit/build')

runInLerna({
  cwd: path.dirname(__dirname),
  // 手动设置编译顺序
  // 如 package-d 不发布，但 package-a 依赖 package-d
  // 希望把 package-d 的代码打进 package-a 时
  // 填 package.json#name 上定义的名称
  include: ['package-d', 'package-b', 'package-a'],
  // 可以忽略某些包
  // 填 package.json#name 上定义的名称
  exclude: ['package-c'],
})
