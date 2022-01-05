// 1. coderwhy
function throttle(fn, delay, trailing = false) {
  let last = 0;
  let timer = null;

  const handleFn = function throttled(...args) {
    return new Promise((resolve, reject) => {
      const that = this;
      const now = new Date().getTime();

      if (now - last > delay) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        resolve(fn.apply(that, args));
        last = now;
      } else if (timer === null && trailing) {
        // 最后一次定时器生效
        timer = setTimeout(() => {
          timer = null;
          resolve(fn.apply(that, args));
        }, delay);
      }
    });
  };

  handleFn.cancel = function cancel() {
    clearTimeout(timer);
    timer = null;
  };

  return handleFn;
}
