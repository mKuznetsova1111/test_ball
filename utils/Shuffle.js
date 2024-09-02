function random(n) {
  return Math.floor(Math.random() * Math.floor(n));
}

export default function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    let j = random(arr.length);
    let k = random(arr.length);
    let t = arr[j];
    arr[j] = arr[k];
    arr[k] = t;
  }
  return arr;
}