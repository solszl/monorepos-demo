const getMax = (arr1, arr2) => {
  let len = Math.max(arr1.length, arr2.length);
  let arr = new Int16Array(len);

  for (let i = 0; i < len; i++) {
    let val1 = arr1[i] || -Infinity;
    let val2 = arr2[i] || -Infinity;

    arr[i] = Math.max(val1, val2);
  }
  return arr;
};

const getMin = (arr1, arr2) => {
  let len = Math.max(arr1.length, arr2.length);
  let arr = new Int16Array(len);

  for (let i = 0; i < len; i++) {
    let val1 = arr1[i] || Infinity;
    let val2 = arr2[i] || Infinity;

    arr[i] = Math.min(val1, val2);
  }
  return arr;
};

const getHalf = (left, right) => {
  return (left + right) >> 1;
};

export { getMax, getMin, getHalf };
