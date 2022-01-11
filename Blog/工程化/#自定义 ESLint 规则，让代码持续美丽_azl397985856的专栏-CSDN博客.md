`转载: https://blog.csdn.net/azl397985856/article/details/107328697`

????  这是第 60 篇不掺水的原创，想要了解更多，请戳上方蓝色字体：政采云前端团队 关注我们吧～

> 本文首发于政采云前端团队博客：自定义 [ESLint](https://so.csdn.net/so/search?q=ESLint) 规则，让代码持续美丽
> 
> https://www.zoo.team/article/eslint-rules

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy92ekVpYjlJUmhaRDVBTXczVnVXQ0R1QUNuTnhxMEVnYzlsZ1cwY3F0Z2xHY3VjbW5JUklEbERCSEo3ajRzZ1d6NU9pYlExMDVmdFEweVJ6VzB6cm9ydzNnLzY0MA?x-oss-process=image/format,png)

## 背景

> “
> 
> 一段真实的代码发展历史

很久很久以前，有一个需求，然后产出了一段代码，代码优雅而简洁

```
export const getConfig = (param1, param2) => {
```

不久又来了个需求，加个参数扩展，so easy！

```
export const getConfig = (param1, param2, param3) => {
```

经过多次产品需求迭代后，现在的代码![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy92ekVpYjlJUmhaRDZpYXBOT2dMS21Td2lidDUzUUw2clNpY1dpYjJMSGE1ZXdjZDRhbTZhWFlFUGphQnM3WTBYZXhjTG5jaWE2VExmNkZyRlEyaWJQdkZRdGZIdEEvNjQw?x-oss-process=image/format,png)

```
export const getConfig = (param1, param2, param3, param4, param5, param6, param7……) => {
```

在产品迭代过程中，上面的 case 一个函数的参数从 2 个发展到了 7 个，优雅的代码逐渐变为不可维护。这是什么问题？这归咎于日益增长的需求，快速响应和代码质量之间的矛盾。

那如何避免呢？

-   制定代码规范
    
-   靠开发同学的自我修养
    
-   进行 Code Review
    
-   工具提示
    
-   发版控制，不允许发版
    

制定代码规范肯定是需要的，那如何约束代码呢？规范文档宣讲，再凭借开发同学的自我修养？答案是：无法保证。

Code Review ？但难免也有落网之鱼。发版控制？能有效解决但是开发体验不好。

如果我们在开发者写代码的时候就及时给到提示和建议，那开发体验就很棒了，而 `ESLint` 的自定义规则就可以实现在开发过程中给开发同学友好的提示。

## ESLint 原理

