# JS 继承的6种方式
## 1. 原型链继承
```javascript
function Parent() {
  this.name = 'kevin'
}
Parent.prototype.getName = function() {
  console.log(this.name)
}

function Child() {}
Child.prototype = new Parent()

let child = new Child()
console.log(child.getName())
```