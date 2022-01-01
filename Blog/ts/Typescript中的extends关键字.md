`转载: https://jishuin.proginn.com/p/763bfbd663cf`

## 前言

extends 关键字在 TS 编程中出现的频率挺高的，而且不同场景下代表的含义不一样，特此总结一下：

- 表示继承/拓展的含义
- 表示约束的含义
- 表示分配的含义

## 基本使用

`extends`是 ts 里一个很常见的关键字，同时也是 es6 里引入的一个新的关键字。在 js 里，`extends`一般和`class`一起使用，例如：

- 继承父类的方法和属性

``class Animal { kind = 'animal' constructor(kind){ this.kind = kind; } sayHello(){ console.log(`Hello, I am a ${this.kind}!`);  
  }  
}

class Dog extends Animal {  
  constructor(kind){  
    super(kind)  
  }  
  bark(){  
    console.log('wang wang')  
  }  
}

const dog = new Dog('dog');  
dog.name; //  => 'dog'  
dog.sayHello(); // => Hello, I am a dog!

``

这里 Dog 继承了父类的 sayHello 方法，因为可以在 Dog 实例 dog 上调用。

- 继承某个类型

在 ts 里，`extends`除了可以像 js 继承值，还可以继承/扩展类型：

`interface Animal {  
   kind: string;  
 }

interface Dog extends Animal {  
   bark(): void;  
 }  
 // Dog => { name: string; bark(): void }`

## 泛型约束

在书写泛型的时候，我们往往需要对类型参数作一定的限制，比如希望传入的参数都有 name 属性的数组我们可以这么写：

`function getCnames<T extends { name: string }>(entities: T[]):string[] { return entities.map(entity => entity.cname) } `

这里`extends`对传入的参数作了一个限制，就是 entities 的每一项可以是一个对象，但是必须含有类型为`string`的`cname`属性。再比如，redux 里 dispatch 一个 action，必须包含  `type`属性：

`interface Dispatch<T extends { type: string }> { (action: T): T } `

## 条件类型与高阶类型

`SomeType extends OtherType ? TrueType : FalseType; `

> When the type on `the left` of the `extends`is `assignable to the one on the right`, then you’ll get the type in the first branch (the “true” branch); otherwise you’ll get the type in the latter branch (the “false” branch).

`extends`还有一大用途就是用来判断一个类型是不是可以分配给另一个类型，这在写高级类型的时候非常有用，举个 🌰：

`type Human = { name: string; } type Duck = { name: string; } type Bool = Duck extends Human ? 'yes' : 'no'; // Bool => 'yes'`

在 vscode 里或者 ts playground 里输入这段代码，你会发现 Bool 的类型是`'yes'`。这是因为 Human 和 Duck 的类型完全相同，或者说 Human 类型的一切约束条件，Duck 都具备；换言之，类型为 Human 的值可以分配给类型为 Duck 的值`（分配成功的前提是，Duck里面得的类型得有一样的）`，反之亦然。需要理解的是，这里`A extends B`，是指**类型`A`可以分配给类型`B`，而不是说类型`A`是类型`B`的子集**。稍微扩展下来详细说明这个问题：

`type Human = { name: string; occupation: string; } type Duck = { name: string; } type Bool = Duck extends Human ? 'yes' : 'no'; // Bool => 'no'`

当我们给`Human`加上一个`occupation`属性，发现此时`Bool`是`'no'`，这是因为 Duck 没有类型为`string`的`occupation`属性，类型`Duck`不满足类型`Human`的类型约束。因此，`A extends B`，是指**类型`A`可以`分配给`类型`B`，而不是说类型`A`是类型`B`的子集**，理解`extends`在类型三元表达式里的用法非常重要。

继续看示例

`type A1 = 'x' extends 'x' ? string : number; // string  
  type A2 = 'x' | 'y' extends 'x' ? string : number; // number

type P<T> = T extends 'x' ? string : number;  
  type A3 = P<'x' | 'y'> // ?`

A1 和 A2 是`extends`条件判断的普通用法，和上面的判断方法一样。

P 是带参数 T 的泛型类型，其表达式和 A1，A2 的形式完全相同，A3 是泛型类型 P 传入参数`'x' | 'y'`得到的类型，如果将`'x' | 'y'`带入泛型类的表达式，可以看到和 A2 类型的形式是完全一样的，那是不是说明，A3 和 A2 的类型就是完全一样的呢？

有兴趣可以自己试一试，这里就直接给结论了

`type P<T> = T extends 'x' ? string : number; type A3 = P<'x' | 'y'> // A3的类型是 string | number`

是不是很反直觉？这个反直觉结果的原因就是所谓的**分配条件类型**（Distributive Conditional Types）

> When conditional types act on a generic type, they become *distributive* when given a union type

