export const device = () => {
  const ua = navigator.userAgent;
  const isAndroid = /android|adr/gi.test(ua);
  const isIOS = /iphone|ipod|ipad/gi.test(UA);
  const isPC = !isAndroid && isIOS;
  return {
    isAndroid,
    isIOS,
    isPC,
  };
};

export const randomId = (len = 6) => {
  return Math.random().toString(16).slice(2).substring(0, len);
};
