#!/usr/bin/env node

// 文件参考：https://github.com/vuejs/vue-next/blob/3ff94faca1816316c61d557fe8cc79277eaa8db6/scripts/build.js#L120
const path = require('path')
const fs = require('fs')

const minimist = require('minimist')
const prompts = require('prompts')
const { yellow, green, cyan, red } = require('kolorist')

const WORKSPACES = [
  {
    name: 'package',
    color: cyan,
    variants: [
      {
        name: 'package-ts',
        display: 'TypeScript',
        color: cyan,
      },
      {
        name: 'package-js',
        display: 'JavaScript',
        color: yellow,
      },
    ],
  },
  {
    name: 'monorepo',
    color: green,
    variants: [
      {
        name: 'monorepo-ts',
        display: 'TypeScript',
        color: cyan,
      },
      {
        name: 'monorepo-js',
        display: 'JavaScript',
        color: yellow,
      },
    ],
  },
]

const TEMPLATES = WORKSPACES.map(
  f => (f.variants && f.variants.map(v => v.name)) || [f.name]
).reduce((a, b) => a.concat(b), [])

const argv = minimist(process.argv.slice(2), {
  string: ['_'],
})

async function run() {
  let targetDir = argv._[0]
  let template = argv.template || argv.t

  const defaultProjectName = !targetDir ? 'devkit-project' : targetDir

  let result = {}

  try {
    result = await prompts(
      [
        {
          name: 'projectName',
          type: targetDir ? null : 'text',
          message: '项目名称:',
          initial: defaultProjectName,
          onState: state => {
            targetDir = state.value.trim() || defaultProjectName
          },
        },
        {
          name: 'overwrite',
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
          message: () =>
            (targetDir === '.' ? '当前目录' : `指定目录 "${targetDir}"`) +
            ` 不是空目录. 是否删除所有文件后继续?`,
        },
        {
          name: 'overwriteChecker',
          type: (_, { overwrite } = {}) => {
            if (overwrite === false) throw new Error(red('✖') + ' 操作取消')
          },
        },
        {
          name: 'mode',
          type: template && TEMPLATES.includes(template) ? null : 'select',
          message:
            typeof template === 'string' && !TEMPLATES.includes(template)
              ? `"${template}" 不是有效的模板. 请从下面选择: `
              : '选择开发模式:',
          initial: 0,
          choices: WORKSPACES.map(workspace => {
            const workspaceColor = workspace.color
            return {
              title: workspaceColor(workspace.name),
              value: workspace,
            }
          }),
        },
        {
          name: 'variant',
          type: workspace =>
            workspace && workspace.variants ? 'select' : null,
          message: '选择变体:',
          choices: workspace =>
            workspace.variants.map(variant => {
              const variantColor = variant.color
              return {
                title: variantColor(variant.display),
                value: variant.name,
              }
            }),
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' 操作取消')
        },
      }
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    return
  }

  const cwd = process.cwd()
  const root = path.join(cwd, targetDir)

  // user choice associated with prompts
  const { overwrite, framework, variant } = result

  if (overwrite) {
    console.log(`\n开始清理文件...`)
    emptyDir(root)
    console.log(`\n清理完成.`)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(`\n开始创建工程...`)

  // determine template
  template = variant || framework || template

  const templateDir = path.join(__dirname, `template-${template}`)

  const write = (file, content) => {
    const targetPath = path.join(root, file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  for (const file of fs.readdirSync(templateDir)) {
    write(file)
  }

  console.log(`\nDone.`)
  console.log()
}

run().catch(e => {
  console.error(e)
})

function copy(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function isEmpty(path) {
  return fs.readdirSync(path).length === 0
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file)
    // baseline is Node 12 so can't use rmSync :(
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      fs.rmdirSync(abs)
    } else {
      fs.unlinkSync(abs)
    }
  }
}
