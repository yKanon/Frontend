const isObject = (val) =>
  Object.prototype.toString.call(val).slice(8, -1) === "Object";

const serialize = (params) => {
  if (!isObject(params)) {
    return params;
  }

  let res = ``;

  Object.keys(params).forEach((param) => {
    let val = encodeURIComponent(params[param]);
    res += `${param}=${val}&`;
  });

  return res;
};

const defaultHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
};

function request(options) {
  return new Promise(function (resolve, reject) {
    const { method, url, params, headers } = options;
    const xhr = new XMLHttpRequest();

    if (method === "GET" || method === "DELETE") {
      // get和delete一般用querystring传参
      const requestUrl = `${url}?${serialize(params)}`;
      xhr.open(method, requestUrl, true);
    } else {
      xhr.open(method, url, true);
    }

    // 设置请求头
    const mergedHeaders = Object.assign({}, defaultHeaders, headers);
    Object.keys(mergedHeaders).forEach((header) => {
      xhr.setRequestHeader(header, mergedHeaders[header]);
    });

    // 状态监听
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.status);
      }
    };
    xhr.onerror = function (e) {
      reject(e);
    };

    const data =
      method === "POST" || method === "PUT" ? serialize(params) : null;
  });
}
