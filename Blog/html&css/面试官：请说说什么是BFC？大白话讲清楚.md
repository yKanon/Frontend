`转载: https://juejin.cn/post/6950082193632788493`

## BFC 到底是什么东西

`BFC` 全称：`Block Formatting Context`， 名为 "块级格式化上下文"。

`W3C`官方解释为：`BFC`它决定了元素如何对其内容进行定位，以及与其它元素的关系和相互作用，当涉及到可视化布局时，`Block Formatting Context`提供了一个环境，`HTML`在这个环境中按照一定的规则进行布局。

简单来说就是，`BFC`是一个完全独立的空间（布局环境），让空间里的子元素不会影响到外面的布局。那么怎么使用`BFC`呢，`BFC`可以看做是一个`CSS`元素属性

## 怎样触发 BFC

这里简单列举几个触发`BFC`使用的`CSS`属性

- overflow: hidden
- display: inline-block
- position: absolute
- position: fixed
- display: table-cell
- display: flex

## BFC 的规则

- `BFC`就是一个块级元素，块级元素会在垂直方向一个接一个的排列
- `BFC`就是页面中的一个隔离的独立容器，容器里的标签不会影响到外部标签
- 垂直方向的距离由 margin 决定， 属于同一个`BFC`的两个相邻的标签外边距会发生重叠
- 计算`BFC`的高度时，浮动元素也参与计算

## BFC 解决了什么问题

### 1.使用 Float 脱离文档流，高度塌陷

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>高度塌陷</title>
    <style>
        .box {
            margin: 100px;
            width: 100px;
            height: 100px;
            background: red;
            float: left;
        }
        .container {
            background: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box"></div>
        <div class="box"></div>
    </div>
</body>
</html>
复制代码
```

**效果：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d86802070eda44a5a3c84c8ae1469e12~tplv-k3u1fbpfcp-watermark.awebp)

可以看到上面效果给`box`设置完`float`结果脱离文档流，使`container`高度没有被撑开，从而背景颜色没有颜色出来，解决此问题可以给`container`触发`BFC`，上面我们所说到的触发`BFC`属性都可以设置。

**修改代码**

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>高度塌陷</title>
    <style>
        .box {
            margin: 100px;
            width: 100px;
            height: 100px;
            background: red;
            float: left;
        }
        .container {
            background: #000;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box"></div>
        <div class="box"></div>
    </div>
</body>
</html>
复制代码
```

**效果：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d6c78771f5b4fbca1aad10797cd9777~tplv-k3u1fbpfcp-watermark.awebp)

### 2.Margin 边距重叠

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .box {
            margin: 10px;
            width: 100px;
            height: 100px;
            background: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box"></div>
        <div class="box"></div>
    </div>
</body>
</html>
复制代码
```

**效果：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9205525816724ed792539197e22ac098~tplv-k3u1fbpfcp-watermark.awebp)

可以看到上面我们为两个盒子的`margin`外边距设置的是`10px`，可结果显示两个盒子之间只有`10px`的距离，这就导致了`margin`塌陷问题，这时`margin`边距的结果为最大值，而不是合，为了解决此问题可以使用`BFC`规则（为元素包裹一个盒子形成一个完全独立的空间，做到里面元素不受外面布局影响），或者简单粗暴方法一个设置`margin`，一个设置`padding`。

**修改代码**

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Margin边距重叠</title>
    <style>
        .box {
            margin: 10px;
            width: 100px;
            height: 100px;
            background: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box"></div>
        <p><div class="box"></div></p>
    </div>
</body>
</html>
复制代码
```

**效果：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de9617862fc14c07b4c94d14c21760c8~tplv-k3u1fbpfcp-watermark.awebp)

### 3.两栏布局

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>两栏布局</title>
    <style>
            div {
                 width: 200px;
                 height: 100px;
                 border: 1px solid red;
            }

    </style>
</head>
<body>
    <div style="float: left;">
        两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局
    </div>
    <div style="width: 300px;">
        我是蛙人，如有帮助请点个赞叭，如有帮助请点个赞叭，如有帮助请点个赞叭，如有帮助请点个赞叭，如有帮助请点个赞叭，如有帮助请点个赞叭
    </div>
</body>
</html>
复制代码
```

**效果：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8224273e52044717820a99cf471b8527~tplv-k3u1fbpfcp-watermark.awebp)

可以看到上面元素，第二个`div`元素为`300px`宽度，但是被第一个`div`元素设置`Float`脱离文档流给覆盖上去了，解决此方法我们可以把第二个`div`元素设置为一个`BFC`。

**修改代码**

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>两栏布局</title>
    <style>
            div {
                 width: 200px;
                 height: 100px;
                 border: 1px solid red;
            }

    </style>
</head>
<body>
    <div style="float: left;">
        两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局
    </div>
    <div style="width: 300px;display:flex;">
        我是蛙人，如有帮助请点个赞叭，如有帮助请点个赞叭，如有帮助请点个赞叭，如有帮助请点个赞叭，如有帮助请点个赞叭，如有帮助请点个赞叭
    </div>
</body>
</html>
复制代码
```

**效果：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1d259e81b5f4868a8d37570cc523121~tplv-k3u1fbpfcp-watermark.awebp)

## 结语

谢谢你读完本篇文章，希望对你能有所帮助，如有问题欢迎各位指正。

我是蛙人(✿◡‿◡)，如果觉得写得可以的话，请点个赞吧 ❤。

感兴趣的小伙伴可以加入 [\[ 前端娱乐圈交流群 \]](https://link.juejin.cn/?target=https%3A%2F%2Fqinzhiying.github.io 'https://qinzhiying.github.io') 欢迎大家一起来交流讨论

写作不易，**「点赞」+「在看」+「转发」** 谢谢支持 ❤

## 往期好文

[《分享 15 个 Webpack 实用的插件！！！》](https://juejin.cn/post/6944940506862485511 'https://juejin.cn/post/6944940506862485511')

[《手把手教你写一个 Vue 组件发布到 npm 且可外链引入使用》](https://juejin.cn/post/6943793273395740680 'https://juejin.cn/post/6943793273395740680')

[《分享 12 个 Webpack 中常用的 Loader》](https://juejin.cn/post/6942322281913778206 'https://juejin.cn/post/6942322281913778206')

[《聊聊什么是 CommonJs 和 Es Module 及它们的区别》](https://juejin.cn/post/6938581764432461854 'https://juejin.cn/post/6938581764432461854')

[《带你轻松理解数据结构之 Map》](https://juejin.cn/post/6937855370220011551 'https://juejin.cn/post/6937855370220011551')

[《这些工作中用到的 JavaScript 小技巧你都知道吗？》](https://juejin.cn/post/6937092511508725774 'https://juejin.cn/post/6937092511508725774')

[《【建议收藏】分享一些工作中常用的 Git 命令及特殊问题场景怎么解决》](https://juejin.cn/post/6934487656873082887 'https://juejin.cn/post/6934487656873082887')

## 参考

[blog.csdn.net/weixin_4321…](https://link.juejin.cn/?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_43213962%2Farticle%2Fdetails%2F105959869 'https://blog.csdn.net/weixin_43213962/article/details/105959869')

[blog.csdn.net/sinat_36422…](https://link.juejin.cn/?target=https%3A%2F%2Fblog.csdn.net%2Fsinat_36422236%2Farticle%2Fdetails%2F88763187 'https://blog.csdn.net/sinat_36422236/article/details/88763187')
