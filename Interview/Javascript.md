### 1. 介绍 js 的数据类型，画一下内存图

栈：原始（基本）数据类型（undefined、null、boolean、number、string、symbol）

堆：引用数据类型（array、object、function）

基本数据类型的值保存在栈中；复杂数据类型的值保存在堆中，通过使用保存在栈中的变量来获取堆中的引用地址，从而能够获取到值。

### 2. 什么是堆？什么是栈？它们之间有什么区别和联系？

堆和栈的概念在数据结构和操作系统内存中都有存在。

在数据结构中，栈就像一个烧杯，数据先进后出；而堆是一个优先队列，按优先级 来进行排序的，优先级可以按照大小来规定。

在操作系统中，内存被分为栈区和堆区。栈区内存有编译器自动分配释放，存放函数的参数值，局部变量的值等，其操作方式类似于数据结构中的栈；堆区内存一般由程序员分配释放，若程序员不释放，程序结束时可能由垃圾回收机制回收。

### 3. 内部属性[[Class]]是什么？

所有 typeof 返回值为“object”的对象（如数组）都包含一个内部属性[[Class]]（我们可以把它看作一个内部的分类，而非传统的面向对象意义上的类）。这个属性值无法直接访问，一般通过 Object.prototype.toString()来查看。例如：

```js
Object.prototype.toString.call([1, 2, 3]);
// "[object Array]"
Object.prototype.toString.call(/regex-literal/i);
// "[object RegExp]"
```

### 4. 介绍 js 有哪些内置对象？

Date、Object、Math。parseInt（）、parseFloat（）等等

### 5. undefined 与 undeclared 的区别？

已在作用域中声明到还没有赋值的变量，是 undefined；还没有在作用域中声明过的变量，是 undeclared 的，对于 undeclared 变量的引用，浏览器会报引用错误，如：ReferenceError：b is not defined。但是我们可以使用 typeof 的安全防范机制来避免报错，因为对于 undeclared（或者 not defined）变量，typeof 会返回 undefined。

### 6. null 和 undefined 的区别？

都是基本数据类型。undefined 是未定义，null 是空对象。声明变量但是没有定义的时候返回 undefined，如果一个变量代表的是对象，一般用 null 做初始化。

### 7. 如何获取安全的 undefined 值？

void 单值运算符，e.g. void 0；返回 undefined。void 并不改变表达式的结果，只是让表达式不返回值。

### 8. 说几条写 Javascript 的基本规范?

- 代码中出现地址、时间等字符串时需要使用常量代替
- 在进行比较时，尽量使用‘!==’，“=\=\=”
- 不要在内置对象的原型上添加方法。如 Array、Date
- switch 语句必须带有 default 分支
- for、if 语句必须使用大括号
- 声明的变量没有值时，应该赋一个对应类型的初始值

### 9. js 原型，原型链？有什么特点？

我们使用构造函数来新建一个对象。每个构造函数内部有一个 prototype 属性。它的值是一个对象，包含了可以由该构造函数的所有实例共享的属性和方法。

用这个构造函数新建出来的对象，内部会包含一个==\_\_proto\_\_==的指针，指向构造函数的 prototype 属性值。在 ES5 中，这个指针被称为对象的原型。我们可以通过 Object.getPrototypeOf()方法获取对象原型。

当我们访问该对象的属性时，如果对象内部不存在这个属性，那它就回去原型对象里面找这个属性，这个原型对象又会有自己的原型，于是就会这样一直找下去，也就是原型链的概念。

原型链的尽头一般来说都是 Object.prototype，所以这就是我们新建的对象能够使用 toString()等方法的原因。

**特点**：Javascript 对象是通过引用来传递的，我们创建的每个新对象实体中并没有属于自己的原型副本。当我们修改原型时，与之相关的对象也会继承这一个改变。

### 10. js 中不同进制数字的表示方式

- 0X|0x 开头的表示 16 进制
- 0|0o|0O 开头的表示 8 进制
- 0b|0B 开头的表示 2 进制

