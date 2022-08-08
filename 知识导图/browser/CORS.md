CORS 需要浏览器和后端同时支持。IE8、9需要`XDomainRequest`来实现

浏览器会自动进行 CORS 通信。只要后端配置了相应的 Header 字段`Access-Control-Allow-Origin`，就启用了CORS。它表示哪些域名可以访问资源，如果配置通配符，则表示所有网站都可以访问资源。
