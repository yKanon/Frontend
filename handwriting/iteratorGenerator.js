const iteratorGenerator = (list) => {
  let idx = 0,
    len = list.length;

  return {
    next() {
      let done = idx >= len;
      let value = done ? undefined : list[idx++];

      return {
        value,
        done,
      };
    },
  };
};