### 11. js 中整数的安全范围是多少？

Number.MIN_SAFE_INTEGER - Number.MAX_SAFE_INTEGER

### 12. Array 构造函数只有一个参数值时的表现？

Array 构造函数只带一个数字的时候，表示的是数组的长度，而非充当数组中的一个元素。这样创建出来的只是一个空数组，只不过 它的 length 属性 被设置成了指定的值。构造函数 Array(..)不要求必须带 new 关键字。不带时，它会被自动补上。

### 13. 其他值到字符串的转换规则？

- boolean 类型，true 转换为‘true’，false 转换为‘false’
- null、undefined 同名转换
- number 类型的值同名转换，不过极大和极小的数字会使用指数形式。
- symbol 类型的值直接转换 ，但是只允许显示强制类型转换，使用隐式强制类型转换会产生错误
- 对于普通对象来说。需要自定义 toString 方法，返回自己想要的值。否则会调用 Object.prototype.toString()来返回内部属性 [[Class]]的值，如“[object Object]”。

### 14. 其他值类型到数字类型的转换规则？

- undefined 转换为 NaN
- null 转换为 0
- boolean；true 转换为 1，false 转换为 0
- Symbol 不能转 ，报错
- string 类型；如同使用 Number()函数进行转换。非数字值转为 NaN，空字符转为 0

### 15. 其他值类型转到布尔类型的转换规则？

以下这些是假值：undefined, null, false, +0, -0, NaN, “”，转换为 false

逻辑上说，假值列表以外的都应该是真值

### 16. {}和[]的 valueOf 和 toString 的结果是什么？

{}的 valueOf 结果为{}，toString 的结果为“[object Object]”

[]的 valueOf 结果为[]，toString 的结果为“”

### 17. ~操作符的作用？

~x 大致等同于-(x+1)。砍掉小数，返回整数

### 18. 解析字符串中的数字和将字符串强制类型转换为数字的返回结果都是数字，之间的区别是什么？

解析（e.g. parseInt）允许有非数字字符，从左到右解析。遇到非数字字符就停止。

转换（e.g. Number）不允许出现非数字字符，否则会失败返回 NaN

### 19. +操作符什么时候用于字符串的拼接？

如果+的其中一个操作数是字符串，则执行字符串拼接，否则执行数字加法。

对于除了+的运算符来说，指要其中一个是数字，那么另一方会被转为数字。

### 20. 什么情况下会发生布尔值的隐式强制类型转换？

1. if 语句中的条件判断表达式
2. for 语句中的条件判断表达式（第二个）
3. while 和 do..while 循环中的条件判断表达式
4. ?: 三元表达式中的条件判断表达式
5. 逻辑运算符左边的操作数（作为条件判断表达式）

### 21. ||和&&操作符的返回值？

会先对第一个操作数执行条件判断， 如果不是 boolean 就先进行 ToBoolean 强制类型转换，然后在执行条件判断。

逻辑运算符返回它们其中一个操作数的值，而非条件判断的结果。

### 22. symbol 值的强制类型转换？

es6 允许从符号到字符串的显示强制类型转换，隐式强转会产生错误。

symbol 值不能被强制类型转换为数字，显转和隐转都和产生错误

可以被强转为 boolean，显示和隐式结果都是 true

### 23. ==操作符的强转规则？

1. 字符串和数字间的比较：将字符串转为数字之后在进行比较
2. 其他类型和布尔类型间的比较，先将布尔值转换为数字后，在应用其他规则进行比较
3. null 和 undefined 间的比较，结果为真，其他值和它们比较都返回假值
4. 对象和非对象间比较，对象调用 ToPrimitive 抽象操作，在进行比较
5. 如果一个操作值为 NaN，则必定返回 false
6. 如果两个操作值都是对象，则比较它们是不是指向同一个对象，如果是，则返回 true，否则，返回 false

### 24. 如何将字符串转为数字，例如‘12.3’？

