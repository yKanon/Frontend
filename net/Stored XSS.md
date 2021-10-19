存储型 XSS 会把用户输入的数据“存储”在**被攻击服务器端**，当用户浏览器请求数据时，脚本从**被攻击服务器**传回并执行。这种 XSS 具有很强的稳定性。

比较常见的场景是：攻击者在社区或论坛写下一篇包含恶意 Javascript 的文章或评论。在内容发表后，所有访问该内容的用户，都会在他们的浏览器中执行这段恶意的 Javascript 代码。

###### 示例
1. 准备一个输入页面
```javascript
<input type="text" id="input">
<button id="btn">Submit</button>   

<script>
    const input = document.getElementById('input');
    const btn = document.getElementById('btn');

    let val;
     
    input.addEventListener('change', (e) => {
        val = e.target.value;
    }, false);

    btn.addEventListener('click', (e) => {
        fetch('http://localhost:8001/save', {
            method: 'POST',
            body: val
        });
    }, false);
</script>     
```
 2. 启动一个 Node 服务来监听 `save`请求。为了简化，用一个变量保存用户输入
```js
const http = require('http');

let userInput = '';

function handleReequest(req, res) {
    const method = req.method;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    if (method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            if (body) {
                userInput = body;
            }
            res.end();
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
        res.write(userInput);
        res.end();
    }
}

const server = new http.Server();
server.listen(8001, '127.0.0.1');

server.on('request', handleReequest);
```
 3. 用户点击提交按钮将表单提交到服务器时。输入的内容被存储起来。如果用户是攻击者，嵌入了恶意脚本。在用户访问该内容时，恶意代码就会在浏览器端执行
	 ![](../images/net/xss3.gif)
 