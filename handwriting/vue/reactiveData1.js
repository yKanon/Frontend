let data = { name: 'wss' }
observe(data)
let name = data.name // 触发 get 
data.name = 'hlz' // 触发 set


function observe(data) {
  // 首先进行类型检测
  if (typeof data !== 'object' || data === null) {
    return data
  }

  Object.keys(data).forEach((p => {
    defineReactive(data, p, data[p])
  }))
}

function defineReactive(data, p, value) {
  observe(value)
  let dep = new Dep()

  Object.defineProperty(data, p, {
    enumerable: true,
    configurable: true,

    set: function reactiveSetter(v) {
      console.log('setter')

      // 执行 watcher 的 update 方法
      dep.notify()
      value = v
    },

    get: function reactiveGetter() {
      console.log('getter')

      // 将 watcher 添加到订阅
      Dep.target && dep.addSub(Dep.target)

      return value
    }
  })
}

// 通过 Dep 解耦
class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    // sub 是 Watcher 实例
    this.subs.push(sub)
  }

  notify() {
    this.subs.forEach(sub => {
      subs.update()
    })
  }
}

// 全局属性，通过该属性配置 Watcher
Dep.target = null

function update(value) {
  document.querySelector('div').innerHTML = value
}

class Watcher {
  constructor(obj, key, cb) {
    Dep.target = this
    this.obj = obj
    this.key = key
    this.cb = cb
    this.value = obj[key]
    Dep.target = null
  }

  update() {
    // 获得新值
    this.value = this.obj[this.key]
    // 调用 update 方法更新 DOM
    this.cb(this.value)
  }
}