1. 使用 Number()方法，前提是包含的字符串不包含不合法字符
2. 使用 parseInt()、parseFloat()方法，
3. 使用+操作符的隐式转换。e.g. +’12.3‘ -> 12.3

### 25. 常用的正则表达式

```js
// 1. 匹配16进制颜色值
var reg = /#([0-9a-fA-F]{6})|[0-9a-fA-f]{3}/g;

// 2. 匹配日期，如yyyy-mm-dd
var reg = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

// 3. 匹配qq号
var reg = /^[1-9][0-9]{4, 10}$/g;

// 4. 手机号码正则
var reg = /^1[34578]\d{9}$/g;

// 5. 用户名正则
var reg = /^[a-zA-Z\$][a-zA-Z0-9_\$]{4, 16}$/;
```

### 26. 寄生式组合继承的实现？

```js
function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function fn() {
  console.log(`My name is ${this.name}.`);
};

function Student(name, grade) {
  Person.call(this, name);
  this.grade = grade;
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

Student.prototype.sayGrade = function () {
  console.log(`My grade is ${this.grade}.`)
};
```

### 27. Javascript的作用域链

它的作用是对执行环境中有权访问的所有变量和函数的访问保证。通过作用域链，我们可以访问到外层变量的变量和函数。

> 变量对象：是一个包含了执行环境中所有变量和函数的对象。

作用域链的本质是一个指向变量对象的指针列表。它的前端始终都是当前执行上下文的变量对象。全局执行上下文的变量对象始终是作用域链的最后一个对象。

当我们查找一个变量时，如果当前执行环境中没有找到，我们可以沿着作用域链向后查找。
作用域链的创建过程跟执行上下文的建立有关

### 28. 谈谈对this对象的理解

this是执行上下文中的一个属性，它指向最后一次调用这个方法的对象。

1. 函数调用模式：当一个函数不是一个对象的属性，直接作为函数来调用时，this指向全局对象。
2. 方法调用模式：如果一个函数作为一个对象的方法来调用时，this指向这个对象
3. 构造器调用模式：如果一个函数用new调用时，函数执行前会新创建一个对象，this指向这个新创建的对象
4. apply、call和bind调用模式：这三个方法都可以显示指定调用函数的this指向。

> 优先级：构造器 > apply。。。 > 方法 > 函数



### 29. 什么是DOM和BOM？

DOM指的是文档对象模型。将文档当成一个对象，这个对象主要定义了处理网页内容的方法和接口。

BOM指的是浏览器对象模型。将浏览器当成一个对象，这个对象主要定义了一个与浏览器进行交互的方法和接口。BOM核心是window，而window对象具有双重角色。既是js访问浏览器窗口的接口，又是一个Global对象。

DOM中最根本的document对象也是BOM的window对象的子对象。



### 30. 写一个通用的事件侦听工具。

```js
const EventUtil = {
  // 分别用dom0||dom2||IE方式来绑定事件

  // 添加事件
  addEvent (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent(`on${type}`, handler)
    } else {
      element[`on${type}`] = handler
    }
  },
  // 移除事件
  removeEvent (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false)
    } else if (element.detachEvent) {
      element.detachEvent(`on${type}`, handler)
    } else {
      element[`on${type}`] = null
    }
  },
  // 获取事件的目标
  getTarget (event) {
    return event.target || event.srcElement
  },
  // 获取event对象的引用，取到事件的所有信息，确保随时能使用event
  getEvent (event) {
    return event || window.event
  },
  // 阻止事件（主要是事件冒泡，因为IE不支持事件捕获）
  stopPropagation (event) {
    if (event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  },
  // 取消事件默认行为
  preventDefault (event) {
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  }
}
```



### 31. 事件是神什么？IE和火狐的事件机制有什么区别？如何阻止冒泡？

1. 事件是浏览器或用户做的某些事情。事件被封装成一个event对象。
2. 事件处理机制：IE支持事件冒泡、Firefox同时支持捕获和冒泡。
3. event.stopPropagation()或者ie下的event.cancelBubble = true



