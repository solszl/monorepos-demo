import BaseTool from "./base/base-tool";
import { INTERNAL_EVENTS } from "../constants";
import { viewState, verify } from "../area";
class ScaleTool extends BaseTool {
    constructor(config = {}) {
        super(config);
        this.isDown = false;
        this.mousemoveY = 0;
        this.offsetY = null;
        this.scale = viewState.scale;
    }

    mouseDown(e) {
        super.mouseDown(e);
        this.isDown = true;
        this.offsetY = e.evt.offsetY;


        const point = this.$stage.getPointerPosition();

        verify(point.x, point.y)


        document.addEventListener("mousemove", this.docMouseMove.bind(this));
        document.addEventListener("mouseup", this.docMouseUp.bind(this));
    }

    docMouseMove(e) {
        if (!this.isDown) return;
        const stepY = e.offsetY - this.offsetY;
        this.offsetY = e.offsetY;

        const ticks = stepY / 200;
        const pow = 1.7;
        const oldFactor = Math.log(this.scale) / Math.log(pow);
        const factor = oldFactor + ticks;
        this.scale = Math.pow(pow, factor);

        if (this.scale < 0.05) {
            this.scale = 0.05;
        } else if (this.scale > 10) {
            this.scale = 10;
        }
        this.isDown && this.$stage.fire(INTERNAL_EVENTS.TOOL_SCALE, { scale: this.scale });
    }

    docMouseUp(e) {
        this.isDown = false;
        console.log(this.isDown);
        document.removeEventListener("mousemove", this.docMouseMove);
        document.removeEventListener("mouseup", this.docMouseUp);
    }

    // mouseMove(e) {
    //     super.mouseMove(e);
    //     if (!this.isDown) return;
    //     const stepY = e.evt.offsetY - this.offsetY;
    //     this.offsetY = e.evt.offsetY;

    //     const ticks = stepY / 200;
    //     const pow = 1.7;
    //     const oldFactor = Math.log(this.scale) / Math.log(pow);
    //     const factor = oldFactor + ticks;
    //     this.scale = Math.pow(pow, factor);

    //     if (this.scale < 0.05) {
    //         this.scale = 0.05;
    //     } else if (this.scale > 10) {
    //         this.scale = 10;
    //     }
    //     this.isDown && this.$stage.fire(INTERNAL_EVENTS.TOOL_SCALE, { scale: this.scale });
    // }

    mouseUp(e) {
        super.mouseUp(e);
        this.isDown = false;
    }
}

export default ScaleTool;
