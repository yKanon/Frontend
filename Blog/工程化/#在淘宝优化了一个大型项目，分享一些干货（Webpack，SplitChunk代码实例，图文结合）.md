> 项目分享一千字，读完需要5分钟，实例部分三千字，读完需要15分钟，动手尝试实例需要1小时，如有错误请指正。

## 场景

本项目是淘系用户增长团队的一个大中台系统，单页应用，涵盖很多业务功能，运用了很多懒加载页面组件来提升性能，首屏时间 1s 左右，体验良好。然而大项目文件很多，导致构建和发布时间很长，内存占用较大。我的任务是尽可能优化与此相关的问题。

## 思路

-   首先不难发现问题并不在用户体验上，而在于开发体验，打包时间太长降低了开发效率。
-   观察项目，项目运用了很多懒加载组件来提升单页性能，但是这些组件组件同时引用了很多重复的模块，导致体积膨胀。
-   接下来定位重复模块具体有哪些，影响大不大，所以需要观察打包后的 chunk 包含哪些模块，重复程度如何。我们可以将 webpack 编译器的输出信息作一些设定，从而展示 chunk 代码块的具体信息：

```
const compiler = webpack(webpackConfig); 
compiler.hooks.done.tap('done', (stats) => {
  console.log(
    stats.toString({
      colors: true,
      chunks: true,
      assets: true,
      children: false,
      modules: false,
    })
  );
}
复制代码
```

当然，简单的项目也可以在打包命令后面加个参数：webpack --display-chunks，效果和上面相当。

-   在 chunk 信息中寻找在多个 chunk 中重复的模块，将他们的路径记录，比如：

```
[./src/components/xxx.jsx] 4.52 KiB {55} {60} {66} {73} {87} {96} {113} {119} {127} {129} {133}
[./node_modules/base/yyy.js] 205 bytes {50} {54} {64} {70} {73} {74} {75} {80} {82} {83} {87} {92} {97} {104} {109} {111} {112} {113} {115} {117} {120} {127} {128} {129} {130} {132} {138} {150} {151}
[./node_modules/base/zzz.js] 205 bytes {50} {54} {64} {70} {73} {74} {75} {80} {82} {83} {87} {92} {97} {104} {109} {111} {112} {113} {115} {117} {120} {127} {128} {129} {130} {132} {138} {150} {151}
···
复制代码
```

每个大括号内都是一个 chunk 的 id，这三个模块被重复打包到了众多 chunk 中。

-   制定代码分割策略，着重配置 optimization.splitChunks,提取重复模块，要兼顾首屏性能，首页需要的包不能太大，如果打得太大需要拆分。(项目代码分割策略不便贴出，只能用下面的实例来代替了)
    
-   最后验证打包效果，不断调整策略直至最优。
    

## 成果

摘自我的淘宝前端团队周报：

项目的打包编译优化，取得有效成果，目前项目总体积比原来减少了 6.4M（原来体积 42.2M，现在 35.8M），编译时间缩短 60% ，发布时间缩短 20%，文件数减少 30 个，打包时不再出现内存溢出问题。

使用的技术只有一个：webpack 的 SplitChunksPlugin。SplitChunksPlugin 出了两年，社区也积累了不少资料，我还是觉得需要补充下面的实例教程，有两个原因：

-   中文社区对 SplitChunksPlugin 的某些属性讲解并不到位，官网教程翻译到中文有些地方不好理解。
-   我能找到的 demo 都很基础，一般仅仅演示某个属性的用法，我需要一个渐进的能把各种配置统一在一起考虑的实例，这样才能映射到实际项目。

以下代码图文预警，webpack 知识体系完整的老司机可以直接略过，小白建议仔细阅读。

专心做事前，首先要找准大方向，才不会在复杂项目中迷路。前端优化无外乎做两件事：

-   优化用户体验
    -   减少首屏加载时间
    -   提升各项交互的流畅度，如表单验证和页面切换
-   优化开发体验
    -   减少构建耗时
    -   自动化完成一些重复工作，解放生产力，脚手架是代表性产物

