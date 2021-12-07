let arr = [1, [2, [3, 4, 5]]];

// 1. 
let res = arr.reduce((prev, cur) => {
  if (Array.isArray(cur)) {
    return prev.concat(...cur);
  } else {
    return prev.concat(cur);
  }
}, [])

console.log(res);

// 2.


let res3 = arr.flat(6)
console.log('res3 :>> ', res3);