### 32. 三种事件模型是什么？

事件是用户操作网页时发生的交互动作或者网页本身的一些操作，现代浏览器一共有三种事件模型。

* Dom0级模型：这种模型不会传播，所以没有事件流概念，但是现在有的浏览器支持以冒泡的方式实现，它可以在网页中直接定义监听函数，也可以通过js属性来指定监听函数。这种方式是所有浏览器都兼容的。
* IE事件模型：该模型中，一个事件共有两个过程，事件处理和事件冒泡阶段。事件处理阶段会首先执行目标函数目标元素绑定的监听事件；然后是事件冒泡阶段，冒泡指的是事件从目标元素冒泡到document，一次检查经过的节点是否绑定了事件监听函数，如果有则执行。这种模型通过attachEvent来添加监听函数，可以添加多个监听函数，灰按顺序依次执行。
* Dom2级事件模型：一次事件共三个过程。事件捕获阶段：指的是事件从document一直向下传播到目标元素，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。后面两个阶段和IE模型的两个阶段相同。这种事件模型，事件绑定函数是addEventListener，其中第三个参数可以指定时间是否在捕获阶段执行，默认为false。



### 33. 事件委托是什么？

本质上是利用了浏览器事件冒泡机制。因为事件在冒泡个过程中会上传到父节点，父节点可以通过事件对象获取到目标节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件，这种方式称为事件代理。使用事件代理我们我们可以不必要为每一个元素都绑定一个监听事件，减少内存消耗。并且我们还可以实现事件的动态绑定，比如说新增一个子节点，我们不需要单独的为它添加一个监听事件，他所发生的事件会交给父元素中的监听函数来处理。



### 34. 什么是闭包，为什么要用它？

闭包是指有权访问另一个函数作用域中变量的函数。创建闭包最常见的方式就是在一个函数内创建另一个函数，创建的函数可以访问到当前函数的局部变量。

由两个常用的用途。

* 使我们在函数外部能够访问到函数内部的变量。通过使用闭包，我们可以通过在外部调用闭包函数，从而在外部访问到函数内部的变量，可以使用这种方法来创建私有变量。
* 使已经运行结束的函数上下文中的变量对象继续留在内存中，因为闭包函数保留了这个变量对象的引用，所以这个变量对象不会被回收。

其实闭包的本质就是作用域链的一个特殊的应用，只要了解了作用域链的创建过程，就能够理解闭包的实现原理。



### 35. javascript代码中的“use strict”是什么意思？使用它的区别是什么？

这是使用严格模式运行的意思，这种模式使得Javascript在更严格的条件下运行。设立“严格模式”的目的主要有以下几个：

* 消除Javascript语法的一些不合理性、不严谨之处，减少一些怪异行为；
* 消除代码运行的一些不安全之处，保证代码运行的安全
* 提高编译器效率，增加运行速度
* 为未来新版本的Javascript做好铺垫

区别：

* 禁止使用with语句
* 禁止this关键字指向全局对象
* 对象不能有重名属性



### 36. 如何判断一个对象是否属于某个类？

* 使用instanceof来判断构造函数的prototype属性是否出现在对象的原型链中的任何位置
* 通过对象的constructor属性来判断，对象的constructor属性指向该对象的构造函数，但是这种方式不是很安全，因为constructor属性可以被改写
* 如果需要判断的是否个内置的引用类型的话，可以使用Object.prototype.toString()方法来打印对象的[[Class]]属性来进行判断。

### 37. instanceof的作用？

```js
// instanceof 运算符用于判断构造函数的prototype属性是否出现在对象的原型链中的任何位置
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left) // 获取对象原型
  const prototype = right.prototype // 获取构造函数的prototype对象
  // 判断构造函数的prototype是否在对象的原型链上
  while (true) {
    if (!proto) {
      return false
    }

    if (proto === prototype) {
      return true
    }

    proto = Object.getPrototypeOf(proto)
  }
}
```