而 webpack 提供了模块化项目中最主要的优化手段：

-   提取公共代码
-   按需加载（懒加载）

所以，我们就是要通过 Webpack 的两大优化手段，去完成上面前端优化的两件事。当我们面对庞大的项目摸不着头脑，不妨跳出来看看。

SplitChunksPlugin 引入缓存组（cacheGroups）对模块（module）进行分组，每个缓存组根据规则将匹配到的模块分配到代码块（chunk）中，每个缓存组的打包结果可以是单一 chunk，也可以是多个 chunk。

webpack 做了一些通用性优化，我们手动配置 SplitChunksPlugin 进行优化前，需要先理解 webpack 默认做了哪些优化，是怎么做的，之后才能根据自己的需要进行调整。既然造了 SplitChunksPlugin，自己肯定得用上，webpack 的默认优化就是通过 SplitChunksPlugin 配置实现的，如下：

```
module.exports = {
  
  optimization: {
    splitChunks: {
      
      chunks: "async", 
      minSize: 30000, 
      maxSize: 0, 
      minChunks: 1, 
      maxAsyncRequests: 5, 
      maxInitialRequests: 3, 
      automaticNameDelimiter: "~", 
      name: true, 
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, 
          priority: -10, 
        },
        default: {
          minChunks: 2, 
          priority: -20,
          reuseExistingChunk: true, 
        },
      },
    },
  },
};
复制代码
```

其中五个属性是控制代码分割规则的关键，我再额外提一提：

-   minSize(默认 30000)：使得比这个值大的模块才会被提取。
-   minChunks（默认 1）：用于界定至少重复多少次的模块才会被提取。
-   maxInitialRequests（默认 3）：一个代码块最终就会对应一个请求数，所以该属性决定入口最多分成的代码块数量，太小的值会使你无论怎么分割，都无法让入口的代码块变小。
-   maxAsyncRequests（默认 5）：同上，决定每次按需加载时，代码块的最大数量。
-   test：通过正则表达式精准匹配要提取的模块，可以根据项目结构制定各种规则，是手动优化的关键。

这些规则一旦制定，只有全部满足的模块才会被提取，所以需要根据项目情况合理配置才能达到满意的优化结果。

## 宝藏属性 Name

name（默认为 true），用来决定缓存组打包得到的 chunk 名称，容易被轻视但作用很大。奇特的是它有两种类型取值，boolean 和 string：

-   值为 true 的时候，webpack 会基于代码块和缓存组的 key 自动选择一个名称，这样一个缓存组会打包出多个 chunk。
-   值为 false 时，适合生产模式使用，webpack 会避免对 chunk 进行不必要的命名，以减小打包体积，除了入口 chunk 外，其他 chunk 的名称都由 id 决定，所以最终看到的打包结果是一排数字命名的 js，这也是为啥我们看线上网页请求的资源，总会掺杂一些 0.js，1.js 之类的文件(当然，使资源名为数字 id 的方式不止这一种，懒加载也能轻松办到，且看下文)。
-   值为 string 时，缓存组最终会打包成一个 chunk，名称就是该 string。此外，当两个缓存组 name 一样，最终会打包在一个 chunk 中。你甚至可以把它设为一个入口的名称，从而将这个入口会移除。

## 一个实例玩转各种场景

该上手撸代码了。webpack 默认优化策略对普通规模的项目已然足够，然而大厂的项目几经转手通常错综复杂，这时就需要手动优化了。下面我们通过一个有一定结构复杂度的实例来玩转 SplitChunksPlugin，当前版本的 webpack 是 4.43.0，项目结构如下：

```
|--node_modules/
|   |--vendor1.js
|   |--vendor2.js
|--pageA.js
|--pageB.js
|--pageC.js
|--utility1.js
|--utility2.js
|--utility3.js
|--webpack.config.js
复制代码
```

vendor1.js:

```
export default () => {
  console.log("vendor1");
};
复制代码
```

vendor2.js:

```
export default () => {
  console.log("vendor2");
};
复制代码
```

pageA.js:

