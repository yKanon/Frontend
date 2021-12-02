function myInstanceof(obj, con) {
  const prototype = con.prototype; // 获取构造函数的 prototype 对象
  const proto = Object.getPrototypeOf(obj) // 获取对象的原型

  // 判断构造函数的 prototype 对象是否在对象的原型链上
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