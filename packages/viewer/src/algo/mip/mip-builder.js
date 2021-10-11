import { getHalf, getMax, getMin } from "./mip-fns";
import Node from "./node";
class MipBuilder {
  constructor(config = { fn: "max" }) {
    this.fn = config.fn === "max" ? getMax : getMin;
    this.root = null;
  }

  build(data, left = 0, right = data.length - 1) {
    this.data = data;
    this.root = this._buildTree(left, right);
    this.data.splice(0, this.data.length);
    delete this.data;
  }

  _buildTree(left, right) {
    if (right === left) {
      return new Node({
        left,
        right: left,
        val: this.data[left],
      });
    }

    let half = getHalf(left, right);
    let node = new Node({
      left,
      right,
    });
    let lchild = this._buildTree(left, half);
    let rchild = this._buildTree(half + 1, right);

    node.lchild = lchild;
    node.rchild = rchild;

    if (!lchild?.val.length) {
      node.val = rchild.val;
    } else if (!rchild?.val.length) {
      node.val = lchild.val;
    } else {
      node.val = this.fn(lchild.val, rchild.val);
    }
    return node;
  }

  getValue(start, end) {
    return this.query(this.root, start, end);
  }

  query(node, left, right) {
    if (!node || left > node.right || right < node.left) {
      return new Int16Array(0);
    }

    if (left <= node.left && right >= node.right) {
      return node.val;
    }
    let lmaxVal = [];
    let rmaxVal = [];

    if (node.lchild) {
      lmaxVal = this.query(node.lchild, left, right);
    }
    if (node.rchild) {
      rmaxVal = this.query(node.rchild, left, right);
    }

    if (!lmaxVal.length) {
      return rmaxVal;
    }
    if (!rmaxVal.length) {
      return lmaxVal;
    }
    return this.fn(lmaxVal, rmaxVal);
  }

  destroy() {}
}

export default MipBuilder;
