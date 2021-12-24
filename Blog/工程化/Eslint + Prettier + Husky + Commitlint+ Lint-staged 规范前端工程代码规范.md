> 转载: https://juejin.cn/post/7038143752036155428

> 总结一份自己的前端工作流搭建流程,方便以后使用,创建一个简单的模板,后续放在 `npm` 上创建新内容,方便直接 `npm` 下载模板 主要使用技术
>
> 1.  **Eslint**
> 2.  **Prettier**
> 3.  **husky**
> 4.  **lint-staged**
> 5.  **commitlint**
> 6.  **commitizen**
>
> 基础模板代码: [template](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjp-liu%2Fworkflow-template 'https://github.com/jp-liu/workflow-template')

## 1.代码规范

### 代码检查工具

- **Eslint**
- 项目集成

  - ```
    npm i eslint -D
    npx eslint --init
    复制代码
    ```
  - **init** 命令会自动生成 **.eslintrc.js**

### 代码风格工具

- **prettier**
- 项目集成

  - ```
    npm i prettier eslint-config-prettier eslint-plugin-prettier -D
    复制代码
    ```
  - 在.eslintrc 中,extend 中添加 "prettier" 解决 eslint 和 prettier 的冲突

    - 因为 eslint-config-prettier 新版本更新之后,只需要写一个 "prettierr" 即可,无需多言指令

  - 创建 .prettierrc

    ```

    {
      "semi": false,
      "tabWidth": 2,
      "trailingComma": "none",
      "singleQuote": true,
      "arrowParens": "avoid"
    }
    复制代码
    ```

## 2.git 规范

> Git 有很多的 hooks, 让我们在不同的阶段,对代码进行不同的操作,控制提交到仓库的代码的规范性,和准确性, 以下只是几个常用的钩子

### 2.1 提交的代码规范

- **pre-commit**
- 描述: 通过钩子函数,判断提交的代码是否符合规范

### 2.2 提交的信息规范

- **commit-msg**
- 描述: 通过钩子函数,判断 commit 信息是否符合规范

### 2.3 提交的代码影响

- **pre-push**
- 描述: 通过钩子,执行测试,避免对以前的内容造成影响

### 工具

- **husky**

  - 操作 git 钩子的工具

- **lint-staged**

  - 本地暂存代码检查工具

- **commitlint**

  - commit 信息校验工具

- **commitizen**
- 辅助 commit 信息 ,就像这样,通过选择输入,规范提交信息

  - ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7470030c2b04b488f0d4bc5729db82f~tplv-k3u1fbpfcp-watermark.awebp?)

### 安装流程

- 1.安装代码校验依赖

  - ```
    npm i lint-staged husky -D
    npm set-script prepare "husky install"
    npm run prepare
    复制代码
    ```

    - 初始化 **husky**, 会在根目录创建 **.husky** 文件夹

  - ```
    npx husky add .husky/pre-commit "npx lint-staged"
    复制代码
    ```

    - **pre-commit** 执行 **npx lint-staged** 指令

  - 根目录创建 **.lintstagedrc.json** 文件控制检查和操作方式

    - ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/704664dd11fc421b88d6363936e63c1c~tplv-k3u1fbpfcp-watermark.awebp?)

- 2.安装提交信息依赖

  - ```
    npm i commitlint @commitlint/config-conventional -D
    npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
    复制代码
    ```

    - **@commitlint/config-conventional** 这是一个规范配置,标识采用什么规范来执行消息校验, 这个默认是***Angular***的提交规范

      **类型**

      **描述**

      build

      编译相关的修改，例如发布版本、对项目构建或者依赖的改动

      chore

      其他修改, 比如改变构建流程、或者增加依赖库、工具等

      ci

      持续集成修改

      docs

      文档修改

      feat

      新特性、新功能

      fix

      修改 bug

      perf

      优化相关，比如提升性能、体验

      refactor

      代码重构

      revert

      回滚到上一个版本

      style

      代码格式修改, 注意不是 css 修改

      test

      测试用例修改

    - **commit-msg** 钩子执行 消息校验
    - 这里也可以采用自己写的方法,来校验内容, 看下 vue@next 的消息提交
    - 我们也可以使用自己写的方法,设置的话使用一下指令

      - ```
        npx husky add .husky/commit-msg 'node [dir]/filename.js'
        复制代码
        ```

- 3.安装辅助提交依赖

  - ```
    npm i commitizen cz-conventional-changelog -D
    复制代码
    ```

    - 安装指令和命令行的展示信息

  - ```
    npm set-script commit "git-cz"
    复制代码
    ```

    - 编写**commit**指令

  - ```
    npx commitizen init cz-conventional-changelog --save-dev --save-exact
    复制代码
    ```

    - 初始化命令行的选项信息,不然没有选项
    - ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4060ccb6a2bf48bda08c603d080e7109~tplv-k3u1fbpfcp-watermark.awebp?)

- 4.自定义提交规范

  - ```
    npm i -D commitlint-config-cz  cz-customizable
    复制代码
    ```
  - 变更 **commitlint.config.js** 这里采用自己定义的规范,将会覆盖上面那个,所以上面那个可以不用安装

    - ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/121184d6ae3348ef92e2db217ef79a0c~tplv-k3u1fbpfcp-watermark.awebp?)

  - 增加 .cz-config.js

    - ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e9d4780ff3844429202f5e248acceeb~tplv-k3u1fbpfcp-watermark.awebp?)

  - package.json 中,将原来 commit 配置,变更为自定义配置

    - ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/299109fbebcf45dd8c8988ca0a7abfd0~tplv-k3u1fbpfcp-watermark.awebp?)

  - 然后提交会变成这样

    - ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eeb9e9ee261f428ab1217bda629a3633~tplv-k3u1fbpfcp-watermark.awebp?)

## 3.测试

### 单元测试

- jest
- 测试三部曲
- input&output

### 配置 jest

- 前往 jest 文档,根据需求添加内容
- [www.jestjs.cn/docs/gettin…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.jestjs.cn%2Fdocs%2Fgetting-started 'https://www.jestjs.cn/docs/getting-started')

### 提交代码的测试运行

- ```
  npx husky add .husky/pre-push "npx test"
  复制代码
  ```

## 思维导图

![前端工作流.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89127e3c272d4ff18caaec323582e829~tplv-k3u1fbpfcp-watermark.awebp?)
