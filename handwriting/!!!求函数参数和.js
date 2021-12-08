function sum(...numbers) {
  return numbers.reduce((prev, cur) => {
    return prev + cur
  })
}

const result = sum(1, 2, 3, 4)
console.log(result);