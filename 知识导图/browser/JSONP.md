利用`script`标签没有跨域限制的漏洞。

1. 通过`<script>`标签指向一个需要访问的地址并提供一个回调函数来接受数据。当需要通讯时
```js
<script src="http://domain/api?param1=1&param2=2&callback=jsonp">
</script>
<script>
	// data: 服务端需要传到客户端的数据。函数调用发生在服务端
	function jsonp(data) {
		console.log(data)
	}
</script>
```
jsonp使用简单且兼容性不错。但是只限于`get`请求。

2. 在开发中，可能会遇到多个jsonp请求的回调函数名是相同的，这时候就需要自己封装一个构造jsonp请求的函数，以下是简单实现
```js
function createJSONP(url, success) {
	const script = document.createElement('script')
	script.src = url
	script.async = true
	script.type = 'text/javascript'
	window[`cb${Date.now()}`] = function(data) {
		success && success(data)
	}
	document.body.appendChild(script)
}

jsonp('http://xxxx', (data) => {
	console.log(1)
})
```