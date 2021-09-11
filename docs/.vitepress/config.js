// @ts-check

const pkg = require('../../package.json')

/**
 * @type {import('vitepress').UserConfig}
 */
 module.exports = {
  title: 'Devkit',
  lang: 'zh-CN',
  description: '非常实用的前端开发者工具',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  themeConfig: {
    repo: 'zhengxs2018/zhengxs-devkit',
    // logo: '/logo.svg',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: '为此页提供修改建议',

    nav: [
      { text: '指引', link: '/guide/' },
      // { text: '配置', link: '/config/' },
      // {
      //   text: '相关链接',
      //   items: [
      //     {
      //       text: '最佳实践',
      //       link: ''
      //     },
      //     {
      //       text: '更新日志',
      //       link: '/CHANGELOG'
      //     }
      //   ]
      // },
    ],

    sidebar: {
      // pass
    }
  }
}