```
import vendor1 from "vendor1";
import utility1 from "./utility1";
import utility2 from "./utility2";

export default () => {
  console.log("pageA");
};
复制代码
```

pageB.js:

```
import vendor2 from "vendor2";
import utility2 from "./utility2";
import utility3 from "./utility3";

export default () => {
  console.log("pageB");
};
复制代码
```

pageC.js:

```
import utility2 from "./utility2";
import utility3 from "./utility3";

export default () => {
  console.log("pageC");
};
复制代码
```

utility1.js:

```
import utility2 from "./utility2";

export default () => {
  console.log("utility1");
};
复制代码
```

utility2.js:

```
export default () => {
  console.log("utility2");
};
复制代码
```

utility3.js:

```
export default () => {
  console.log("utility3");
};
复制代码
```

每个文件内容并不多，关键在于它们的引用关系。webpack.config.js 配置如下：

```
var path = require("path");

module.exports = {
  mode: "development",
  
  entry: {
    pageA: "./pageA",
    pageB: "./pageB",
    pageC: "./pageC",
  },
  optimization: {
    chunkIds: "named", 
    splitChunks: {
      minSize: 0, 
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 3, 
        },
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
        },
      },
    },
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
};
复制代码
```

控制台运行：webpack，打包结果： ![初始运行结果](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08eb8abc60974b83b9aa9c4bd5ab6113~tplv-k3u1fbpfcp-watermark.awebp "初始运行结果") 可以看到，splitChunks 全局设置了 minSize=0，所有模块都符合这个条件。缓存组 vendor 通过 test 正则匹配了 node\_modules 的内容，打包到一个代码块 vendor.js 中；utility2.js 在 pageA，pageB，pageC 中都被引用，符合 commons 缓存组 minChunks=2 的规则，所以单独打包到 commonspageApageBpageC.js 中。然而 utility3.js 也在 pageB.js，pageC.js 中被引用，符合 commons 的条件，却依然分散在了 pageB 和 pageC 两个 chunk 中，怎么回事？我们观察输出信息发现 pageB 入口需要加载 commonspageApageBpageC.js vendor.js pageB.js 这三个包，而我们 commons 的规则里 maxInitialRequests 为 3，入口分包数量达到了上限，很可能是上限太小导致无法继续分包，所以我们修改 commons 的规则，将 maxInitialRequests 增加到 5：

```
commons: {
  chunks: "initial",
  minChunks: 2,
  maxInitialRequests: 5, 
},
复制代码
```

再次打包，结果为： ![maxInitialRequests=5](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/709c45850ffd48b5a6ecf2bdc0f1fa67~tplv-k3u1fbpfcp-watermark.awebp "maxInitialRequests=5") 这次 utility3.js 被单独打包为 commonspageBpageC，同时 pageB 入口变为了四个包：commonspageApageBpageC.js，vendor.js commonspageB~pageC.js，pageB.js。所以，当我们发现怎么修改规则某些模块就是提取不出，可以看看是不是打包数到达了上限，去检查 maxInitialRequests 和 maxAsyncRequests 这两个属性，maxAsyncRequests 和 maxInitialRequests 一样，只不过决定的是按需加载的分包上限。

我们继续研究，不禁产生疑问：为什么缓存组 commons 产出 commonspageApageBpageC.js 和 commonspageB~pageC.js，而缓存组 vendor 产出 vendor.js？包名格式相差巨大。这就是 name 属性在起作用，我们注释掉 vendor 中的 name：

```
vendor: {
  test: /node_modules/,
  chunks: "initial",
  
}
复制代码
```

打包结果如下： ![vendor不加name](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44630054dab04238b40503ec4761bbc2~tplv-k3u1fbpfcp-watermark.awebp "vendor不加name") 发现原本的 vendor.js 分裂成了 vendorpageA.js 和 vendorpageB.js，回想上一节 name 的特性，正是因为我们没有制定 name 的具体内容，默认为 true，所以 webpack 会基于代码块和缓存组的 key 自动选择一个名称，这样一个缓存组会打包出多个 chunk。然后我们再体验下 name 为 false 的感受：

