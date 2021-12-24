export const delay = async (ms, value) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms, value);
  });
};
