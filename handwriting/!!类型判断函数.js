function getType(value) {
  if (value === null) return 'null';

  let type = typeof value
  // 引用类型
  if (type === 'object') {
    let typeString = Object.prototype.toString.apply(value)
    return typeString.slice(8, -1)
  } else {
    return type
  }
}