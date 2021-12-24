` 转载：https://www.panyanbin.com/article/47d1c4a4.html`

# VSCode 插件与 npm 包的区别和使用（ESlint、Prettier、Vetur）

项目创建时，为了接入代码检查和风格检查，经常直接在网上搜教程，但是看过很多教程到最后直接就是 ESlint、Prettier、prettier-vscode、Vetur 等等各种插件全安装，这时就有疑问，为什么明明编辑器安装了 eslint，prettier 等插件，还需要安装某些 npm 包，插件有什么用？

## VS Code 插件与 npm 包区别

其实，VS Code 中插件与 npm 包很容易总结：

- VS Code 中安装的插件是在编辑器里面用的，主要提示给你看的，方便你直接在编辑器中看到红色波浪线提示的错误。还可以帮你修复简单的错误

[![img](https://img.panyanbin.com/img/2021/06/27/1624790453-5335839873577b56df510640fa8918da.png)](https://img.panyanbin.com/img/2021/06/27/1624790453-5335839873577b56df510640fa8918da.png)

- 跟 lint 相关的 npm 包，安装完是在命令行中去运行的。如果只安装 npm 包，vscode 是不会有 lint 提示的，只能在运行命令行后在输出的终端窗口查看不符合 lint 规则的检测信息。

[![img](https://img.panyanbin.com/img/2021/06/27/1624790780-7f7fcc45e006930da271e5cc9945b89a.png)](https://img.panyanbin.com/img/2021/06/27/1624790780-7f7fcc45e006930da271e5cc9945b89a.png)

## ESlint

### 1. VS Code 中的 ESlint Extensions

vscode 中的 eslint 插件仅仅只是 eslint 插件，其本质还是会调用项目本地或全局安装的 eslint（npm 包），然后将 eslint 的报错反馈给 vscode，因此我们可以直接在编辑器中看到错误

也就说 ESlint 必须依赖本地安装/全局安装的 eslint 才可以正常工作，可以对比 webpack-cli 与 webpack 的关系。

当安装这个扩展插件后，可以在编辑器的配置文件（`.vscode/settings.json`）中进行 eslint 的配置，如编辑器识别文件类型，保存之后进行 lint 等

```
{
  "eslint.enable": true,
  "eslint.options": {
    "extensions": [
      ".js",
      ".vue",
      ".ts",
      ".tsx"
    ]
  },
  "eslint.run": "onSave",
  "editor.codeActionsOnSave":{
  	 // "source.fixAll": true,
     "source.fixAll.eslint": true
  }
}
```

### 2. eslint（npm 包）

npm 包安装的 eslint 包，可以在命令行执行 eslint 命令时，去触发检测代码，并把不符合 lint 规则输出到命令行终端。

eslint 安装后，还需要添加 eslint 的配置文件，如在根目录中添加`.eslintrc.js`，详细的 eslint 规则配置可以阅读本站的相关文章：

eslint 的配置项说明（rules、extends、plugins、globals、parser）

如果希望在项目运行开发过程中也执行 eslint，也就是开发时编写代码不符合 lint 规则，终止编译并把错误内容输出浏览器中，就需要把 eslint 也应用到编译中

对于基于 webpack 进行项目开发，就需要引入`eslint-loader`。

在 webpack 配置文件下的`module.rules`配置项中添加`eslint-loader`的配置

```
{
    test: /\.(vue|(j|t)sx?)$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    options: {
        //eslintPath: require.resolve('eslint'),
        extensions: ['js', 'vue', 'jsx', 'ts', 'tsx'],
    },
},
```

> 此配置仅做说明，若在项目中应用需要查看官方配置说明。

## Prettier

根据以上的了解，可以知道 VS Code 中的 Prettier 插件和 prettier 的 npm 包的区别，Prettier 插件是给 VS Code 编辑器本地提示用的以及格式化代码，prettier 包是用于命令行方式进行风格检查。

需要注意，prettier 的 npm 包并不能直接进行校验，而是需要整合到 eslint 的配置中`.eslintrc.js`进行，如

```
{
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "prettier"
  ]
}
```

> 此配置仅做说明，若在项目中应用需要查看官方配置说明。

风格检查的规则配置文件（`.prettierrc`）一般放置在项目根目录，prettier 插件和 prettier 包将根据配置文件来格式化内容，如

```
// .prettierrc
{
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "trailingComma": "all",
  "printWidth": 120,
  "endOfLine":"auto"
}
```

> 此配置仅做说明，若在项目中应用需要查看官方配置说明。

## eslint 与 prettier 的关系

- **ESLint 主要负责: 质量检查(例如使用了某个变量却忘记了定义)、风格检查**
- **Prettier 主要负责: 风格检查, 没有质量检查**

虽然 eslint 本身只提供了部分风格检查，但是这导致有部分的代码依然没有实现风格检查。对于大多数实际项目，都会使用 Prettier 进行风格检查。

需要注意一点就是：由于会出现引入多个风格检查的插件和配置 lint，这就导致存在部分会与 prettier 的 lint 出现冲突。因此需要 lint 预设包`eslint-config-prettier`，这个包的作用是先关闭这些与 prettier 冲突的 lint 规则，然后之后再启用 prettier 的规则，使得冲突的 lint 规则以 prettier 为准。`eslint-config-prettier`配置文档点击[这里](https://github.com/prettier/eslint-config-prettier)。

配置时，把`prettier`和`plugin:prettier/recommended`放到`extends`的最后。

## Vetur 插件

通过以上我们发现，Vscode 编辑器安装好 Eslint 和 Prettier 插件，项目中安装和配置好 eslint 以及 prettier，代码质量检查和风格检查就没什么大问题了，那 vetur 插件是用来做什么的？

简单说明，Vetru 就是一个识别 vue 文件的插件 ，提供一下高亮以及代码格式化，点击[此处](https://marketplace.visualstudio.com/items?itemName=octref.vetur)下载 Vetur 插件。

首先，如果在 vscode 编辑器中把 vetur 插件给禁用掉或者卸载，然后重启编辑器，这时去查看 vue 文件的代码会发现代码全变灰了，代码的高亮效果没有了。此外，还会发现，原来右键文档出来的格式化文档（Format Document）没有了，或者不能以 Vetur 风格来格式化文档。

[![img](https://img.panyanbin.com/img/2021/06/27/1624792362-4f8c39bdd060c7ddff38085cb86eebbe.png)](https://img.panyanbin.com/img/2021/06/27/1624792362-4f8c39bdd060c7ddff38085cb86eebbe.png)

Vetur 不仅可对 Vue 文件内容进行高亮，还可以使用配置文件定义的格式化工具来检查和高亮各种文件格式（css、scss）

Vetur 内嵌了如下格式化工具, 如果本地安装了相应版本, 则会使用本地安装的版本, 默认配置如图

- [`prettier`](https://github.com/prettier/prettier): For css/scss/less/js/ts.
- [`prettier-eslint`](https://github.com/prettier/prettier-eslint): For js. Run `prettier` and `eslint --fix`.
- [`prettyhtml`](https://github.com/Prettyhtml/prettyhtml): For html.
- [`stylus-supremacy`](https://github.com/ThisIsManta/stylus-supremacy): For stylus.
- [`vscode-typescript`](https://github.com/Microsoft/TypeScript): For js/ts. The same js/ts formatter for VS Code.
- [`sass-formatter`](https://github.com/TheRealSyler/sass-formatter): For the .sass section of the files.

在编辑器的`settings.json`配置文件中，可以重新定义各种文件内容使用的格式化工具。

[![img](https://img.panyanbin.com/img/2021/06/27/1624800622-6c3f7c61233eccca217463b73d8cd120.png)](https://img.panyanbin.com/img/2021/06/27/1624800622-6c3f7c61233eccca217463b73d8cd120.png)

Vetur 只是让你在 vscode 编辑器中看到 vue 代码高亮内容和语法风格是否有问题，至于 vue 项目在命令行执行时判断 vue 文件是否有语法风格问题，就需要 eslint 整合 Vue 官方提供的[eslint-plugin-vue](https://eslint.vuejs.org/)包来对 vue 文件进行 lint 操作来判断。

如：

```
{
  "parser": "vue-eslint-parser", //解析.vue文件
  "extends": [
    "plugin:vue/recommended"
  ]
}
```

> 此配置仅做说明，若在项目中应用需要查看官方配置说明

## 操作测试

以下操作是基于安装了 eslint 包和配置基础的 eslint 校验规则。

```
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  extends: ['eslint:recommended'],
  rules: {},
}
```

- 不安装 VS Code 的 ESlint 插件

  结果：编辑器无法通过 eslint 去 lint 代码，编辑器中任意文件均没有任何错误的波浪线提示，但可以通过 eslint 命令方式去校验错误的代码。

- 安装 ESlint 插件，但不安装 VS Code 的 prettier 插件，eslint 配置文件中已接入 prettier，添加.prettierrc 配置文件

  结果：在编辑器中的 js 文件可以根据 prettier 风格检查，对于错误的有红色波浪线提示；不过 vue 和 html 的文件类型识别不出来（settings.json 已设置了 eslint.options.extensions 类型）

- 安装 ESlint 插件，但不安装 VS Code 的 prettier 插件，eslint 配置文件中已接入 prettier 和 eslint-plugin-vue

  结果：执行 eslint 命令，vue 文件可以识别出错误并输出到命令终端；编辑器中 vue 文件内容依然全灰，无错误波浪线提示，执行 eslint 命令时添加 fix 参数可以修复简单错误

- 安装 VS Code 的 Prettier 和 ESlint 插件，eslint 配置文件中已接入 prettier 和 eslint-plugin-vue

  结果：编辑器对于不符合 prettier 风格的 js 文件和 vue 文件，均会有红色波浪线错误提示；配置保存后格式化时，保存文件会自动修复简单错误；右键 vue 文件内容出现格式化文件的选项；但 vue 文本内容依然没有高亮显示

- 安装 VS Code 的 Vetur 和 ESlint 插件，不安装 Prettier 插件，eslint 配置文件中已接入 prettier 和 eslint-plugin-vue

  结果：编辑器对于不符合 prettier 风格的 js 文件和 vue 文件，均会有红色波浪线错误提示；配置保存后格式化时，保存文件会自动修复简单错误；右键 vue 文件内容出现格式化文件的选项；vue 文件文本高亮显示。

## 总结

1. 关于 VS Code 编辑器的插件

   - 为了能直接在编辑器中看到错误提示，必须安装 Eslint 插件，如果不安装开发时就只能靠 eslint 命令手动去检查才知道问题所在
   - 若是开发 Vue 项目代码，只需安装 Vetur 插件即可，并不需要安装 Prettier 插件，因为 Vetur 插件内置了各种格式化，而且还有对 Vue 文件内容的高亮显示，此外还需要把 vetur 对应的`vetur.validation.template`配置关闭
   - 但是对于非 Vue 项目代码，还是可以安装 Prettier 插件来进行代码的风格检查

2. 关于 lint 的 npm 包

   - 必须安装 eslint 包，因为 eslint 校验就依赖这个包
   - 对于 js 代码的校验可以安装`eslint-config-standard`等包
   - 使用 eslint 配置中集成 prettier 风格检查，需要安装`prettier`、`eslint-config-prettier`、`eslint-plugin-prettier`包，以及`.prettierrc`配置文件

3. 关于编辑器配置文件

   可以在项目根目录下创建`.vscode`文件夹，并在里面创建编辑器配置文件`settings.json`，在其中添加保存后自动格式化的设置

   ```
   {
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true,
   	// "source.fixAll": true
     }
   }
   ```

## 参考

> 1. [vscode, eslint, prettier, vetur 冲突及解决](https://www.cnblogs.com/mspeer/p/12055962.html)
> 2. [VS Code 使用 Vetur 插件+.prettierrc.js 配置格式化规范](https://www.jianshu.com/p/75c953183cf7)
> 3. [VSCode 常用插件之 ESLint 使用](https://www.cnblogs.com/jiaoshou/p/12218642.html)
> 4. [Vetur+Eslint+Prettier 介绍](https://zhuanlan.zhihu.com/p/158883214)
