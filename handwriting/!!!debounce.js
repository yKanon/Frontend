// 1. coderwhy
function debounce(fn, delay, immediate = false) {
  let timer = null;

  const handleFn = function debouncedFn(...args) {
    return new Promise((resolve, reject) => {
      if (timer) {
        clearTimeout(timer);
      }

      const that = this;

      if (immediate) {
        let isInvoke = false;
        if (!timer) {
          fn.apply(that, args);
          isInvoke = true;
        }

        timer = setTimeout(() => {
          timer = null;

          if (!isInvoke) {
            resolve(fn.apply(that, args));
          }
        }, delay);
      } else {
        timer = setTimeout(() => {
          resolve(fn.apply(that, args));
        }, delay);
      }
    });
  };

  handleFn.cancel = function cancel() {
    timer && clearTimeout(timer);
  };

  return handleFn;
}
