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
    const { name, fnc } = params;
    const btn = document.createElement("button");
    btn.className = "tx_toolBar_button";
    btn.innerText = name;
    btn.setAttribute("data-active", false);
    btn["data-active"] = false;
    btn.onclick = () => {
      const btns = document.querySelectorAll(".tx_toolBar_button");
      btns.forEach((item) => item.setAttribute("data-active", false));
      btn.setAttribute("data-active", true);
      fnc && fnc();
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