### 38. new操作符具体干了什么？如何实现？

```js
// 1. 首先创建了一个空对象
// 2. 设置原型，将对象的原型设置为函数的prototype对象
// 3. 让函数的this指向这个对象，执行构造函数的代码（为这个新对象添加属性）
// 4. 判断函数的返回值类型，如果是值类型，返回创建的对象；如果是引用类型，就返回这个引用类型的对象。
function objectFactory(fn, ...restArgs) {
  let newObj = null
  let constructor = fn
  let result = null

  // 参数判断
  if (typeof constructor !== 'function') {
    console.error("type error")
    return
  }

  // 新建一个空对象，对象的原型为构造函数的prototype对象
  newObj = Object.create(fn.prototype)
  result = constructor.apply(newObj, restArgs)

  // 判断返回对象
  let flag = result && (typeof result === 'object' || typeof result === 'function')

  // 判断返回结果
  return flag ? result : newObject
}
```



### 39. JavaScript中，有一个函数，在执行对象查找时，永远不回去查找原型，这个函数是？

hasOwnProperty

所有继承了Object的对象都会继承到hasOwnProperty方法。这个方法可以用来检测一个对象是否含有特定的自身属性，和in运算符不同，该方法会忽略掉那些从原型链上继承到的属性。



### 40. 对于JSON的了解。

Json是一种基于文本的轻量级的数据交换格式。它可以被任何编程语言读取和作为数据格式来传递。

在前端，我们通过将一个符合JSON格式的数据结构序列化为JSON字符串，然后将它传递到后端；后端通过JSON格式的字符串解析后生成对应的数据结构，以此来实现前后端数据的传递。

JSON是基于JS的，但在JSON中对象格式更加严格，比如说在JSON中属性值不能为函数，不能出现NaN这样的属性值等。因此大多数的js对象是不符合JSON对象的格式的。



### 41. js延迟加载的方式有哪些？

js的加载、解析和执行会阻塞页面的渲染过程，因此我们希望js脚本能够尽可能的延迟加载，提高页面的渲染速度。

* 将js脚本放在文档底部，使js尽可能的在最后加载执行。
* 给js添加defer属性。这个属性会让脚本的加载与文档的解析同步进行，然后在文档解析完成后在执行这个脚本文件，这样的话就能使页面的渲染不被阻塞。多个脚本设置了defer属性，按规范来说的顺序执行的，但是在一些浏览器中可能不是这样。
* 给js添加async属性。这个属性会使脚本异步加载，不会阻塞页面的解析过程，但是当脚本加载完成后立即执行js脚本，这时如果文档没有解析完成的话，同样会阻塞。多个async属性的脚本执行顺序的不可预测的。
* 动态创建dom标签。可以对文档的加载事件进行监听，当文档加载完成后再动态的创建script标签来引入js脚本。



### 42. Ajax是什么？如何创建一个Ajax？

它是一种异步通信的方法，通过直接由js脚本向服务器发起http通信，然后根据服务器返回的数据，更新网页的相应部分，而不用刷新整个页面的一种方法。

1. 创建一个XMLHttpRequest对象。
2. 然后在这个对象上使用open（请求的方法，请求的地址，是否异步和用户的认证信息）方法创建一个http请求。
3. 在发起请求前，我们可以为这个对象添加一些信息和监听函数。e.g. setRequestHeader为请求添加头信息。
4. 我们还可以为这个对象添加状态监听函数，XMLHttpRequest对象一共有5个状态，当它状态变化时触发onreadychange事件。当对象的readyState变为4的时候，代表服务器返回的数据接收完成
5. 这个时候我们可以通过判断请求的状态，如果状态时2xx或者304的话，则代表返回正常。
6. 然后我们就可以通过response中的数据来对页面进行更新了。
7. 当对象的属性和监听函数设置完成后，最后我们设置sent方法来向服务器发起请求，可以传入参数作为发送的数据体

