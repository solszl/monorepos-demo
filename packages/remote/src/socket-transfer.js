// 基于paraview的SmartConnect进行链接控制
import { SmartConnect } from "wslink/src";

class SocketTransfer {
  constructor(cfg = {}) {
    this.config = cfg;
    this.sockets = new Map();
  }

  async init() {
    const { host, routes } = this.config;

    for await (const route of routes) {
      const config = {
        sessionURL: `${host}/${route}`,
      };

      const sc = SmartConnect.newInstance({ config });
      await this.connect(sc);
      // maybe `vtkserver/${series_id}/${route}
      // 匹配出 ${route}
      this.sockets.set((route ?? "").split("/").at(-1), sc);
    }
  }

  async connect(sc) {
    return new Promise((resolve, reject) => {
      sc.onConnectionReady((callback) => {
        console.log("connected.");
        resolve(sc.getSession());
      });
      sc.onConnectionError((callback) => {
        console.log("connected error");
        reject(new Error("connected error"));
      });
      sc.onConnectionClose((data, err) => {
        reject(new Error(err));
      });
      sc.connect();
    });
  }

  getConnection(route) {
    return this.sockets.get(route);
  }

  getIllegalIndex(index, seriesId, plane, loop) {
    return index;
  }

  dispose() {
    this.sockets.forEach((socket) => {
      socket.destroy();
    });

    this.sockets.clear();
  }
}

export default SocketTransfer;
