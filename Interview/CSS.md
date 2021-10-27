### 1. 介绍一下标准的 CSS 盒子模型，低版本的 IE 盒子模型有什么不同？

盒子模型都是由四部分组成的：content、padding、border、margin

* 标准盒模型：属性 width、height 只包含 content。不包含 padding、border
* IE 盒模型：width、height 包含了 content、padding 和 border

> 现在默认为 content-box （标准）。可以通过 box-sizing 属性更改



### 2. CSS 中哪些属性可以继承？

1. 字体系列属性

   font、font-family、font-weight、font-size、font-style

2. 文本系列属性

   text-align、line-height、color

3. 列表属性

   list-style

4. 光标属性

   cursor

5. 元素可见性

   visibility

> 任何属性都可以通过 inherit 关键字显示继承



### 3. 如何居中 div？

* 对于宽高固定的元素

  * 利用 margin： 0 auto；实现元素水平居中
  * 绝对定位。四个方向设为0，margin 设为 auto。由于宽高固定，可以实现水平和垂直方向的居中
  * 绝对定位。top、left： 50%，通过 margin 设置宽高一半的负数值来定位中心
  * ！绝对定位。top、left： 50%，通过 translateX（-50%）translateY（-50%）  来调整元素
  * ！flex。通过align-item：center；和 justify-content：centfanger；设置容器垂直和水平方向上的居中对齐。

  > 对于宽高不定的元素，后面两种方法，依然可以实现垂直和水平的居中



### 4. 请解释一下 CSS3 的 Flexbox （弹性盒布局模型），以及适用场景？

可以将一个元素设置display：flex；让它成为一个flex容器。它的所有子元素都会成为它的项目。

* 容器属性
  * flex-direction
  * flex-wrap
  * justify-content
  * align-items
  * flex-flow
  * align-content
* 项目属性
  * order
  * flex
  * flex-grow
  * flex-shrink
  * flex-basis
  * align-self



### 5. 用純 CSS 創建一個三角形的原理是什麽？

相鄰邊框連接處的均分原理。

寬高為0，只設置border。將三條邊顔色設爲透明，剩下的就是一個三角形了。

#el {

​	width: 0;

​	height: 0;

​	border: 20px solid transparent;

​	border-top-color: red;

}



### 6. 对 BFC 规范（块级格式化上下文：Block Formatting Context）的理解？

bfc 指的是块级格式化上下文，**一个独立的布局环境**，一个元素形成 bfc 后。相当于产生一个隔离区域，和其他的区域互不影响。

* 一般来说，根元素是一个 BFC 区域；
* 浮动、绝对定位的元素也会形成 BFC，
* display：flex、inline-block；
* 元素的 overflow 值不为 visible 时都会创建 BFC



### 7. 简单介绍使用图片 base64 编码的优点和缺点。

base64 时一种图片处理格式，通过算法将图片编码成一个长的字符串。显示的时候，用字符串代替图片的url属性。一般只将小图标或小图片转为base64

* 优点
  * 减少一个图片的 HTTP 请求
* 缺点
  * 编码后的大小会比源文件大1/3。如果将大图片进行编码，会造成文件体积增加，影响文件的加载速度，增加浏览器对html和css文件解析渲染的时间。
  * base64 无法直接缓存，只能缓存包含base64的文件。这个比直接缓存图片效果要差很多
  * ie8 以前的浏览器不支持



### 8.  CSS 优化、提高性能的方法有哪些？

* 加载性能
  * css 压缩：将写好的 css 进行打包压缩，可以减少很多的体积
  * css 单一样式。e.g. margin-bottom：0，margin-left： 0；执行效率更高
  * 减少使用 @import， 而建议使用link。link 在页面加载的时候一起加载，@import 在页面加载完成之后进行加载。
* 选择器性能
  * 关键选择器。选择器最后面的部分称为关键选择器（用来匹配目标元素的部分）；css 选择符是从右到左进行匹配的，当使用后代选择器的时候，浏览器会遍历所有子元素来确定是否是指定的元素等等
  * 如果规则有 ID 选择器作为关键选择器，就不要为规则添加多余的标签了，过滤掉无关的规则
  * 避免使用通配规则*{}。计算次数惊人，对需要用到的元素进行选择
  * 尽量少的对标签进行选择，多用 class
  * 少用后代选择器，降低选择器权重值。尽量降低选择器的深度，不要超过三层，多用 class 关联每一个标签元素
* 渲染性能
  * 减少页面的重绘、重排
  * 慎重使用高性能属性：浮动、定位
  * 去除空规则：{}
  * 0不加单位
  * 浮动小数 0.***。 可以省略 0
  * 带浏览器前缀的属性在前，标准属性在后
  * 不使用@import，会影响 css 加载速度
  * 页面相近部分的小图标，可以考虑雪碧图
  * 正确使用display。由于display的作用，某些样式组合会无效，徒增样式体积的同时页影响解析性能
