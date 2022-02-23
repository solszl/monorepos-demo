import RemoteDicomViewport from "./base/remoteDicomViewport";

class RemoteProbeViewport extends RemoteDicomViewport {
  constructor(options = {}) {
    super(options);
    this.init();
  }
}

export default RemoteProbeViewport;
