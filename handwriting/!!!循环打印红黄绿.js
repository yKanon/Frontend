function red() {
  console.log('red');
}

function green() {
  console.log('green');
}

function yellow() {
  console.log('yellow');
}

function sleep(fn, duration) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      fn();
      resolve()
    }, duration);
  })
}

async function main() {
  while (true) {
    await sleep(red, 2000);
    await sleep(yellow, 1000);
    await sleep(green, 3000);
  }
}

main()