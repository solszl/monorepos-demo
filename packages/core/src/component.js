import EventEmitter from "event-emitter";

/**
 * 组件基类
 *
 * @class Component
 */
class Component {
  constructor() {
    EventEmitter(this);
  }

  destroy() {}
}

export default Component;
