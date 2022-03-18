import { SocketTransfer } from "@pkg/remote/src";
import WebTransfer from "./strategies/web/web-transfer";

class Resource {
  constructor() {
    /** @type { Map <string, SocketTransfer | WebTransfer > } {@link SocketTransfer} {@link WebTransfer} */
    this.transfers = new Map();
  }

  /**
   * 初始化传输方案，支持web与socket两种
   *
   * @param { array } patterns
   * @return {*}
   * @memberof Resource
   */
  async initTransfer(patterns) {
    for await (const pattern of patterns) {
      const { mode } = pattern;
      if (this.transfers.has(mode)) {
        return;
      }

      let constructor = mode === "socket" ? SocketTransfer : WebTransfer;
      const transfer = new constructor(pattern);
      await transfer.init();
      this.transfers.set(mode, transfer);
    }

    this.transferInited = true;
  }

  /**
   * 获取特定类型的传输方案
   *
   * @param {string} [transferMode="web"]
   * @return { WebTransfer | SocketTransfer } WebTransfer | SocketTransfer
   * @memberof Resource
   */
  getTransfer(transferMode = "web") {
    return this.transfers.get(transferMode);
  }

  /**
   * 销毁传输对象，该操作通常用于切换序列以及SDK销毁时进行调用。从而释放对应内存句柄。
   *
   * @memberof Resource
   */
  disposeTransfer() {
    this.transfers.forEach((transfer) => {
      transfer.dispose();
    });

    this.transfers.clear();
    this.transferInited = false;
  }
}

export default Resource;