ESLint 是一个代码检查工具，通过静态的分析，寻找有问题的模式或者代码。默认使用 **Espree** (https://github.com/eslint/espree) 解析器将代码解析为 `AST` 抽象语法树，然后再对代码进行检查。

看下最简单的一段代码使用 `espree` 解析器转换成的抽象语法树结构，此处可以使用 **astexplorer** (https://astexplorer.net/) 快速方便查看解析成 `AST` 的结构：

代码片段：

```
var a = 1;
```

转换出的结果：

```
"type": "VariableDeclaration","type": "VariableDeclarator",
```

代码转换为 `AST` 后，可以很方便的对代码的每个节点对代码进行检查。

## 自定义 ESLint 规则开发

### 怎么自定义

#### 语法树分析

对目标代码进行语法树解析，可使用 **astexplorer** (https://astexplorer.net/)

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy92ekVpYjlJUmhaRDZpYXBOT2dMS21Td2lidDUzUUw2clNpY1c5T21ibWZDbUJOVkxaVGdEMmxNc1NNajVjSUZYc2RPMjdUeEVsamJpYmJlT0pxckh5RnRRU2ZnLzY0MA?x-oss-process=image/format,png)

#### 编写规则

下面是一个规则简单的结构（**官方 API 文档说明**：https://eslint.org/docs/developer-guide/working-with-rules#rule-basics）

```
  create: function (context) {      FunctionDeclaration: (node) => {if (node.params.length > 3) {
```

-   meta（对象）包含规则的元数据
    
-   create ( function ) 返回一个对象，其中包含了 ESLint 在遍历 JavaScript 代码的抽象语法树 AST ( ESTree 定义的 AST ) 时，用来访问节点的方法
    
-   context.report ( )  用来发布警告或错误，并能提供自动修复功能（取决于你所使用的配置）
    

最简单的示例（只使用 node 和 message 参数）：

使用上面的这个规则，结合编辑器就有了对整个 `node` 节点的提示，如果需要更精确的错误或警告提示，我们可以使用 `loc` 参数，**`API` 文档说明** (https://eslint.org/docs/developer-guide/working-with-rules#context-report)。

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X2dpZi92ekVpYjlJUmhaRDZpYXBOT2dMS21Td2lidDUzUUw2clNpY1dNblc3dnFIcTNzcVg0dHZxWUV3aWJSVDZ3UFBZMFZEcm5XS0ZiN1h4MmVZQ1NXQm9SSjBLYWd3LzY0MA?x-oss-process=image/format,png)

image

### 如何使用自定义规则

使用自定义的 `ESLint` 规则，你需要自定义一个 `ESLint` 的插件，然后将规则写到自定义的 `ESLint` 插件中，然后在业务代码中添加 `ESLint` 配置，引入 `ESLint` 插件。

## ESLint 插件

### 创建

创建一个 `ESLint plugin`，并创建 一个 `ESLint rule`。

基于 `Yeoman generator` (https://yeoman.io/authoring/) ，可以快速创建 `ESLint plugin` 项目。

```
npm i -g generator-eslint
```

创建好的项目目录结构：

-   `rules` 文件夹存放的是各个规则文件
    
-   `tests` 文件夹存放单元测试文件
    
-   package.json 是你的 `ESLint` 插件 npm 包的说明文件，其中的 `name` 属性就是你的 `ESLint`  插件的名称，命名规则：带前缀 `eslint-plugin-`
    

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy92ekVpYjlJUmhaRDZpYXBOT2dMS21Td2lidDUzUUw2clNpY1c5TmdXUGF3Q0lxTGx6dG1tbUtZV2o2RllDTHBVMVloQ2lhcWE2a21SeEtsVlBFbDBpYk14R0l6Zy82NDA?x-oss-process=image/format,png)

示例代码：

lib/rules/max-params.js

```
  create: function (context) {    function getFunctionParamsLoc(node) {const paramsLength = node.params.length;        start: node.params[0].loc.start,        end: node.params[paramsLength - 1].loc.end,      FunctionDeclaration: (node) => {if (node.params.length > 3) {            loc: getFunctionParamsLoc(node),
```

补充测试用例

/tests/lib/rules/max-params.js

```
var ruleTester = new RuleTester();ruleTester.run("max-params", rule, {  valid: ["function test(d, e, f) {}"],        code: "function test(a, b, c, d) {}",
```

### ESLint 插件安装

在需要的业务代码中安装你的 ESLint 插件。（`eslint-plugin-my-eslist-plugin` 是你的 ESLint 插件 npm 包的包名）

```
npm install eslint-plugin-my-eslist-plugin 
```

如果你的 npm 包还未发布，需要进行本地调试：

可使用 `npm link` 本地调试，**npm link 的使用** (https://www.baidu.com/s?ie=UTF-8&wd=npm%20link)。

### 配置

添加你的 `plugin` 包名（`eslint-plugin-` 前缀可忽略） 到 `.eslintrc` 配置文件的 `plugins` 字段。

`.eslintrc` 配置文件示例：

`rules` 中再将 `plugin` 中的规则导入。⚠️ ESlint更新后，需要重启 `vsCode`，才能生效。（ vsCode  重启快捷方式：`CTRL` +`SHITF` + `P`，输入 `Reload Window` ）

此处涉及 `ESLint` 的规则设置（**参考说明**：https://eslint.org/docs/user-guide/configuring#configuring-rules）

### 效果

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X2dpZi92ekVpYjlJUmhaRDZpYXBOT2dMS21Td2lidDUzUUw2clNpY1dNblc3dnFIcTNzcVg0dHZxWUV3aWJSVDZ3UFBZMFZEcm5XS0ZiN1h4MmVZQ1NXQm9SSjBLYWd3LzY0MA?x-oss-process=image/format,png)

image

## 实际应用案例

函数、方法的入参个数控制，其实已经在 `ESLint` 的规则中了。在业务场景中，我们需要对我们的业务规则编写自定义的 `ESLint` 规则。

一个简单的业务场景：业务中通常会出现跳转到很多不同的业务域名的操作，不同的环境有不同的域名，我们需要从配置中取出域名使用，而不是采取硬编码域名的方案。

由此我们产生出了一个规则：禁止硬编码业务域名。

规则为：

```
      description: "不允许硬编码业务域名",  create: function (context) {const sourceCode = context.getSourceCode();    function checkDomain(node) {const Reg = /^(http:\/\/|https:\/\/|\/\/)(.*.){0,1}zcygov(.com|cn)(.*)/;        (node.type === "Literal" && node.value) ||        (node.type === "TemplateLiteral" && node.quasis[0].value.cooked);        (node.type === "Literal" && node) ||        (node.type === "TemplateLiteral" && node.quasis[0]);            let domainKey = content.match(Reg)[2];              ? domainKey.substr(0, domainKey.length - 1)if (node.type === "Literal") {                  [domainNode.start + 1, domainNode.end - 1],                  content.replace(Reg, `$4`)if (node.type === "TemplateLiteral") {                  [domainNode.start, domainNode.end],                  content.replace(Reg, `$4`)              node.type === "Literal" &&              node.parent.type === "JSXAttribute"              fixes.push(fixer.insertTextBefore(node, "{"));              fixes.push(fixer.insertTextAfter(node, "}"));`window.getDomain('${domainKey}') + `      TemplateLiteral: checkDomain,
```

补充测试用例

/tests/lib/rules/no-zcy-domain.js

```
var rule = require("../../../lib/rules/no-zcy-domain"),    RuleTester = require("eslint").RuleTester;var ruleTester = new RuleTester();ruleTester.run("no-zcy-domain", rule, {              x: "http://bidding.zcygov.cn"
```

结合 vsCode 保存自动修复 ESLint 错误的功能，效果如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X2dpZi92ekVpYjlJUmhaRDZpYXBOT2dMS21Td2lidDUzUUw2clNpY1diSXhsSFBTQUJnMGljMVdnWUlwNDJlTGlhbG42Uk9KRWdPYlhpYWM0TW83dG5zVUVjYWNWQTBEaWFBLzY0MA?x-oss-process=image/format,png)

## 更多的应用场景

除了上面说的硬编码的场景，还可以将沉淀出的最佳实践和业务规范通过自定义 `ESLint` 的方式来提示开发者，这对于多人协助、代码维护、代码风格的一致性都会有很大的帮助。

更多的应用场景有：

-   Input 必须要有 `maxlength` 属性，防止请求的后端接口数据库异常
    
-   代码中不能出现加减乘除等计算，如果需要计算应该引入工具函数，来控制由于前端浮点数计算引起的 Bug
    
-   规范限制，单位元的两边的括号要用英文括号，不能用中文括号，来达到交互展示统一的效果
    
-   代码中不能使用 OSS 地址的静态资源路径，应该使用 CDN 地址的资源路径
    
-   ...
    

## 参考文献

-   https://developer.mozilla.org/zh-CN/docs/Mozilla/Projects/SpiderMonkey/Parser\_API
    
-   https://eslint.org/docs/developer-guide/working-with-rules
    

### 推荐阅读

_1、__[你不知道的前端异常处理（万字长文，建议收藏）](https://blog.csdn.net/azl397985856/article/details/106798710)___  

__2、[你不知道的 TypeScript 泛型（万字长文，建议收藏）](https://blog.csdn.net/azl397985856/article/details/106913210)__

__3、__[你不知道的 Web Workers （万字长文，建议收藏）](https://blog.csdn.net/azl397985856/article/details/107096488)____

__4、__[lucifer与它的《力扣加加》来啦](https://blog.csdn.net/azl397985856/article/details/106485192)____

__5、[或许是一本可以彻底改变你刷 LeetCode 效率的题解书](https://blog.csdn.net/azl397985856/article/details/105384007)__

__6、[想去力扣当前端，TypeScript 需要掌握到什么程度？](https://blog.csdn.net/azl397985856/article/details/107171652)__

____7、[如果张东升是个程序员](https://blog.csdn.net/azl397985856/article/details/107118183)____

> ❝
> 
> 关注加加，星标加加～
> 
> ❞

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9DdWFybERjdVdQN2lhOWlhU2NsdzRLT1VlYldnYWpWbEs1MlVMdFY3d3NBYUFkb1BLSWJ3ODJHd2NuajVnS3kwaWFsME5odnBZZ1YzNWtPcmtZZG5wRTV1QS82NDA?x-oss-process=image/format,png)

如果觉得文章不错，帮忙点个在看呗