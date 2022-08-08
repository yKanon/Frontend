## 摘要

开发中无论怎样都会产生网络请求，这样一来自然也就避免不了大量使用`then`、`catch`或`try catch`来捕获错误，而捕获错误的代码量是随着网络请求的增多而增多，那应该如何优雅的系统性捕获某个网络请求中所产生的所有错误呢？

首先最常用的两种处理网络请求的形式即`Promise`与`async`(事实上很多请求库都是基于这两者的封装)，使用`Promise`那必然要与`then`、`catch`挂钩，也就是说每个请求都对应一个`Promise`实例，然后通过该实例上对应的方法来完成对应的操作，这应该算是比较常用的一种形式了

但如果涉及嵌套请求，那可能还要不断的增加`then`、`catch`来完成需求，好了，现在可以使用看起来真的像同步编程的`async`来着手优化了，即`await promise`，那这种情况下就根本不需要手动`then`了，但如果`await promise`抛出了错误呢？那恐怕不得不让`try catch`来帮忙了，而如果也是嵌套请求，那与`Promise`写法类似的问题又来了，有多少次请求难道我就要多少次`try catch`吗？那这样看来的话，`Promise`与`async`在面对这种屎山请求的时候确实有点心有余而力不足了

## 前言

之所以写作本篇文章是因为前几天在优化数据库操作时，发现要不停`try catch`，且操作数据库的代码越多，则`try catch`就越多，于是突发奇想，能不能封装一个工具类来实现智能化捕获错误呢？在这种思维的推动下，我觉得这个工具类不仅仅是以一种创意的形式出现，更多的是实用性！(先不考虑这个创意能否实现)

## 一个令人头疼的需求

家在吉林的小明想去海南看望他的老奶奶，但小明觉得旅途如此之长，不如先去山东学习学习马保国老师的“**接化发**”，然后再去云南拍一个“**我是云南的 云南怒江的...**”的视频发一下朋友圈，最后再去海南看望老奶奶

请你运用所学知识帮帮小明，查询`吉林--山东--云南--海南`的车票还有吗？

-   如果有的话，老奶奶希望小明不要在车票上花费太多的钱，所以当小明出发时，需要告诉老奶奶`本次所有车票的开销是多少`
-   如果没有的话，请你务必告诉小明是哪里的车票没有了，因为小明`可能会换个路线`去找老奶奶

注意，当确定**吉林-山东**的车票未售空时才去查询**山东-云南**的车票是否已售空，并以此类推；因为这样的话，小明可以知道是哪个地方的车票没有了，并及时换乘

虽然**吉林--山东--云南--海南**的车票可以一次性查询完毕，但为了体现嵌套请求的复杂度，我们此处不讨论并发请求的情况，关于并发，你可以使用`Promise.all`

