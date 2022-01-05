// 1.
// function call(fn, ctx, ...args) {
//   ctx ?? (ctx = globalThis);
//   // fn.bind(ctx)(...args);
//   ctx.temp = fn;
//   const result = ctx.temp(...args);
//   delete ctx.temp;
//   return result;
// }
// 2.
Function.prototype.myCall = function (ctx = globalThis, ...args) {
  ctx.temp = this;
  const res = ctx.temp(...args);
  delete ctx.temp;
  return res;
};

// 1.
// function apply(fn, ctx, args) {
//   ctx ?? (ctx = globalThis);

//   ctx.temp = fn;
//   const result = ctx.temp(...args);
//   delete ctx.temp;
//   return result;
// }
// 2.
Function.prototype.myApply = function (ctx = globalThis, args) {
  ctx.temp = this;
  const res = ctx.temp(...args);
  delete ctx.temp;
  return res;
};

// 1.
// function bind(fn, ctx, ...args) {
//   ctx.temp = fn;

//   return (...arr) => ctx.temp(...args, ...arr);
// }
// 2.
Function.prototype.myBind = function (ctx, ...args) {
  ctx.temp = this;
  return (...arr) => ctx.temp(...args, ...arr);
};

// test
function add(x, y) {
  console.log('this :>> ', this);
  return x + y + this.a;
}

globalThis.a = 12;
let obj = {
  a: 20,
};

// console.log(call(add, obj, 3, 4));
// console.log(call(add, null, 3, 4));

// console.log(apply(add, null, [3, 4]));
// console.log(apply(add, obj, [3, 4]));

// console.log(bind(add, obj)(3, 4));
console.log(bind(add, obj, 1, 2)(3, 4));
// console.log(bind(add, obj, 3, 4));
