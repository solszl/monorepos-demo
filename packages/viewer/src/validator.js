/**
 * 数据验证，如果对比过后可以赋值，返回true、否则返回false
 *
 * @param { object } displayInfo
 * @param { object } newVal
 * @return { boolean }
 */
export const validate = (displayInfo, newVal) => {
  const key = Reflect.ownKeys(newVal)[0];

  const hasKey = Reflect.has(displayInfo, key);
  if (!hasKey) {
    return true;
  }

  const oldVal = Reflect.get(displayInfo, key);
  const newType = typeof newVal[key];
  if (newType === "string" || newType === "boolean") {
    return oldVal !== newVal[key];
  } else if (newType === "object") {
    const allSame = Object.entries(newVal[key]).every(([subKey, subValue]) => {
      return oldVal[subKey] === subValue;
    });

    return !allSame;
  }
};
