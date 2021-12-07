function format(number) {
  let str = `${number}`
  let decimals = ''
  let integer = ''

  // 包含小数点
  if (str.includes('.')) {
    [integer, decimals] = str.split('.')
  } else {
    // 不包含小数点
    integer = str
  }

}