### 43. 谈一谈浏览器的缓存机制

在一段时间内。浏览器缓存了请求到的web资源。如果在该资源的有效时间内，再次发起了对该资源的请求，那么浏览器会直接使用缓存的副本，儿不是像服务器发起请求。

可以有效提高页面的打开速度，减少不必要的网络带宽消耗。

web资源的缓存策略一般由服务器来指定，分为**强缓存**和**协商缓存**。

*  强制缓存：不会向服务器发送请求，直接从缓存中读取资源 每次访问本地缓存直接验证看是否过期
  强缓存可以通过设置两种 HTTP 响应Header 实现：Expires过期时间（绝对时间，以服务器为准。比Cache-Control优先级低） 和 Cache-Control缓存控制。e.g. Cache-Control:max-age=300  缓存300秒

*  协商缓存：向浏览器发送请求，如果资源没发生修改，返回一个304状态码，让浏览器使用本地缓存副本。如果资源发生修改，则返回修改后的资源

  协商缓存也可以通过两种方式来设置：Last-Modified/If-Modified-Since（最后的修改事件，只能精确到秒级。比Etag优先级低）和Etag/If-None-Match

强制缓存优先于协商缓存进行



### 44. 同步和异步的区别？

同步：当一个进程在执行某个请求的时候，如果这个请求需要等待一段时间才能返回，那么这个进程会一直等待下去，直到消息返回为止再继续向下执行。

异步：指的是当一个进程再执行某个请求的时候，如果这个请求需要等待一段时间才能返回，此时进程会继续往下执行，不会阻塞等待消息的返回，当消息返回时系统再通知进程进行处理。



### 45. 什么是浏览器的同源政策？

一个域下的js脚本在未经允许的情况下，不能够访问另一个域的内容。这里的同源指的是两个域的协议、域名、端口号必须相同，否则不属于同一个域。

同源政策主要限制了三个方面：

1. 当前域下的js不能访问其他域下的cookie、localStorage和indexDB。
2. 当前域下的js不能操作访问其他域下的DOM
3. 当前域下的ajax不能发送跨域请求

目的主要是为了保证用户的信息安全，他只是对js脚本操作的一种限制，并不是对浏览器的限制，对于一般的img、或者script脚本请求都不会有跨域的限制，这是因为这些操作都不会通过响应结果来进行可能出现的安全问题的操作。



### 46. 如何解决跨域问题？

* 通过jsonp跨域
* CORS
* nginx代理跨域
* postMessage  API跨域
* websocket协议
* nodejs 中间件代理跨域



### 47. 简单谈一下cookie？

服务器将数据发送到浏览器，浏览器保存在本地的cookie中。当之后的同源请求发生时，将cookie中的数据添加到请求头，发送给服务端。这可以用来实现用户登录状态等功能。并且只能被同源的网页共享访问。

服务器端可以使用Set-Cookie的响应头部来配置cookie信息。一条cookie包括了5个属性值：expires 失效时间、domain 域名、path 路径、secure 规定了cookie只能在确保安全的情况下传输、HttpOnly 规定了这个cookie只能被服务器访问，不能使用js脚本访问。



### 48. 模块化开发怎么做？

一个模块是实现一个特定功能的一组方法。现在最常用的是立即执行函数的写法，通过利用闭包来实现模块私有作用域的建立，同时不会对全局作用域造成污染。



### 49. js的几种模块规范？

js中现在比较成熟的有四种模块加载方案。

1. CommonJS：它通过require来引入模块，通过module.exports定义模块的输出接口。这种模块加载方案是服务器端的解决方案，以同步方式来引入模块，因为在服务器端文件都存储在本地磁盘，所以读取非常快，所以同步加载的方式没有问题。但如果是在浏览器端，由于模块的加载时使用网络请求，因此使用过异步加载的方式更加适合。
2. AMD：这种方案采用异步加载模块，模块的加载不影响后面语句的执行，所以依赖这个模块的语句都定义在一个回调函数里，等到加载完成后再执行回调函数。require.js实现了AMD规范。
3. CMD：这种方案和AMD都是为了解决异步模块加载的问题，sea.js实现了CMD规范。和require.js的区别在于模块定义时对依赖的处理不同和对依赖的执行时机的处理不同。
4. ESModule：是ES6提出的方案，使用import和export的形式来导入和导出模块。



