import "./toolBar.css";
class ToolBar {
  constructor(option) {
    this.toolBarBox = null;
    this.init(option);
  }

  init(option) {
    const { root } = option;
    this._createDom(root);
  }

  addBtn(params) {
    const { name, fun } = params;
    const btn = document.createElement("button");
    btn.className = "tx_toolBar_button";
    btn.innerText = name;
    btn.setAttribute("data-active", false);
    btn["data-active"] = false;
    btn.onclick = () => {
      // NodeList 再低版本浏览器存在兼容问题且无法polyfill
      const btns = Array.from(document.querySelectorAll(".tx_toolBar_button"));
      btns.forEach((item) => item.setAttribute("data-active", false));
      btn.setAttribute("data-active", true);
      fun && fun();
    };
    this.toolBarBox.appendChild(btn);
  }

  _createDom(root) {
    const dom = typeof root === "string" ? document.getElementById(root) : root;
    this.toolBarBox = document.createElement("div");
    this.toolBarBox.className = "tx_toolBar_box";
    dom.appendChild(this.toolBarBox);
  }
}

export default ToolBar;