![flow_chart.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7536dc498d0444649278052ff0fc8ce7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

先来细化题目，可以看到路线依次为：**吉林-山东**、**山东-云南**、**云南-海南**，也就分别对应三个请求，且这三个请求又是嵌套发出的。而每次发出的请求，最终都会有两种情况：请求成功/失败，`请求成功则代表本轮次车票未售空`，`请求失败则代表本轮次车票已售空`

> 之所以请求失败对应车票已售空，是为了模拟请求失败的情况，而不是通过返回一个标识来代表本轮次车票是否已售空

这个令人头疼的需求，我建议你再认真读一遍

## 准备工作

为了简单起见，这里就不额外开启一台服务器了，转而使用定时器模拟异步任务

以下是用于查询车票的接口，我们称之为`请求函数`

> 在下文中所指的**请求函数**就是requestJS、requestSY、requestYH

```
// 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)
const interface = [true, true, true]

// 查询 吉林-山东 的车票是否已售空的接口
const requestJS = () => new Promise((res, rej) => {
    setTimeout(() => {
        // 请求成功(resolve)则代表车票未售空
        if (interface[0]) return res({ ticket: true, price: 530, destination: '吉林-山东' })
        // 请求成功(rejected)则代表车票已售空
        rej({ ticket: false, destination: '吉林-山东' })
    }, 1000)
})
// 查询 山东-云南 的车票是否已售空的接口
const requestSY = () => new Promise((res, rej) => {
    setTimeout(() => {
        if (interface[1]) return res({ ticket: true, price: 820, destination: '山东-云南' })
        rej({ ticket: false, destination: '山东-云南' })
    }, 1500)
})
// 查询 云南-海南 的车票是否已售空的接口
const requestYH = () => new Promise((res, rej) => {
    setTimeout(() => {
        if (interface[2]) return res({ ticket: true, price: 1500, destination: '云南-海南' })
        rej({ ticket: false, destination: '云南-海南' })
    }, 2000)
})
复制代码
```

## Promise

一定要避免重复造轮子，所以先用`Promise`实现一下，看看效果如何，然后再决定应该怎么操作

```
// 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)
const interface = [true, true, true]

// 先查询吉林到山东
requestJS()
    .then(({ price: p1 }) => {
        console.log(`吉林-山东的车票未售空，价格是 ${p1} RMB`)
        // 如果吉林-山东的车票未售空，则继续查询山东-云南的车票
        requestSY()
            .then(({ price: p2 }) => {
                console.log(`山东-云南的车票未售空，价格是 ${p2} RMB`)
                // 如果山东-云南的车票未售空，则继续查询云南-海南的车票
                requestYH()
                    .then(({ price: p3 }) => {
                        console.log(`云南-海南的车票未售空，价格是 ${p3} RMB`)
                        console.log(`本次旅途共计车费 ${p1 + p2 + p3} RMB`)
                    })
                    .catch(({ destination }) => {
                        console.log(`来晚了，${destination}的车票已售空`)
                    })
            })
            .catch(({ destination }) => {
                console.log(`来晚了，${destination}的车票已售空`)
            })
    })
    .catch(({ destination }) => {
        console.log(`来晚了，${destination}的车票已售空`)
    })
复制代码
```

测试结果如下

![promise1.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92f01a8591a4461bbefd3495262a9b18~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

不错，符合预期效果，现在来将**第二次请求**变为失败(即**山东-云南**请求失败)

```
// 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)
const interface = [true, false, true]
复制代码
```

现在再来看结果

![promise2.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0022c6ea55144248e67349ef7de658b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

依然符合预期效果，但这种方式嵌套的层级太多，一不小心就会成为屎山的必备条件，必须优化一下

由于`then`会在请求成功时触发，`catch`会在请求失败时触发，而无论是`then`或`catch`都会返回一个`Promise`实例(`return this`)，我们也正是借助这个特性来实现`then的链式调用`

如果`then`方法没有返回值，则默认返回一个成功的`Promise`实例，而下面代码则手动为`then`指定了其需要返回的`Promise`实例。无论其中哪个`Promise`的状态更改为失败，都会被最后一个`catch`所捕获

```
// 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)
const interface = [true, true, false]

let acc = 0
// 先查询吉林到山东
requestJS()
    .then(({ price: p1 }) => {
        acc += p1
        console.log(`吉林-山东的车票未售空，价格是 ${p1} RMB`)
        // 如果吉林-山东的车票未售空，则继续查询山东-云南的车票
        return requestSY()
    })
    .then(({ price: p2 }) => {
        acc += p2
        console.log(`山东-云南的车票未售空，价格是 ${p2} RMB`)
        // 如果山东-云南的车票未售空，则继续查询云南-海南的车票
        return requestYH()
    })
    .then(({ price: p3 }) => {
    // 能执行到这里，就说明前面所有请求都成功了
        acc += p3
        console.log(`云南-海南的车票未售空，价格是 ${p3} RMB`)
        console.log(`本次旅途共计车费 ${acc} RMB`)
    })
    .catch(({ destination }) => console.log(`来晚了，${destination}的车票已售空`))
复制代码
```

![promise3.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f3d461d854c49599b7a1a8d46ac9799~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

可以看到经过优化后的`Promise`已经把屎山磨平了一点，美中不足的就是如果想要计算总共花费的车费，那么需要在外部额外声明一个`acc`用来统计数据，其实这种情况可以对**请求车票数据的函数requestJS等**来和每次`then`的返回值进行简单包装，但在此处，我不想改动请求车票数据的函数体，至于为什么，我们继续往下看

## async

既然`Promise`都说了，也是时候把`async`这位老大哥请出来帮帮场子了，不多赘述，我们来看`async`会怎么处理这种嵌套请求

```
// 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)
const interface = [true, true, true]

const f = async () => {
    try {
        const js = await requestJS()
        console.log(`吉林-山东的车票未售空，价格是 ${js.price} RMB`)
        const sy = await requestSY()
        console.log(`山东-云南的车票未售空，价格是 ${sy.price} RMB`)
        const yh = await requestYH()
        console.log(`云南-海南的车票未售空，价格是 ${yh.price} RMB`)
        console.log(`本次旅途共计车费 ${js.price + sy.price + yh.price} RMB`)
    } catch ({ destination }) {
        console.log(`来晚了，${destination}的车票已售空`)
    }
}

f()
复制代码
```

![async1.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f054bf0bdfc4699bd2834169e62cb80~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

要么怎么称它为老大哥呢，不得不说，果然老练啊，基本不用怎么优化就已经磨平了一点屎山

其实`async`与上面`Promise`的第二种写法有异曲同工之妙，可以看做都是将所有成功的逻辑放在了一起，仅仅使用了一个`catch`便可以捕获所有错误，不得不说，真是妙蛙种子吃着妙脆角进了米奇妙妙屋，妙到家了

但，你以为今天的文章就到这了吗？大错特错，正是因为这种重复性`catch`，所以才会萌生出自己封装一个智能化捕获函数来处理这种情况。上面所讲到的`Promise`与`async`其实已经是很常见的一种写法了，但如果项目中存在第二种嵌套请求(比如先请求所在省份的天气，再请求所在县的天气)。如果放在`async`面前，我想它一定会使用两个`f`函数，一个为查询小明车票，一个为查询天气，那这就避免不了要写两个`try catch`了，文章开头我所说到的对数据库的操作大概就是这种困惑

现在来解开谜底，分享一下我是如何在**有想法--确定目标--开始实现--遇到问题--解决问题--达到目标**这种模式的推动下来一步一步完成的函数封装

> 如果你对上述Promise和async有更好的优化方式，请分享在评论区 期待你的最优解

## combine-async-error心路历程

要解决一个问题，首先要明白解决它的意义何在。在小明看望老奶奶这个问题中，我们正是被这种不停地`catch`所困惑，所以才要想出更好的办法去优化它。于是我就想着能不能**封装一个函数**来替我完成所有的`catch`操作呢？既然这种念头已经有了，那就开始动手实现

## 捡捡之前的知识

在封装之前，你必须要知道以下知识点

### try catch 不能捕获异步错误

```
// 可以捕获
try{
    throw ReferenceError('对象 is not defined')
}catch(e) {
    console.log(e)
}
复制代码
```

```
// 不可以捕获
try{
    setTimeout(() => {
throw ReferenceError('对象 is defined')
    })
}catch(e) {
    console.log(e)
}
复制代码
```

### Generator

你可以把`Generator`函数称作`生成器`，调用生成器函数会返回一个`迭代器`来控制这个生成器执行其代码，在生成器中你可以使用`yield`关键字，理论上`yield`可以出现在任何能求值的地方，我们通过迭代器的`next`方法来确保生成器始终是可控的

```
const f = function* () {
    console.log(1)
    // 注意yield只能出现在Gerenator函数中
    // 如果你将yield写在了回调里，请一定要确认这个回调是一个生成器函数
    yield
    console.log(2)
}
f().next()

// 1
复制代码
```

### async

`async`函数在执行时，遇到`await`会交出“线程”，转而去执行其它任务，且`await`总是会异步求值

```
const f = async () => {
    console.log(1)
    await '鲨鱼辣椒'
    console.log(3)
}
f()
console.log(2)

// 1 2 3
复制代码
```

> 如果你对上面几个题目还存在疑问，请在[《JavaScript每日一题》](https://juejin.cn/column/7095526138415415310 "https://juejin.cn/column/7095526138415415310")专栏中找到对应的题目进行练习

好了，现在开始由浅入深逐步分析

## 让await永远不要抛出错误

让`await`永远不要抛出错误，这也是最重要的前提

```
// getInfo为获取车票信息的功能函数
const getInfo = async () => {
    try{
        const result = await requestJS()
        return result
    }catch(e){
        return e
    }
}
复制代码
```

`await`右边是获取**吉林-山东**车票信息的函数`requestJS`，该函数会返回一个`promise`对象，当这个`promise`对象的状态为成功时，`await`会把成功的值赋给`result`，而当失败时，会直接抛出错误，一般我们会在`await`外包裹一层`try catch`来捕获可能出现的错误，那能不能不让`await`抛出错误呢？

很明确的告诉你，可以，只需要封装一下`await`关键字即可

### 保证不抛出错误

```
// noErrorAwait负责拿到成功或失败的值，并保证永远不会抛出错误！
const noErrorAwait = async f => {
    try{
        const r = await f()
        return {flag: true, data: r}
    }catch(e) {
        return {flag: false, data: e}
    }
}

const getInfo = () => {
    const result = noErrorAwait(requestJS)
    return result
}
复制代码
```

> 在noErrorAwait的catch里请不要进行一些副作用操作，除非你真的需要那些东西

有了`noErrorAwait`的加持，`getInfo`可以不再是一个`async`函数了，但此时的`getInfo`仍会返回一个`promise`对象，这是因为`noErrorAwait`是`async`函数的缘故。封装到这里，`noErrorAwait`已经实现了它的第一个特点——保证不抛出错误，现在来把`getInfo`补全

```
const noErrorAwait = async f => {
    try{
        const r = await f() // (A)
        return {flag: true, data: r}
    }catch(e) {
        return {flag: false, data: e}
    }
}

const getInfo = () => {
    const js = noErrorAwait(requestJS) // (B)
    console.log(`吉林-山东的车票未售空，价格是 ${js.data.price} RMB`)
    const sy = noErrorAwait(requestSY) // (C)
    console.log(`山东-云南的车票未售空，价格是 ${sy.data.price} RMB`)
    const yh = noErrorAwait(requestYH) // (D)
    console.log(`云南-海南的车票未售空，价格是 ${yh.data.price} RMB`)
    console.log(`本次旅途共计车费 ${js.price + sy.price + yh.price}`)
}
复制代码
```

我们分别为`(B)、(C)、(D)`所对应的**请求函数**都套上了一层`noErrorAwait`，正是由于这种缘故，我们可以在`getInfo`中始终确保`(B)、(C)、(D)`下的请求函数不会报错，但致命的问题也随之到来，`getInfo`会确保**请求函数**是顺序执行的吗？

仔细看一遍就会发现`getInfo`是不负责顺序执行的，甚至可能会报错。这是因为`noErrorAwait`中`await`关键字的缘故，现在手动执行一下分析原因

-   调用`getInfo`
-   调用`noErrorAwait`并传递参数`requestJS`
-   来到`noErrorAwait`中，由于`noErrorAwait`是`async`函数，所以会返回一个`promise`对象
-   执行`await f()`，这个`f`就是`requestJS`，由于`requestJS`是一个异步任务，所以交出本次“线程”，也就是从`(A)`跳到`(B)`的下方，打印`js.data.price`，结果发现抛出了`TypeError`
-   抛出`TypeError`的原因是因为`(B)`的变量`js`是一个初始化状态的`promise`对象，所以说访问初始化中的数据怎么可能不报错！

那问题来了，`noErrorAwait`只负责让所有的**请求函数**都不抛出错误，但它并不能确保所有请求函数是按顺序执行的，如何才能让它们按照顺序执行呢？

难不成又要把`getInfo`变回`async`函数，然后再通过`await noErrorAwait(...)`的形式来确保**所有请求函数**是按照顺序执行的，果然鱼与熊掌不可得兼，如果真的使用这种方式，那`await noErrorAwait(...)`如果抛出了错误，谁来捕获呢？总不能在它外面再套一层`noErrorAwait`吧

### 保证顺序执行

这个想法实现到这里，其实已经出现了很大的问题了——“保证不抛出错误”和“顺序执行”**不能同时成立**，但也不能遇到`bug`就关机睡觉呀。这个问题当时我认真思考过，期间不泛`break`、`Proxy`等其它骚操作，在束手无策的时候，我突然想到了它的表哥——`Generator`，由于生成器是可控的，我只需要在上一次请求完成时，调用`next`发起下一次请求，这不就可以解决了吗，确实是不错的想法，现在来试试

```
// 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)
const interface = [true, true, true]

const noErrorAwait = async f => {
    try{
        const r = await f()
        generator.next({flag: true, data: r})
    }catch(e) {
        return {flag: false, data: e}
    }
}

const getInfo = function*() {
    const js = yield noErrorAwait(requestJS)
    console.log(`吉林-山东的车票未售空，价格是 ${js.data.price} RMB`)
    const sy = yield noErrorAwait(requestSY)
    console.log(`山东-云南的车票未售空，价格是 ${sy.data.price} RMB`)
    const yh = yield noErrorAwait(requestYH)
    console.log(`云南-海南的车票未售空，价格是 ${yh.data.price} RMB`)
    console.log(`本次旅途共计车费 ${js.data.price + sy.data.price + yh.data.price}`)
}

const generator = getInfo()
generator.next()
复制代码
```

先来看测试结果

![generator1.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50f5495a1d7048f89a54981460e77523~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

当请求全部成功时，所有数据都拿到了，不得不说，这一切都要归功于`yield`关键字

当`noErrorAwait`感知到请求函数成功时，会调用`next`，从而推动嵌套请求的发起，而且也不用担心生成器在什么时候执行完，因为一个`noErrorAwait`总会对应着一次`next`，这样一来`getInfo`就差不多已经在掌控之中了，但有个致命的问题就是：`noErrorAwait`感知到错误时，应该如何处理？如果继续调用`next`，那就与不用生成器没有区别了，因为始终都会顺序执行，解决办法就是传递一个函数，在`noErrorAwait`感知到错误时调用该函数，并且把出错的请求函数之前的**所有请求结果**全部传递进去，这样当这个回调执行时，便代表某一个请求函数抛出了错误

```
// 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)
const interface = [true, false, true]

// 存储每次的请求结果
const result = []
// 失败的回调(不要关心callback定义在哪里，以及如何传递)
const callback = (...args) => console.log('某个请求出错了，前面收到的结果是', ...args) // (A)
const noErrorAwait = async f => {
    try{
        const r = await f()
        const args = {flag: true, data: r}
        result.push(args)
        generator.next(args)
    }catch(e) {
        const args = {flag: false, data: e}
        result.push(args)
        callback(result)
        return args
    }
}

const getInfo = function*() { // (B)
    const js = yield noErrorAwait(requestJS)
    console.log(`吉林-山东的车票未售空，价格是 ${js.data.price} RMB`)
    const sy = yield noErrorAwait(requestSY)
    console.log(`山东-云南的车票未售空，价格是 ${sy.data.price} RMB`)
    const yh = yield noErrorAwait(requestYH)
    console.log(`云南-海南的车票未售空，价格是 ${yh.data.price} RMB`)
    console.log(`本次旅途共计车费 ${js.data.price + sy.data.price + yh.data.price}`)
}

const generator = getInfo() // (C)
generator.next() // (D)
复制代码
```

通过测试可以发现当**第二个请求函数**抛出了错误时，`noErrorAwait`可以完全捕获，并及时通过`callback`向用户返回了数据

![generator2.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9573593b6dcb4b4f978249c7e67ed1ff~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

这样就实现了一个功能较为齐全的处理嵌套请求的函数了，但仔细看看就会发现，代码中的`(A)、(B)、(C)、(D)`(包括`(B)`中的所有`yield`)都是**由用户自定义**的，也就是说，每次用户在使用这段处理嵌套请求的逻辑之前，都**必须要自定义上面四处代码**，那这样一来这个功能就变的极其鸡肋了，不仅对用户来说很头疼，就连开发者也落不到一个好的口碑

既然没有达到理想层面，那就说明还需要努力优化

是时候解决掉所有问题了

## 开始封装

通过上面的种种问题，就能得出自己的经验和教训，要么优化好了，但不能顾及其它情况；要么完成了功能，但使用起来的体验极其差劲。现在就来封装一个`combineAsyncError`函数，这个函数会完成所有的逻辑处理及调度，而用户则**只需要传递请求函数**即可

> combineAsyncError即字面意思，捕获异步错误，当然它也可以捕获同步错误

### 使用形式

```
const combineAsyncError = tasks => {}
const getInfo = [requestJS, requestSY, requestYH]

combineAsyncError(getInfo)
    .then(data => {
        console.log('请求结果为：', data)
    })
复制代码
```

`combineAsyncError`接收一个由**请求函数**所构成的数组，该函数会返回一个`Promise`对象，其`then`方法被执行时，就代表嵌套请求结束了(有可能因为成功而结束，亦有可能因为失败而结束)，不过不要担心，因为`data`的值始终为`{ result, error }`，如果`error`存在则代表请求失败，反之成功

### 完成combineAsyncError的返回值

```
const combineAsyncError = tasks => {
    return new Promise(res => handler(res))
}
复制代码
```

当调用`res`时，会通知当前的`Promise`实例去执行它的`then`方法，而`res`也正是杀手锏，只需在请求失败或全部请求成功时调用`res`，这样`then`就会知道嵌套请求的逻辑执行完毕

### combineAsyncError的初始化工作

在`handler`中完成处理请求函数的逻辑。也就是操作`Generator`函数，既然这里要使用生成器，那就很有必要做一下初始化工作

```
const combineAsyncError = tasks => {
const doGlide = {
    node: null, // 生成器节点
    out: null, // 结束请求函数的执行
    times: 0, // 表示执行的次数
    data: { // data为返回的最终数据
        result: [],
        error: null,
    }
}
const handler = res => {}
    return new Promise(res => handler(res))
}
复制代码
```

`doGlide`相当于一个**公共区域**(你也可以理解为原型对象)，把一些值和数据存放在这个公共区域中，其它人可以通过这个公共区域来访问这里面的值和数据

### 在handler中使用Generator

初始化完毕，现在所有的值和数据都找到”家“(存放的地方)了，接下来在`handler`中使用生成器

```
const combineAsyncError = tasks => {
    const doGlide = {}
    const handler = res => {
        doGlide.out = res
        // 预先定义好生成器
        doGlide.node = (function*(){
        const { out, data } = doGlide
        const len = tasks.length
        // yield把循环带回了JavaScript编程的世界
        while(doGlide.times < len)
            yield noErrorAwait(tasks[doGlide.times++])
        // 全部请求成功(生成器执行完毕)时，返回数据
        out(data)
        })()
    doGlide.node.next()
    }
    return new Promise(res => handler(res))
}
复制代码
```

把`res`赋值给`doGlide.out`，调用`out`就是调用`res`，而调用`res`就代表本次处理完成(可以理解成`out`对应了一个`then`方法)。把`Generator`生成的迭代器交给`doGlide.node`，并先在本地启动一下生成器`doGlide.node.next()`，这个时候会进入`while`，然后执行`noErrorAwait(tasks[doGlide.times++])`，发出执行`noErrorAwait(...)`的命令后，`noErrorAwait`会被调用，且`while`会在此时变为可控的循环，因为`noErrorAwait`是一个异步函数，只有当`yield`得到**具体的值**时才会执行下一次循环(换句话说，`yield`得到了具体的值，那就代表本轮循环完成)，而`yield`有没有值其实无所谓，我们只是利用它的特性来把循环变为可控的而已

### 扩展noErrorAwait

至此，所有的准备工作其实都已完备，就差`noErrorAwait`来完成整体的调度了，话不多说，接下来开始实现

```
const combineAsyncError = tasks => {
    const doGlide = {}
    const noErrorAwait = async f => {
        try{
            // 执行请求函数
            const r = await f()
            // 追加数据
            doGlide.data.result.push({flag: true, data: r})
            // 请求成功时继续执行生成器
            doGlide.node.next()
        }catch(e) {
            doGlide.data.error = e
            // 当某个请求函数失败时，立即终止函数执行并返回数据
            doGlide.out(doGlide.data)
        }
    }
    const handler = res => {}
    return new Promise(res => handler(res))
}
复制代码
```

在`noErrorAwait`这个`async`函数中，使用`try catch`来保证每一次**请求函数执行时都不会抛出错误**，当请求成功时，追加请求成功的数据，并且继续执行生成器，而生成器执行完毕，也就代表`while`执行完毕，所以`out(data)`实则是结束了整个`combineAsyncError`函数；而当请求失败时，则赋予`error`实际的值，并且执行`doGlide.out`来向用户返回所有值

至此，一个简单的`combine-async-error`函数便封装完毕了，现在通过两种情况进行测试

-   请求函数全部成功

```
// 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)
const interface = [true, true, true]

const getInfo = [requestJS, requestSY, requestYH]

combineAsyncError(getInfo)
    .then(data => {
        console.log('请求结果为：', data)
    })
复制代码
```

![c_a_e1.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/294407bc96cb416f9398619c48629927~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

-   某一个请求函数抛出错误

```
// 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)
const interface = [true, false, true]

const getInfo = [requestJS, requestSY, requestYH]

combineAsyncError(getInfo)
    .then(data => {
        console.log('请求结果为：', data)
    })
复制代码
```

![c_a_e2.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4851288358dc4ce5a9fadf89107a686d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

### 码上掘金

上面所编写的示例及封装的`combine-async-error`已存放至码上掘金

## 比较三种形式(Promise、async、combine-async-error)

现在来比较一下三种形式，三种形式统一使用下面的请求结果

```
// 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)
const interface = [true, false, true]
复制代码
```

### Promise

```
let acc = 0
// 先查询吉林到山东
requestJS()
    .then(({ price: p1 }) => {
        acc += p1
        console.log(`吉林-山东的车票未售空，价格是 ${p1} RMB`)
        // 如果吉林-山东的车票未售空，则继续查询山东-云南的车票
        return requestSY()
    })
    .then(({ price: p2 }) => {
        acc += p2
        console.log(`山东-云南的车票未售空，价格是 ${p2} RMB`)
        // 如果山东-云南的车票未售空，则继续查询云南-海南的车票
        return requestYH()
    })
    .then(({ price: p3 }) => {
    // 能执行到这里，就说明前面所有请求都成功了
        acc += p3
        console.log(`云南-海南的车票未售空，价格是 ${p3} RMB`)
        console.log(`本次旅途共计车费 ${acc} RMB`)
    })
    .catch(({ destination }) => console.log(`来晚了，${destination}的车票已售空`))
复制代码
```

### async

```
const f = async () => {
    try {
        const js = await requestJS()
        console.log(`吉林-山东的车票未售空，价格是 ${js.price} RMB`)
        const sy = await requestSY()
        console.log(`山东-云南的车票未售空，价格是 ${sy.price} RMB`)
        const yh = await requestYH()
        console.log(`云南-海南的车票未售空，价格是 ${yh.price} RMB`)
        console.log(`本次旅途共计车费 ${js.price + sy.price + yh.price} RMB`)
    } catch ({ destination }) {
        console.log(`来晚了，${destination}的车票已售空`)
    }
}

f()
复制代码
```

### combine-async-error

```
const getInfo = [requestJS, requestSY, requestYH]
combineAsyncError(getInfo)
    .then(({ result, error }) => {
        result.forEach(({data}) => console.log(`${data.destination}的车票未售空，价格是 ${data.price} RMB`))
        if (error) console.log(`来晚了，${error.destination}的车票已售空`)
    })
复制代码
```

可以看到`combine-async-error`这种智能捕获错误的方式确实优雅，无论多少次嵌套请求，始终只需要一个`then`便可以轻松胜任所有工作，并且使用`combine-async-error`的形式也很简洁，根本不需要编写复杂的嵌套层级，在使用之前也不需要进行其它令人头疼的操作

## 扩展功能

虽然`combineAsyncError`函数实现到这里已经取得了不小的成就，但经过多次测试，我发现`combineAsyncError`始终还差点东西

现在来对`combineAsyncError`增加可选的配置项，提高其扩展性、灵活性

> 由于 combineAsyncError 配置项众多，所以仅以 forever 举例，如果你想了解更加强大的 combineAsyncError ，我在文末有详细介绍

`forever`取它的字面意思，即`永远；不断地`，在`combineAsyncError`里我们使用配置项`forever`来决定当请求函数遇到错误时，是否继续执行，默认为`false`

```
// 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)
const interface = [true, false, true]

const combineAsyncError = (tasks, config) => {
const doGlide = {}
const noErrorAwait = async f => {
        try {
            const r = await f()
            doGlide.data.result.push({ flag: true, data: r })
            doGlide.node.next()
        } catch (e) {
            doGlide.data.result.push({ flag: false, data: e })
            // 当forever为true时，不必理会错误，而是继续执行生成器
            if (config.forever) return doGlide.node.next()
            doGlide.out(doGlide.data)
        }
    }
    const handler = res => {}
    return new Promise(res => handler(res))
}

const getInfo = [requestJS, requestSY, requestYH]

combineAsyncError(getInfo, { forever: true })
.then(data => {
console.log('请求结果为：', data)
})
复制代码
```

![c_a_e3.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f479231a003d4b22b91e1802365eab6e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

通过测试结果可以看到即使**第二次请求失败**了，但第三次请求**依旧会正常发出**，且`combineAsyncError`不会抛出任何错误。而无论是请求成功的结果，还是请求失败的结果，都可以在`result`中拿到

## 其它配置项

重新定义了`combineAsyncError`的入参数组，使其扩展性变的更高，另外增加了以下配置项

### isCheckTypes

在设计`combine-async-error`时，关于传入的参数是否进行校验，其实是存在一些负面影响的，为此，`combine-async-error`主动添加了`isCheckTypes`配置项，如果该配置项的值为`false`，则不对入参进行检查，反之进行严格的类型检查。如果可以确保传入的类型始终是正确的，那么强烈建议你将该配置项更改为`false`；默认为`true`

> 由于JavaScript中存在隐式类型转换，所以即使你指定了isCheckTypes为true，combine-async-error也不会对传入的第二个参数(config)进行检查

```
isCheckTypes: true
复制代码
```

### acc

```
acc: () => {}
复制代码
```

如果指定了该值为函数，则**所有请求**完成后会执行该函数，此`回调函数`会收到**最终的请求结果**

如果未指定该值，则`combine-async-error`返回一个`Promise`对象，你可以在它的`then`方法中得到**最终的请求结果**

### forever

遇到错误时，**是否继续执行**(发出请求)。无论是嵌套还是并发请求模式，该配置项始终生效

```
forever: false
复制代码
```

### pipes

#### single

后一个请求函数是否接收**前一个请求函数**的结果

#### whole

后一个请求函数是否接收**前面所有请求函数**的结果

当`whole`为`true`时，`single`无效，反之有效

```
pipes: {
    single: false,
    whole: true
}
复制代码
```

### all

`combine-async-error`应该得到原有的扩展，为此它支持新的配置项`all`，如果为`all`指定了`order`值，则传入`combine-async-error`的请求数组会并发执行，而不是继续以嵌套的形式执行

下面的写法相当于使用了`all`的默认配置，因为`all`的值默认为`false`

```
all: false // 嵌套请求
复制代码
```

下面的写法则是开启了**并发之旅**，`all`为一个`对象`，其`order`属性决定并发的请求结果是否按照顺序来存放到最终数组中

```
all: {
    order: true
}
复制代码
```

关于`order`的使用，举例如下

```
// 假设requestAuthor始终会在3-6秒钟之内返回请求结果
const requestAuthor = () => {}
// 假设requestPrice始终会在1秒钟之内返回请求结果
const requestPrice = () => {}

const getInfo = [requestAuthor, requestPrice]
combine-async-error(getInfo, {
    all: {
        order: true
    }
})
复制代码
```

由于你指定了`order`为`true`，那么在**最终的请求结果**数组`result`中，`requestAuthor`的请求结果会作为`result`的第一个成员出现，而`requestPrice`的请求结果则会作为该数组的第二个成员出现，这是因为`order`始终会保证`result`与`getInfo`的顺序一一对应，即使`requestPrice`是最先执行完的请求函数

如果指定了`order`为`false`，则最先执行完的请求函数所对应的结果就会在`result`中越靠前；在上例中`requestPrice`的请求结果会出现在`result`的第一个位置

### requestCallback

```
requestCallback: {
    always: false,
    success: false,
    failed: false
}
复制代码
```

`always`表示无论请求函数是成功还是失败，都会在拿到请求结果后执行为该请求函数提前指定好的`callback`，此`callback`会收到当前请求函数的结果

`success`表示只有当请求函数成功时，才会去执行提前执行好的`callback`，并且`callback`会收到当前请求函数执行成功的结果；`failed`则表示失败，与`success`同理

例如，当传入请求函数的形式为

```
combineAsyncError([
        {
            func: requestAuthor,
            callback: () => {} // 提前为requestAuthor指定好的回调函数
        }
    ], {
        requestCallback: {
        failed: true // 指定了failed
    }
})
复制代码
```

上述示例中，只有当`requestAuthor`请求函数出错时，才会执行该请求函数所指定好的`callback`回调，并且此回调函数会收到`requestAuthor`失败的原因

## 设计初衷

`combine-async-error`设计的初衷是为了解决复杂的嵌套请求，现在通过**丰富的配置项**它也可以支持并发请求模式(不仅如此，还可以把请求函数玩出新的高度)，但面对**单个请求函数**的情况，其效果并不理想，举例

创建一个新的请求函数`requestTest`，请求结果为**失败**

```
const requestTest = name => new Promise((res, rej) => {
    setTimeout(() => {
        rej({ name, destination: '今日所有车票已售空' })
    }, 1000)
})
复制代码
```

现在分别使用`Promise`和`combine-async-error`来完成`requestTest`的调用

```
// Promise

requestTest('小明')
    .catch(({ name, destination }) => console.log(`${name}你好，${destination}`))
复制代码
```

```
// combine-async-error

const getInfo = [{ func: requestTest, args: ['小明'] }]
combineAsyncError(getInfo)
    .then(({ error: { msg: { name, destination } } }) => console.log(`${name}你好，${destination}`))
复制代码
```

![vs.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/548b6166e5fd4f1b8087483086560e5c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

在面对单个请求函数的情况下，使用`Promsie`可以便捷的发出请求，并且使用形式也较为简单；而`combine-async-error`则显得有些冗余了(指定请求函数、指定其收到的参数...)；但随着请求函数的增多，我想`combine-async-error`的优势一定会体现出来

## 立即体验

> 此仓库中包含了该工具类详细的使用教程及各配置项的讲解；如果你对它有更好的建议，欢迎反馈
> 
> 如果你觉得本篇文章不错，可以留个赞

现在你可以通过

```
npm install combine-async-error
复制代码
```

`来感受一下如何梭哈嵌套请求`

或者查看它的

Git地址 [combine-async-error](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FFuncJin%2Fcombine-async-error "https://github.com/FuncJin/combine-async-error")

`combine-async-error`的心路历程到此为止...

我正在参加「创意开发 投稿大赛」详情请看：[掘金创意开发大赛来了！](https://juejin.cn/post/7120441631530549284 "https://juejin.cn/post/7120441631530549284")