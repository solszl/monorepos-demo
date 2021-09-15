import { SocketTransfer } from "@saga/remote";
import WebTransfer from "./strategies/web/web-transfer";

class Resource {
  constructor() {
    /** @type { Map <string, SocketTransfer | WebTransfer > } {@link SocketTransfer} {@link WebTransfer} */
    this.transfers = new Map();
    window.__TX_RESOURCE__ = this;
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
}

export default Resource;
