`转载: https://juejin.cn/post/6844903606466904078`

## JS 是单线程的

JS 是单线程的，或者说只有一个主线程，也就是它一次只能执行一段代码。JS 中其实是没有线程概念的，所谓的单线程也只是相对于多线程而言。JS 的设计初衷就没有考虑这些，针对 JS 这种不具备并行任务处理的特性，我们称之为“单线程”。

虽然 JS 运行在浏览器中是单线程的，但是浏览器是事件驱动的（Event driven），浏览器中很多行为是异步（Asynchronized）的，会创建事件并放入执行队列中。浏览器中很多异步行为都是由浏览器新开一个线程去完成，一个浏览器至少实现三个常驻线程：

- JS 引擎线程
- GUI 渲染线程
- 事件触发线程

## JS 引擎

JavaScript 引擎是一个专门处理 JavaScript 脚本的虚拟机，一般会附带在网页浏览器之中，比如最出名的就是 Chrome 浏览器的 V8 引擎，如下图所示，JS 引擎主要有两个组件构成：

- 堆-内存分配发生的地方
- 栈-函数调用时会形一个个栈帧（frame）

  ![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/16/163677dd80f490c4~tplv-t2oaga2asx-watermark.awebp)

## 执行栈

每一个函数执行的时候，都会生成新的 execution context（执行上下文），执行上下文会包含一些当前函数的参数、局部变量之类的信息，它会被推入栈中， running execution context（正在执行的上下文）始终处于栈的顶部。当函数执行完后，它的执行上下文会从栈弹出。

![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/16/163677dd815e80e6~tplv-t2oaga2asx-watermark.awebp)

举个简单的例子：

```
function bar() {
console.log('bar');
}

function foo() {
console.log('foo');
bar();
}

foo();
复制代码
```

执行过程中栈的变化：

![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/16/163677dd816c8e88~tplv-t2oaga2asx-watermark.awebp)

## event loop(事件循环)

Wikipedia 这样定义:

> "Event Loop 是一个程序结构，用于等待和发送消息和事件。（a programming construct that waits for and dispatches events or messages in a program.）"

简单说，就是在程序中设置两个线程：一个负责程序本身的运行，称为"主线程"；另一个负责主线程与其他进程（主要是各种 I/O 操作）的通信，被称为"Event Loop 线程"（可以译为"消息线程"）。

![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/16/163677dda920b2af~tplv-t2oaga2asx-watermark.awebp)

## 事件循环与任务队列

事件循环可以简单描述为：

1.  函数入栈，当 Stack 中执行到异步任务的时候，就将他丢给 WebAPIs,接着执行同步任务,直到 Stack 为空;
2.  在此期间 WebAPIs 完成这个事件，把回调函数放入 CallbackQueue 中等待;
3.  当执行栈为空时，Event Loop 把 Callback Queue 中的一个任务放入 Stack 中,回到第 1 步。

    ![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/16/163677dd81721ac8~tplv-t2oaga2asx-watermark.awebp)

- Event Loop 是由 javascript 宿主环境（像浏览器）来实现的;
- WebAPIs 是由 C++实现的浏览器创建的线程，处理诸如 DOM 事件、http 请求、定时器等异步事件;
- JavaScript 的并发模型基于"事件循环";
- Callback Queue(Event Queue 或者 Message Queue) 任务队列,存放异步任务的回调函数

接下来看一个异步函数执行的例子：

```
var start=new Date();
setTimeout(function cb(){
    console.log("时间间隔：",new Date()-start+'ms');
},500);
while(new Date()-start<1000){};
复制代码
```

1.  main(Script) 函数入栈,start 变量开始初始化
2.  setTimeout 入栈,出栈,丢给 WebAPIs,开始定时 500ms;
3.  while 循环入栈,开始阻塞 1000ms;
4.  500ms 过后,WebAPIs 把 cb()放入任务队列,此时 while 循环还在栈中,cb()等待;
5.  又过了 500ms,while 循环执行完毕从栈中弹出,main()弹出,此时栈为空,Event Loop,cb()进入栈,log()进栈,输出'时间间隔：1003ms',出栈,cb()出栈

## 宏任务(Macrotasks)和微任务(Microtasks)

其实我们上面所说的都是宏任务(Macrotasks)，但是 js 中还有一种队列微任务(Microtasks)。

macro-task(Task):一个 event loop 有一个或者多个 task 队列。task 任务源非常宽泛，比如 ajax 的 onload，click 事件，基本上我们经常绑定的各种事件都是 task 任务源，还有数据库操作（IndexedDB ），需要注意的是 setTimeout、setInterval、setImmediate 也是 task 任务源。总结来说 task 任务源：

- setTimeout
- setInterval
- setImmediate
- I/O
- UI rendering

micro-task(Job):microtask 队列和 task 队列有些相似，都是先进先出的队列，由指定的任务源去提供任务，不同的是一个 event loop 里只有一个 microtask 队列。另外 microtask 执行时机和 Macrotasks 也有所差异

- process.nextTick
- promises
- Object.observe
- MutationObserver

那么 Macrotasks 和 Microtasks 有什么别区别呢  
举个简单的例子，假设一个 script 标签的代码如下：

```
Promise.resolve().then(function promise1 () {
       console.log('promise1');
    })
setTimeout(function setTimeout1 (){
    console.log('setTimeout1')
    Promise.resolve().then(function  promise2 () {
       console.log('promise2');
    })
}, 0)

setTimeout(function setTimeout2 (){
   console.log('setTimeout2')
}, 0)
复制代码
```

运行过程：

script 里的代码被列为一个 task，放入 task 队列。

#### 循环 1：

- 【task 队列：script ；microtask 队列：】

1.  从 task 队列中取出 script 任务，推入栈中执行。
2.  promise1 列为 microtask，setTimeout1 列为 task，setTimeout2 列为 task。

- 【task 队列：setTimeout1 setTimeout2；microtask 队列：promise1】

3.  script 任务执行完毕，执行 microtask checkpoint，取出 microtask 队列的 promise1 执行。

#### 循环 2：

\*【task 队列：setTimeout1 setTimeout2；microtask 队列：】 4. 从 task 队列中取出 setTimeout1，推入栈中执行，将 promise2 列为 microtask。

- 【task 队列：setTimeout2；microtask 队列：promise2】

5.  执行 microtask checkpoint，取出 microtask 队列的 promise2 执行。

#### 循环 3：

- 【task 队列：setTimeout2；microtask 队列：】

6.  从 task 队列中取出 setTimeout2，推入栈中执行。 7.setTimeout2 任务执行完毕，执行 microtask checkpoint。

- 【task 队列：；microtask 队列：】

![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/16/163677dd81bee55c~tplv-t2oaga2asx-watermark.awebp)

综上所说，每次 event loop 循环执行栈完成后，会继续执行完相应的 microtask 任务

## event loop 中的 Update the rendering（更新渲染）

这是 event loop 中很重要部分，在第 7 步会进行 Update the rendering（更新渲染），规范允许浏览器自己选择是否更新视图。也就是说可能不是每轮事件循环都去更新视图，只在有必要的时候才更新视图。
