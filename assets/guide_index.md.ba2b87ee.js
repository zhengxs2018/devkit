import{o as n,c as a,a as e}from"./app.ad659bf2.js";const s='{"title":"开始","description":"","frontmatter":{},"headers":[{"level":2,"title":"总览","slug":"总览"},{"level":2,"title":"搭建第一个项目","slug":"搭建第一个项目"},{"level":2,"title":"配置加载方式","slug":"配置加载方式"},{"level":2,"title":"支持多文件输出","slug":"支持多文件输出"},{"level":2,"title":"社区","slug":"社区"}],"relativePath":"guide/index.md","lastUpdated":1631354591830}',t={},p=[e('<h1 id="开始" tabindex="-1">开始 <a class="header-anchor" href="#开始" aria-hidden="true">#</a></h1><h2 id="总览" tabindex="-1">总览 <a class="header-anchor" href="#总览" aria-hidden="true">#</a></h2><p><a href="https://www.npmjs.com/package/@zhengxs-devkit/build" target="_blank" rel="noopener noreferrer">@zhengxs-devkit/build</a> 意在提供开箱即用的配置，提供目前常用的几种配置方式，支持导出 <code>esm</code>，<code>cjs</code>，<code>umd</code> 等编译产物。</p><p>同时支持 <a href="./run-in-lerna.html">monorepo</a> 和 <a href="./run.html">package</a> 两种编译方式，可以在 <a href="/">最佳实践</a> 了解 2 种方式的优缺点。</p><h2 id="搭建第一个项目" tabindex="-1">搭建第一个项目 <a class="header-anchor" href="#搭建第一个项目" aria-hidden="true">#</a></h2><blockquote><p>包占坑中，功能正在实现</p></blockquote><p>使用 NPM:</p><div class="language-bash"><pre><code>$ <span class="token function">npm</span> init zdk@latest\n</code></pre></div><p>使用 Yarn:</p><div class="language-bash"><pre><code>$ <span class="token function">yarn</span> create zdk\n</code></pre></div><p>然后按照提示操作即可！</p><p>你还可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。例如，要构建一个 Monorepo + Typescript 项目，运行:</p><div class="language-bash"><pre><code><span class="token comment"># npm 6.x</span>\n<span class="token function">npm</span> init zdk@latest my-project --template monorepo-ts\n\n<span class="token comment"># npm 7+, 需要额外的双横线：</span>\n<span class="token function">npm</span> init zdk@latest my-project-- --template monorepo-ts\n\n<span class="token comment"># yarn</span>\n<span class="token function">yarn</span> create zdk my-project --template monorepo-ts\n</code></pre></div><p>支持的模板预设包括：</p><ul><li><code>pure-js</code></li><li><code>pure-ts</code></li><li><code>monorepo-js</code></li><li><code>monorepo-ts</code></li></ul><p>查看 <a href="https://github.com/zhengxs2018/zhengxs-devkit/tree/main/packages/create" target="_blank" rel="noopener noreferrer">create</a> 以获取每个模板的更多细节。</p><h2 id="配置加载方式" tabindex="-1">配置加载方式 <a class="header-anchor" href="#配置加载方式" aria-hidden="true">#</a></h2><blockquote><p>注意：如果是 <code>monorepo</code> 模式，根配置只允许返回对象。</p></blockquote><p>采用当前主流配置加载方式，默认情况下，从工程目录开始搜索以下内容：</p><ul><li><code>package.json</code> 文件中的 <code>build</code> 属性</li><li><code>.buildrc</code></li><li><code>.buildrc.(js|cjs|json|yaml|yml)</code></li><li><code>build.config.(js|cjs)</code></li></ul><p>具体说明详见 <a href="https://www.npmjs.com/package/cosmiconfig" target="_blank" rel="noopener noreferrer">cosmiconfig</a> 模块。</p><h2 id="支持多文件输出" tabindex="-1">支持多文件输出 <a class="header-anchor" href="#支持多文件输出" aria-hidden="true">#</a></h2><p>目录结构</p><div class="language-text"><pre><code>├── src/\n│   ├── main-a.js\n│   └── main-b.js\n├── .buildrc.js\n└── package.json\n</code></pre></div><p>配置文件</p><div class="language-js"><pre><code><span class="token keyword">const</span> <span class="token punctuation">{</span> defineConfig <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;@zhengxs-devkit/build&#39;</span><span class="token punctuation">)</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token function">defineConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token comment">/**\n   * 注意 umd 和 iife 不支持代码拆分\n   * \n   * 默认输出：umd，esm，cjs\n   */</span>\n  formats<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;cjs&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token comment">/**\n  * 具体说明详见 rollup 官方文档\n  *\n  * @see https://rollupjs.org/guide/en/#input\n  */</span>\n  entry<span class="token operator">:</span> <span class="token punctuation">{</span>\n    index<span class="token operator">:</span> <span class="token string">&#39;src/index.js&#39;</span><span class="token punctuation">,</span>\n    arrayify<span class="token operator">:</span> <span class="token string">&#39;src/arrayify.js&#39;</span><span class="token punctuation">,</span>\n    unwrap<span class="token operator">:</span> <span class="token string">&#39;src/unwrap.js&#39;</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">/**\n   * 具体说明详见 rollup 官方文档\n   * 文件输出的路径是基于 outDir 来的\n   * \n   * @see https://rollupjs.org/guide/en/#outputentryfilenames\n   * @type {import(&#39;rollup&#39;).RenderedChunk}\n   */</span>\n  entryFileNames<span class="token operator">:</span> <span class="token string">&#39;[name].js&#39;</span><span class="token punctuation">,</span>\n  <span class="token comment">/**\n   * 如果是多文件一定要设置输出目录\n   * @see https://rollupjs.org/guide/en/#outputdir\n   */</span>\n  outDir<span class="token operator">:</span> <span class="token string">&#39;dist&#39;</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>输出产物</p><div class="language-text"><pre><code>├── dist/\n│   ├── index.js\n│   ├── arrayify.js\n│   ├── shared-[hash].js\n│   └── unwrap.js\n├── src/\n│   ├── index.ts\n│   ├── arrayify.ts\n│   ├── shared.ts\n│   └── unwrap.ts\n├── .buildrc.js\n└── package.json\n</code></pre></div><p>查看 <a href="https://github.com/zhengxs2018/zhengxs-devkit/tree/main/examples/package-entries" target="_blank" rel="noopener noreferrer">create</a> 以获取更多细节。</p><h2 id="社区" tabindex="-1">社区 <a class="header-anchor" href="#社区" aria-hidden="true">#</a></h2><p>如果你有疑问或者需要帮助，可以到 <a href="https://github.com/zhengxs2018/zhengxs-devkit/discussions" target="_blank" rel="noopener noreferrer">GitHub 讨论区</a> 来寻求帮助。</p>',31)];t.render=function(e,s,t,o,r,c){return n(),a("div",null,p)};export{s as __pageData,t as default};
