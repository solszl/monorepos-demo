/** 可以使用UserTiming 来替代
 * @see https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API
 */
class TimeTracer {
  constructor() {
    this.tracerMap = new Map();
    this.enable = false;
  }

  /**
   * 用来确定输出的key值
   *
   * @param {*} args 通常是由 viewportId, viewportPlane, functionName 来组合形成
   * @return { string }
   * @memberof TimeTracer
   */
  key(...args) {
    return args.reduce((prev, curr) => {
      if (prev === "") {
        return curr;
      }
      return `${prev} -> ${curr}`;
    }, "");
  }

  /**
   * 根据传入的key确定某个记录值的起始时间
   *
   * @param { string } key
   * @return {*}
   * @memberof TimeTracer
   */
  mark(key) {
    if (!this.enable) {
      return;
    }

    this.tracerMap.set(key, {
      // 记录的时间戳
      recordTime: Date.now(),
      // 记录从网页加载到现在的一个秒值
      recordTimeStamp: performance.now(),
    });
  }

  /**
   * 根据传入的key值查找是否需要进行日志输出
   *
   * @param { string } key
   * @param { string } [extendMsg=""] 附加信息
   * @return {*}
   * @memberof TimeTracer
   */
  measure(key, extendMsg = "") {
    if (!this.enable) {
      return;
    }

    if (!this.tracerMap.has(key)) {
      return;
    }

    const { recordTime, recordTimeStamp } = this.tracerMap.get(key);
    // const startTime = this._formatTime("hh:mm:ss", recordTime);
    const startTime = +recordTimeStamp.toFixed(2);
    const now = +performance.now().toFixed(2);
    const elapseTime = +(now - startTime).toFixed(2);
    console.log(`[${key}]: ${extendMsg} start: ${startTime}, now: ${now}, cost: ${elapseTime}ms`);
    this.tracerMap.delete(key);
  }

  /**
   * 私有函数 格式化时间
   *
   * @param { string } fmt
   * @param { number } ms 时间戳
   * @return {*}
   * @memberof TimeTracer
   */
  _formatTime(fmt, ms) {
    const date = new Date(ms);
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  }
}

export default TimeTracer;
