function sumBigNumber(a, b) {
  a = a + ''
  b = b + ''

  let maxLength = Math.max(a.length, b.length)
  a = a.padStart(maxLength, '0')
  b = b.padStart(maxLength, '0')

  // 按位加时临时变量
  let temp = 0
  // 是否进位
  let flag = 0
  let result = ''

  for (let i = maxLength - 1; i >= 0; i--) {
    temp = +a[i] + (+b[i]) + flag
    flag = ~~(temp / 10)
    result = temp % 10 + result
  }

  // 最大位相加后 flag 为1。则在 result 前加'1'
  if (flag === 1) {
    result = '1' + result
  }

  return
}

const res = sumBigNumber(1111111111111111111111111, 1111111111111111111111111)

console.log(res);