* 可维护性，健壮性
  * 相同属性抽离，整合通过 class 在页面进行引用，提高 css  的可维护性
  * 样式与内容分离。将 css 代码定义到外部css中



### 9. margin 和 padding 分别适合什么场景使用？

* margin
  * 不要背景色时
  * 需要在border外侧添加空白
  * 想要进行间距合并。如20px+15px，得到20px的间距
* padding
  * 需要背景色时
  * 需要在border内测添加空白
  * 不想要进行间距合并。如20px+15px，得到35px的间距



### 10. 元素竖向的百分比设定是相对于容器的高度吗？

如果是height的话，是相对于包含块的高度。

如果是padding或者margin，是相对于包含块的宽度。



### 11. 什么是响应式设计？响应式设计的基本原理是什么？

响应式网站设计是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。基本原理是通过媒体查询检测不同的设备屏幕做处理。页面头部必须有meta声明的viewport。



### 12. 视差滚动效果，如何给每页做不同的动画？

视差滚动是指多层背景以不同的速度移动，形成立体的运动效果，带来非常出色的视觉体验。

[ 《如何实现视差滚动效果的网页？》](https://www.zhihu.com/question/20990029)



### 13. 如何修改chrome记住密码后自动填充表单的背景色？

这个背景色是由chrome默认的样式设置的。

```css
input:-internal-autofill-selected {
    appearance: menulist-button;
    background-color: rgb(232, 240, 254) !important;
    background-image: none !important;
    color: -internal-light-dark(black, white) !important;
}
```

默认样式加了！import。不能修改。只能求变，使用内阴影来覆盖输入框的背景色。

```css
input:-webkit-autofill,textarea:-webkit-autofill,select:-webkit-autofill{
	-webkit-box-shadow:0 0 0px 1000px white inset;
	border:1px solid #CCC !important;
}
```



### 14. 什么是Cookie隔离？（请求资源的时候不要让它带cookie怎么做）

跨域请求的时候，请求头中就不会带有cookie。这样可以降低请求头的大小，降低请求时间，从而达到降低整体请求延时的目的。

同时这种方式不会将cookie传入WebServer，也减少了WebServer对cookie的处理分析环节，提高了webserver的http请求的解析速度。



### 15. style标签写在body后与body前有什么区别？

页面加载自上而下当然是先加载样式。写在body标签后，由于浏览器以逐行方式对html文档进行解析，当解析到卸载尾部的 样式表时，会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染，在window的IE下可能会出现FOUC现象（样式失效导致的页面闪烁问题）



### 16. 什么时css预处理器/后处理器？

* 是一种专门的编程语言，为CSS添加一些编程的特性。然后编译成css文件供浏览器使用。

  e.g. less、sass、stylus

* 后处理器是对css进行处理，最终生成的还是css。一般由于处理css兼容性的问题

  e.g. autofixer、PostCSS



### 17. 阐述一下CSS-Sprites

将一个页面涉及到的小图片包含到一个大图去。通过背景进行定位显示。

* 优点
  * 可以减少http请求数，极大的提高页面加载速度
  * 减少图片字节
* 缺点
  * 图片合并麻烦
  * 维护麻烦，修改一个图片可能需要重新布局整个大图片



### 18. 使用rem布局的优缺点？

* 优点
  * 因为屏幕分辨率存在多样性，rem可以实现整体页面的缩放，使得设备的展现效果统一
  * 现代浏览器基本都支持rem。兼容性很好
* 缺点
  * 在奇葩的dpr设备上效果不好。比如华为的高端机型
  * 在iframe上用也会出现问题



### 19. 几种常见的css布局

[《几种常见的 CSS 布局》](https://juejin.im/post/6844903710070407182) 



### 20. transition和animation的区别

transition关注的是css-property的变化。property值和时间的关系是一个三次贝塞尔曲线。

animation作用于元素本身而不是样式属性，可以实现帧动画，更加自由。



### 21. 什么是首选最小宽度？

指的是，元素最适合的最小宽度。

如中文最小宽度为每个汉字的宽度。

如英语的最小宽度由最小字符的英语单词决定。一般会终止于空格、短横线、问号和其他的非英文字符等。

e.g. 提示框组件中。长单词不会换行，导致单词溢出提示框。可以试试word-break属性



### 22. 为社么height：100%会无效

对于普通文档流中的元素，百分比高度值想要起作用，其父级必须有一个可以生效的高度值。

如果包含块的高度没有显式指定（高度有内容决定），并且该元素不是绝对定位元素，则计算值为auto，所以无法参与计算；使用绝对定位的元素会有计算值，即使祖先元素的height计算为auto也是如此。



### 23. min-width/max-width 和 和 min-height/max-height 属 性 间 的 覆 盖 规则？

1. min-width > max-width，当这两个属性发生冲突时
2. max-width > width，即使width是行内样式或是设置了！important



### 24. margin：auto的填充规则

触发margin：auto有一个前提条件，就是width或height为auto。这样，这个元素才具有某一方向上的自动填充特性。

1. 如果一侧定值，一侧auto，则auto为剩余空间大小
2. 如果两侧auto，则平分剩余空间



### 25. margin无效的情形

1. 表格中的tr和td元素，或者设置了display：table-cell|table-row的元素。margin无效
2. 绝对定位元素非定位方位的margin值无效
3. 定高容器的子元素的margin-bottom失效
4. 宽度定死的子元素的margin-right的失效
5. display：inline；又是非替换元素的垂直margin无效。对于内联替换元素，垂直margin有效，并且没有margin合并问题。



### 26. 如何实现单行/多行文本溢出的省略？

```css
/*单行文本溢出*/
p {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
/*多行文本溢出*/
p {
	position: relative;
	line-height: 1.5em;
	/*高度为需要显示的行数*行高，比如这里我们显示两行，则为 3*/
	height: 3em;
	overflow: hidden;
}
p:after {
	content: "...";
	position: absolute;
	bottom: 0;
	right: 0;
	background-color: #fff;
}
```



### 27. 常见的元素隐藏方式？

（1）使用 display:none;隐藏元素，渲染树不会包含该渲染对象，因此该元素不会在页面中
占据位置，也不会响应绑定的监听事件。
-（2）使用 visibility:hidden;隐藏元素。元素在页面中仍占据空间，但是不会响应绑定的监听
事件。
-（3）使用 opacity:0;将元素的透明度设置为 0，以此来实现元素的隐藏。元素在页面中仍
然占据空间，并且能够响应元素绑定的监听事件。
-（4）通过使用绝对定位将元素移除可视区域内，以此来实现元素的隐藏。
-（5）通过 z-index 负值，来使其他元素遮盖住该元素，以此来实现隐藏。
-（6）通过 clip/clip-path 元素裁剪的方法来实现元素的隐藏，这种方法下，元素仍在页面
中占据位置，但是不会响应绑定的监听事件。
-（7）通过 transform:scale(0,0)来将元素缩放为 0，以此来实现元素的隐藏。这种方法下，
元素仍在页面中占据位置，但是不会响应绑定的监听事件。



### 28. css实现上下固定中间自适应布局？

```css
利用 flex 布局实现 
html,
body {
	height: 100%;
}
body {
	display: flex;
	padding: 0;
	margin: 0;
	flex-direction: column;
}
.header {
	height: 100px;
	background: red;
}
.container {
	flex-grow: 1;
	background: green;
}
.footer {
	height: 100px;
	background: red;
}
```



### 29. css两栏布局的实现？

```css
利用 flex 布局，将左边元素的放大和缩小比例设置为 0，基础大小设置为
200px。将右边的元素的放大比例设置为 1，缩小比例设置为 1，基础大小设置为 auto。*/
.outer {
	display: flex;
	height: 100px;
}
.left {
	flex-shrink: 0;
	flex-grow: 0;
	flex-basis: 200px;
	background: tomato;
}
.right {
	flex: auto;
	/*1 1 auto*/
	background: gold;
}
```

[《两栏布局demo展示》](http://cavszhouyou.top/Demo-Display/TwoColumnLayout/index.html)



### 30. 三栏布局的实现？

[《三栏布局demo展示》](http://cavszhouyou.top/Demo-Display/ThreeColumnLayout/index.html)

```css
利用 flex 布局的方式，左右两栏的放大和缩小比例都设置为 0，基础大小设置为固
定的大小，中间一栏设置为 auto*/
.outer {
display: flex;
height: 100px;
}
.left {
	flex: 0 0 100px;
	background: tomato;
}
.right {
	flex: 0 0 200px;
	background: gold;
}
.center {
	flex: auto;
	background: lightgreen;
}
```



### 31. 实现一个宽高自适应的正方形

```css
/*1.第一种方式是利用 vw 来实现*/
.square {
	width: 10%;
	height: 10vw;
	background: tomato;
}
/*2.第二种方式是利用元素的 margin/padding 百分比是相对父元素 width 的性质来实现*/
.square {
	width: 20%;
	height: 0;
	padding-top: 20%;
	background: orange;
}
/*3.第三种方式是利用子元素的 margin-top 的值来实现的*/
.square {
	width: 30%;
	overflow: hidden;
	background: yellow;
}
.square::after {
	content: "";
	display: block;
	margin-top: 100%;
}
```



[自适应正方形demo](http://cavszhouyou.top/Demo-Display/AdaptiveSquare/index.html)



### 32. 实现一个三角形

```css
/*三角形的实现原理是利用了元素边框连接处的等分原理。*/
.triangle {
	width: 0;
	height: 0;
	border-width: 100px;
	border-style: solid;
	border-color: tomato transparent transparent transparent;
}
```

[《三角形demo演示》](http://cavszhouyou.top/Demo-Display/Triangle/index.html)

