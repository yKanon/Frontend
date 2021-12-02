function myNew(con, ...args) {
  if (typeof con !== 'function') {
    throw new TypeError(`${con} not a function`)
  }

  const obj = Object.create(null)
  Object.setPrototypeOf(obj, con.prototype)
  const result = con.apply(obj, args)

  if (typeof result === 'object' || typeof result === 'function') {
    return result
  }

  return obj
}

function Person(age) {
  this.age = age
}

const person = myNew(Person, 18)
console.log(person);
