var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

for (let i = 0; i < arr.length; i++) {
  const index = ~~(Math.random() * (arr.length - 1));
  [arr[index], arr[i]] = [arr[i], arr[index]];
}

console.log(arr);