```
splitChunks: {
  minSize: 0,
  name:false,
  cacheGroups: {
    commons: {
      chunks: "initial",
      minChunks: 2,
      maxInitialRequests: 5, 
    },
    vendor: {
      test: /node_modules/,
      chunks: "initial",
      name: "vendor",
    }
  }
}
复制代码
```

打包结果如下： ![name为false](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65d0c4c821874bbbbc5289fc7e320f6b~tplv-k3u1fbpfcp-watermark.awebp "name为false") 缓存组 commons 产出的两个 chunk 变成了 0.js 和 1.js，体积也减少了差不多 20 字节，也算一种优化方式了。

## 加点料，按需加载

上面的实例都是针对入口文件的优化，现在混入按需加载代码，看看会给我们的优化带来什么新体验。项目中加入两个懒加载文件，async1.js 和 async2.js：

```
|--node_modules/
|   |--vendor1.js
|   |--vendor2.js
|--pageA.js
|--pageB.js
|--pageC.js
|--utility1.js
|--utility2.js
|--utility3.js
|--async1.js
|--async2.js
|--webpack.config.js
复制代码
```

async1.js 代码：

```
import utility1 from "./utility1";

export default () => {
  console.log("async1");
};
复制代码
```

async2.js 代码：

```
import utility1 from "./utility1";

export default () => {
  console.log("async1");
};
复制代码
```

pageA.js 更新为：

```
import vendor1 from "vendor1";
import utility1 from "./utility1";
import utility2 from "./utility2";

export default () => {
  
  import("./async1");
  import("./async2");
  console.log("pageA");
};
复制代码
```

webpack.config.js 配置为：

```
var path = require("path");

module.exports = {
  mode: "development",
  
  entry: {
    pageA: "./pageA",
    pageB: "./pageB",
    pageC: "./pageC",
  },
  optimization: {
    chunkIds: "named", 
    splitChunks: {
      minSize: 0, 
      
      cacheGroups: {
        commons: {
          chunks: "all", 
          
          minChunks: 2,
          maxInitialRequests: 5, 
        },
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
        },
      },
    },
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
};
复制代码
```

其他代码不变。现在项目文件又增加了，直接 webpack 打包输出的信息可能不太够用，我们执行：webpack --display-chunks，具体获知每个 chunk 包含哪些包含哪些模块，属于哪个缓存组，这样就可以根据 chunk 的具体信息，判断是否有重复模块没提取干净，是否有一些模块明没有命中我们想要的规则，如果有，代表还有继续优化的空间。打包结果如下： ![按需加载1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b76b32e88cfe4c2397579212914c7a3a~tplv-k3u1fbpfcp-watermark.awebp "按需加载1") 那些命中缓存组的 chunk 都被标注了 split chunk 信息，入口 chunk 被标注了\[entry\]，而两个按需加载的文件被打包成 0.js 和 1.js，并不属于任何缓存组或入口。

观察结果我们发现，utility1.js 同时被 pageA.js，async1.js，async2.js 三个模块引用，照理应该命中 commons 缓存组的规则，从而被单独提取成一个 chunk，然而结果是它依然打包在 pageA.js 中。这是因为 async1.js，async2.js 都是 pageA.js 的懒加载模块，而 pageA.js 同步引用了 utility1.js，所以在加载 async1.js，async2.js 时 utility1.js 已经有了，直接拿来用即可，所以就没必要提出一个新的 chunk，白白增加一个请求。

那什么情况下 utility1.js 才会被单独提出来？我们调整代码，将按需加载代码从 pageA.js 移到 pageB.js：

pageA.js:

```
import vendor1 from "vendor1";
import utility1 from "./utility1";
import utility2 from "./utility2";

export default () => {
  
  
  
  console.log("pageA");
};
复制代码
```

pageB.js:

```
import vendor2 from "vendor2";
import utility2 from "./utility2";
import utility3 from "./utility3";

export default () => {
  
  import("./async1");
  import("./async2");
  console.log("pageB");
};
复制代码
```

