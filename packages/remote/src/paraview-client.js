import ParaViewWebClient from "paraviewweb/src/IO/WebSocket/ParaViewWebClient";
import RemoteRenderer from "paraviewweb/src/NativeUI/Canvas/RemoteRenderer";
class ParaViewClient {
  constructor(config = {}) {
    const { connection, el } = config;
    const protocols = ["MouseHandler", "ViewPort", "ViewPortImageDelivery"];
    const client = ParaViewWebClient.createClient(connection, protocols);
    const renderer = new RemoteRenderer(client);
    renderer.setContainer(el);
  }
}

export default ParaViewClient;
