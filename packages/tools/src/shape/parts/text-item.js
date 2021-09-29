import { Group } from "konva/lib/Group";
import TextField from "./textfield";

class TextItem extends Group {
  constructor(confg = {}) {
    super(confg);
    this.textfiled1 = new TextField({
      height: 20,
      width: 70,
    });
    this.textfiled1.align("left");
    this.textfiled1.draggable(false);
    this.textfield2 = new TextField({
      height: 20,
      x: 70,
      width: 100,
    });
    this.textfield2.align("right");
    this.textfield2.draggable(false);
    this.add(this.textfiled1, this.textfield2);
  }

  setText(key, value) {
    this.textfiled1.text(key);
    this.textfield2.text(value);
  }
}
export default TextItem;
