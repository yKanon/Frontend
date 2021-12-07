const SERVER_URL = '/server'
let xhr = new XMLHttpRequest()

// 创建 http 请求
xhr.open('GET', SERVER_URL, true)

// 设置状态监听函数
xhr.onreadystatechange = function () {
  if (this.readyState !== 4) return

  // 请求成功时
  if (this.status === 200) {
    handle(this.response)
  } else {
    console.error(this.statusText)
  }
}

// 设置请求失败时
xhr.onerror = function () {
  console.log(this.statusText)
}

xhr.responseType = 'json'
xhr.setRequestHeader('Accept', 'application/json')

// 返送 http 请求
xhr.send(null)
