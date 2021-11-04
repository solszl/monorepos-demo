import { SmartConnect } from "wslink/src";
class SocketTransfer {
  constructor(cfg = {}) {
    this.config = cfg;
  }

  async init() {
    const { host, port, route } = this.config;

    const config = {
      sessionURL: `ws://${host}:${port}/${route}`,
    };
    const sc = SmartConnect.newInstance({ config });
    const session = await this.connect(sc).catch((err) => {
      console.log(err);
      return false;
    });
    this.connection = sc;
    // const tags = await session.call(API_METHOD.tag);

    // this.mpr = new MPR({ tags, session });
    // console.log(tags);
    return true;
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

  getIllegalIndex(index, seriesId, aliasName, loop) {
    const length = this.mpr.getBasis(aliasName).getLength();
    if (loop && index >= length) {
      return 0;
    }

    return Math.max(0, Math.min(index, length - 1));
  }

  async getImage(seriesId, currentIndex, aliasName) {
    const image = await this.mpr.getBasis(aliasName).getImage(currentIndex);
    return image;
  }
}

export default SocketTransfer;
