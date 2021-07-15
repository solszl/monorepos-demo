(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('event-emitter')) :
  typeof define === 'function' && define.amd ? define(['event-emitter'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Core = factory(global.EventEmitter));
}(this, (function (EventEmitter) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);

  class Renderer {}

  const INTERNAL_EVENT = {
    ENTER_FRAME: "internal_enter_frame",
  };

  const selfRequestAnimationFrame = (callback) => {
    return setInterval(callback, 30);
  };
  const RAF = window.requestAnimationFrame || selfRequestAnimationFrame;

  class Stage {
    constructor() {
      EventEmitter__default['default'](this);
      this._fps = 30;
      this.fpsInterval = 33;
      this.lastRenderTime = Date.now();
      this.rafInterval = RAF(this.render.bind(this));
    }

    render() {
      const { lastRenderTime, fpsInterval } = this;
      if (Date.now() - lastRenderTime < fpsInterval) {
        return;
      }

      this.lastRenderTime = Date.now();
      this.emit(INTERNAL_EVENT.ENTER_FRAME);
    }

    set fps(val) {
      if (this.fps === +val) {
        return;
      }

      this._fps = +val;
      this.fpsInterval = ~~(1000 / +val);
    }

    get fps() {
      return this._fps;
    }
  }

  class Core {
    constructor() {
      this.stage = new Stage();
      this.renderer = new Renderer();
    }
  }

  return Core;

})));