### 50. AMD和CMD的区别？

它们之间的只要区别有两个方面

1. 再模块定义时对依赖的处理不同。AMD推崇依赖前置，在定义模块的时候就要声明其依赖的模块。而CMD推崇就近依赖，只有在用到某个模块的时候再去require。
2. 对依赖模块的执行时机不同。首先两者都是模块异步加载，不过它们的区别在于模块的执行时机，AMD在依赖模块加载完成后就直接执行依赖模块，依赖模块的执行顺序和我们的书写顺序不一定一致。而CMD在依赖模块加载完成后并不执行，只是下载，等到所有的依赖模块都加载好后，进入回调函数逻辑，遇到require语句的时候才执行对应的模块，这样模块的执行顺序就和我们书写的顺序保持一致了。

```js
// CMD
define(function(require, exports, module) {
var a = require("./a");
a.doSomething();
// 此处略去 100 行
var b = require("./b"); // 依赖可以就近书写
b.doSomething();
 ...});
// AMD 默认推荐
 define(["./a", "./b"], function(a, b) {
// 依赖必须一开始就写好
a.doSomething();
// 此处略去 100 行
b.doSomething();
...});
```



###  51. ES6模块和CommonJS？

1. CommonJS模块输出的是一个值的拷贝，ES6模块输出的是值得引用。CommonJS输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。ES6是，JS引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，在根据这个只读引用，到被加载的那个模块里面去取值。
2. CommonJS是运行时加载，ES6是编译时输出接口。CommonJS模块就是对象，即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。而ES6模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。



### 52. requireJS的核心原理是什么？

通过动态创建script脚本来异步引入模块，然后对每个脚本的load事件进行监听，如果每个脚本都加载完成了，在调用回调函数。



### 53. es6中为什么会出现class这种东西？

本质上，他就是一个语法糖，背后还是原型继承的思想。通过加入class可以有利于我们更好的组织代码。在class中添加的方法，其实是添加在类的原型上。



### 54. 怎样添加、移除、移动、复制、创建和查找节点？

```js
// 创建新节点
createDocumentFragment(node);
createElement(node);
createTextNode(text);

appendChild(node); // 添加
removeChild(node); // 移除
replaceChild(new, old); // 替换
insertBefore(new, old); // 插入

// 查找
getElementById();
getElementsByName();
getElementsByTagName();
getElementsByClassName();
querySelector(0);
querySelectorAll();

// 属性操作
getAttribute(key);
setAttribute(key, value);
hasAttribute(key);
removeAttribute(key);
```



### 55. innerHTML 与 outerHTML的区别？

```html
<div>
  content <br />
</div>

innerHTML: content <br />
outerHTML: 
<div>
	content <br />  
</div>
innerText: content ;
outerText: content ;
```



### 56. call和apply的区别？

两个函数的作用都是修改this指向。接收的第一个参数都是代表调用函数的this指向。apply将调用函数的参数作为一个数组或类数组进行传递。call则是将参数分开传递。



### 57. JS类数组对象的定义？

一个拥有length属性和若干索引属性的对象就可以被称为类数组对象。不是真正的数组，不能调用数组的方法。常见的有：arguments；DOM方法的返回结果；一个函数也可以被看作是类数组对象，因为它有length属性，代表可接收的参数个数。

```js
// 类数组转为数组的方式:
Array.prototype.slice.call(arrayLike)
Array.prototype.concat.apply([], arrayLike)
Array.prototype.splice.call(arrayLike, 0)
Array.from(arrayLike)
```



### 58. 数组和对象有哪些原生方法，列举一下?