执行 webpack --display-chunks，结果如下： ![按需加载2](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6323327c955f4445936fc7254e37aeac~tplv-k3u1fbpfcp-watermark.awebp "按需加载2") 发现多了一个 chunk，utility1.js 被单独提取到了 0.js 中，且属于 commons 缓存组。将按需加载代码从 pageA.js 移到 pageB.js 后，因为 pageB 和 pageA 并行，没有依赖关系，所以 async1.js 和 async2.js 需要单独加载 utility1.js 模块，又因为 commons 缓存组 chunks=all，所以 async1.js，async2.js 和 pageA.js 的公共模块 utility1.js 会被单独提取。

最后我们想把数字 id 名称变成有意义的名称，可以使用 webpack 的 magic comments，把 pageB.js 改为:

```
import vendor2 from "vendor2";
import utility2 from "./utility2";
import utility3 from "./utility3";

export default () => {
  
  import( "./async1");
  import( "./async2");
  console.log("pageB");
};
复制代码
```

普通打包即可，结果为： ![按需加载chunk命名](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f30c0e1fc1a4bc584b0e53fc97175a0~tplv-k3u1fbpfcp-watermark.awebp "按需加载chunk命名") 这样所有按需加载的 chunk 都有了名字，且单独提取的 utility1.js 也命中了默认命名格式，有了自己的名字。

这个实例运用了 webpack 两样主要优化手段，主要聚焦于如何让项目打包处在我们的掌控之中，不至于出现无法理解的打包情况，最终得到想要的打包结果。希望读完本文，大家面对再复杂的项目都能有优化入手点。

当然，优化本身是一件拆东补西的事，比如提取出一个公共 chunk，打包产出的文件就会多一个，也必然会增加一个网络请求。当项目很庞大，每个公共模块单独提取成一个 chunk 会导致打包速度出奇的慢，影响开发体验，所以通常会取折衷方案，将重复的较大模块单独提取，而将一些重复的小模块打包到一个 chunk，以减少包数量，同时不能让这个包太大，否则会影响页面加载时间。

在淘宝研究了一段时间打包的事儿，把我的心得分享给大家：优化就是在有限的时间空间和算力下，去除低效的重复（提出公共大模块），进行合理的冗余（小文件允许重复），并利用一些用户无感知的区间（预加载），达到时间和空间综合考量上的最优。

下一期，一起走进 SplitChunksPlugin 源码，条分缕析 webpack 的代码分割原理。 没多少人吧，趁机立个flag：点赞超50，一周内直接SplitChunksPlugin源码撕出来。

\--- 分割线 ---

flag拔完了，大家请看本系列第二篇：[妈妈再也不用担心我的优化｜Webpack系列（二）：SplitChunksPlugin源码讲解](https://juejin.cn/post/6844904196790026253 "https://juejin.cn/post/6844904196790026253")

[我的代码分割实例](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fxiekailian%2Fwebpack-examples%2Ftree%2Fmaster%2Fcommon-chunk-and-vendor-chunk "https://github.com/xiekailian/webpack-examples/tree/master/common-chunk-and-vendor-chunk")

[webpack 官网](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Fplugins%2Fsplit-chunks-plugin%2F "https://webpack.docschina.org/plugins/split-chunks-plugin/")

[官方 demo](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fwebpack%2Fwebpack%2Ftree%2Fmaster%2Fexamples "https://github.com/webpack/webpack/tree/master/examples")

总结与思考：

-   [献祭体重，拥抱技术，干货和鸡汤我都有｜2020年中总结](https://juejin.cn/post/6847902222865399822 "https://juejin.cn/post/6847902222865399822")

面经加答案：

-   [科班小前端的大厂面经](https://juejin.cn/post/6844904110144258056 "https://juejin.cn/post/6844904110144258056")

CSS 细节：

-   [面试官想知道你多了解 position:absolute](https://juejin.cn/post/6844904106763485197 "https://juejin.cn/post/6844904106763485197")

写给找不到方向的同学

-   [后端转前端的小老弟突然收割大厂offer，真相竟然是](https://juejin.cn/post/6844904121376440334 "https://juejin.cn/post/6844904121376440334")