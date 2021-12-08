const digitsRE = /(\d{3})(?=\d)/g
function currency(value, currency = '$', decimals = 2) {
  if (!isFinite(value) || !value || value === 0) return ''

  // toFixed 返回 string，四舍五入
  let stringify = Math.abs(value).toFixed(decimals)
  // 整数部分与小数部分
  let [_int, _float] = stringify.split('.')
  _float ? _float = '.' + _float : ''
  // 计算出余数，在第 i 个字符后加逗号
  let i = _int.length % 3
  let head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''
  let sign = value < 0 ? '-' : ''

  return sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
}

let res = currency(-5112311.23)
console.log(res);