数组和字符串的转换方法：toString, toLocalString, join. 其中join方法可以指定转换为字符串时的分隔符。

数组尾部操作的方法：pop, push。push可以传入多个参数。

数组首部操作的方法：shift, unshift

重排序方法：reverse, sort。sort可以传入一个函数来进行比较，传入前后两个值，如果返回值是正数，则交换两个参数的位置

数组链接的方法：concat，返回拼接好的数组，不影响原数组。

数组插入方法：splice

影响原数组查找特定项的索引的方法：indexOf, lastIndexOf

迭代方法：every, some, filter, map, forEach

数组归并方法：reduce, reduceRight



### 59. 数组的fill方法？

fill(value, start, end)。用一个固定值填充一个数组中，从起始索引到终止索引内的全部元素。不包括中止索引。



### 60. JS中的作用域与变量声明提升？

变量提升：无论我们在函数中何处位置声明的变量，都会被提升到函数的首部，我们可以在变量声明前访问到而不会报错。造成变量提升的本质原因时js引擎在代码执行前有一个解析过程，创建了执行上下文，初始化了一些代码执行时需要用到的对象。当我们访问一个变量时，我们会到当前执行上下文中的作用域链中去查找，而作用域链首端指向的是当前执行上下文的变量对象，这个**变量对象是执行上下文的一个属性**。它包含了函数的形参、所有的函数和变量声明，这个对象是在代码解析的时候创建的。这就是会出现变量声明提升的根本原因。



### 61. 如何编写高性能的JS？

1. 使用位运算符代替一些简单的四则运算。
2. 避免使用过深的嵌套循环
3. 不要使用未定义的变量
4. 善用缓存，避免每次都进行属性查找



### 62. 使用JS获取文件扩展名？

```js
function getFileExtension(filename) {
  if (filename.lastIndexOf('.') < 0) return ''
	return filename.split('.').pop()
}
```



###  63.  介绍一下js的防抖和节流 ？

```js
防抖：在事件被触发n秒后再执行回调，如果在n秒内再次触发事件，则重新计时
节流：规定一个时间，在n秒内只能触发一次回调函数的执行，如果n秒内多次触发，只有一次生效

function debounce(fn, delay) {
  let timer = null
  
  return function() {
    if(timer) {
      clearTimeout(timer)
      timer = null
    }
    
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

function throttle(fn, delay) {
  let timer = null
  return function() {
    if(timer) return
    fn.apply(this, arguments)
    timer = setTimeout(() => {
      timer = null
      clearTimeout(timer)
      // fn.apply(this, arguments)
    }, delay)
  }
}
```



### 64. Object.is()与原来的比较操作符‘==\=’，‘\==’的区别？

使用is方法进行判断时，一般情况下和三等号的判断相同，它处理了 一些特殊的情况，比如-0和+0不再相等，两个NaN认定为是相等的。



### 65. Unicode和UTF-8之间的关系？

unicode是一种字符集合，现在可容纳100多万个字符。每个字符对应一个不同的Unicode编码，它只规定了符号的二进制代码，却没有规定这个二进制代码在计算机中如何编码传输。

UTF-8是一种对Unicode的编码方式，它是一种变长的编码方式，可以用1-4个字节来表示一个字符。



### 66. js中深浅拷贝的实现？

```js
const shallowCopy = (obj) => {
  if (!obj || typeof obj !== `object`) return
  let ret = Array.isArray(obj) ? [] : {}
  
  for(let key in obj) {
    if(obj.hasOwnProperty(key)) {
      ret[key] = obj[key]
    }
  }
  
  return ret
}

const deepCopy = (obj) => {
  if(!obj || typeof obj !== `object`) return
  
  const copied = Array.isArray(obj) ? [] : {}
  for(let key in obj) {
    if(obj.hasOwnProperty(key)) {
      copied[key] = typeof obj[key] === `object` ? deepCopy(obj[key]) : obj[key]
    }
  }
  
  return copied
}
```



### 67. 

