let url = 'http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled#hash';

function getUrlParam(sUrl, sKey) {
  var paramArr = sUrl.split('?')[1].split('#')[0].split('&');
  const obj = {};
  paramArr.forEach(element => {
    const [key, value] = element.split('=');
    if (obj[key] === void 0) {
      obj[key] = value
    } else {
      obj[key] = [].concat(obj[key], value);
    }
  });
  return sKey === void 0 ? obj : obj[sKey] || ''
}

console.log(getUrlParam(url, 'enabled'));