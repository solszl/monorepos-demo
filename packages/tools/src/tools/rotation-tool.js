import BaseTool from "./base/base-tool";
import { EVENTS, TOOL_CONSTANTS, TOOL_ITEM_SELECTOR, TOOL_TYPE, INTERNAL_EVENTS } from "../constants";

class RotationTool extends BaseTool {
    constructor(config = {}) {
        super(config);
        this.rotate = 0;
        this.isDown = false;
    }

    mouseDown(e) {
        super.mouseDown(e);
        this.isDown = true;
    }

    mouseMove(e) {
        super.mouseDown(e);
        if (!this.isDown) return;
        this.rotate = (this.rotate + 90) % 360;
        this.$stage.fire(INTERNAL_EVENTS.TOOL_ROTATION, { rotate: this.rotate });
    }

    mouseUp(e) {
        super.mouseUp(e);
        this.isDown = false;
    }
}

export default RotationTool;
