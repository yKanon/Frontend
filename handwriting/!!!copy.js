function shallowCopy(target) {
  // 只拷贝对象
  if (typeof target !== 'object' || target === null) {
    return target
  }

  let result = Array.isArray(target) ? Object.setPrototypeOf([], null) : Object.create(null)

  for (const key in target) {
    result[key] = target[key]
  }

  return result
}

function deepCopy(target) {
  if (typeof target !== 'object' || target === null) {
    return target
  }

  let result = Array.isArray(target) ? Object.setPrototypeOf([], null) : Object.create(null)
  // let result
  for (const key in target) {
    result[key] = deepCopy(target[key])
  }

  return result
}