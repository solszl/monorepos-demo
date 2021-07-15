import EventEmitter from "event-emitter";
import { nanoid } from "nanoid";

/**
 * 组件基类
 *
 * @class Component
 */
class Component {
  constructor() {
    EventEmitter(this);
    this.id = nanoid(8);
  }

  destroy() {}
}

export default Component;