这句话翻译过来也还是看不懂，我直接上大白话了

_对于使用 extends 关键字的条件类型（即上面的三元表达式类型），如果 extends 前面的参数是一个泛型类型，当传入该参数的是联合类型，则使用`分配律`计算最终的结果。分配律是指，`将联合类型的联合项拆成单项`，分别代入条件类型，然后将每个单项代入得到的结果再联合起来，得到最终的判断结果。_

> If we plug a union type into ToArray, then the conditional type will be applied to each member of that union.

还是用上面的例子说明

`type P<T> = T extends 'x' ? string : number; type A3 = P<'x' | 'y'> // A3的类型是 string | number`

该例中，extends 的前参为 T，T 是一个泛型参数。在 A3 的定义中，给 T 传入的是'x'和'y'的联合类型`'x' | 'y'`，满足分配律，于是'x'和'y'被拆开，分别代入`P<T>`

`P<'x' | 'y'> => P<'x'> | P<'y'>`

'x'代入得到

`'x' extends 'x' ? string : number => string`

'y'代入得到

`'y' extends 'x' ? string : number => number`

然后将每一项代入得到的结果联合起来，得到`string | number`

总之，`满足两个要点即可适用分配律`：第一，参数是泛型类型，第二，代入参数的是联合类型

- ##### 特殊的 never

`// never 是所有类型的子类型  
  type A1 = never extends 'x' ? string : number; // string

type P<T> = T extends 'x' ? string : number;  
  type A2 = P<never> // never`

上面的示例中，A2 和 A1 的结果竟然不一样，看起来 never 并不是一个联合类型，所以直接代入条件类型的定义即可，获取的结果应该和 A1 一直才对啊？

实际上，这里还是条件分配类型在起作用。**never 被认为是空的联合类型**，也就是说，没有联合项的联合类型，所以还是满足上面的分配律，然而因为没有联合项可以分配，所以`P<T>`的表达式其实根本就没有执行，所以 A2 的定义也就类似于永远没有返回的函数一样，是 never 类型的。

- ##### 防止条件判断中的分配

`type P<T> = [T] extends ['x'] ? string : number; type A1 = P<'x' | 'y'> // number type A2 = P<never> // string`

在条件判断类型的定义中，将泛型参数使用`[]`括起来，即可阻断条件判断类型的分配，此时，传入参数 T 的类型将被当做一个整体，不再分配。

#### 在高级类型中的应用

- **Exclude**

`Exclude`是 TS 中的一个高级类型，其作用是从第一个联合类型参数中，将第二个联合类型中出现的联合项全部排除，只留下没有出现过的参数。

示例：

`type A = Exclude<'key1' | 'key2', 'key2'> // 'key1' `

Exclude 的定义是

`type Exclude<T, U> = T extends U ? never : T`

这个定义就利用了条件类型中的分配原则，来尝试将实例拆开看看发生了什么：

``type A = `Exclude<'key1' | 'key2', 'key2'>`

//  等价于

type A = `Exclude<'key1', 'key2'>` | `Exclude<'key2', 'key2'>`

// =>

type A = ('key1' extends 'key2' ? never : 'key1') | ('key'2 extends 'key2' ? never : 'key2')

// =>

// never 是所有类型的子类型  
type A = 'key1' | never = 'key1'

``

- **Extract**

高级类型`Extract`和上面的`Exclude`刚好相反，它是将第二个参数的联合项从第一个参数的联合项中`提取出来`，当然，第二个参数可以含有第一个参数没有的项。

下面是其定义和一个例子，有兴趣可以自己推导一下

`type Extract<T, U> = T extends U ? T : never type A = Extract<'key1' | 'key2', 'key1'> // 'key1' `

- **Pick**

`extends`的条件判断，除了定义条件类型，还能在泛型表达式中用来约束泛型参数

`//  高级类型 Pick 的定义  
type Pick<T, K extends keyof T> = {  
    [P in K]: T[P]  
}

interface A {  
    name: string;  
    age: number;  
    sex: number;  
}

type A1 = Pick<A, 'name'|'age'>  
//  报错：类型“"key" | "noSuchKey"”不满足约束“keyof A”  
type A2 = Pick<A, 'name'|'noSuchKey'>

`

`Pick`的意思是，从接口 T 中，将联合类型 K 中涉及到的项挑选出来，形成一个新的接口，其中`K extends keyof T`则是用来约束 K 的条件，即，传入 K 的参数必须使得这个条件为真，否则 ts 就会报错，也就是说，K 的联合项必须来自接口 T 的属性。

以上就是 ts 中  `extends`  关键字的常用场景。

## 参考文献

- https://www.typescriptlang.org/docs/handbook/2/classes.html#extends-clauses
- https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types
- https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints
- https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-inference-in-conditional-types
