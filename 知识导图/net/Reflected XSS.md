反射型 XSS 只是简单的把用户输入的数据“反射”给浏览器，这种攻击方式往往**需要攻击者诱使用户点击一个恶意链接；或者提交一个表单；或者进入一个恶意网站时，注入脚本进入被攻击者的网站**

###### 示例
1. 攻击者提供给被害者一个链接，指向攻击者的服务器并携带参数（localhost:8001/?q=111&p=222）
	![](../images/net/xss1.png)
2. 攻击者服务器处理链接的请求
```js
const http = require('http');
function handleReequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
    res.write('<script>alert("反射型 XSS 攻击")</script>');
    res.end();
}

const server = new http.Server();
server.listen(8001, '127.0.0.1');
server.on('request', handleReequest);
```
 3. 当被害者点击恶意链接时，会发现在攻击者的页面执行了js脚本
	![](../images/net/xss2.png)
	 