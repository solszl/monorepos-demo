class Node {
  constructor({ val, left, right, lchild, rchild }) {
    this.val = val;
    this.left = left;
    this.right = right;
    this.lchild = lchild;
    this.rchild = rchild;
  }

  dispose() {
    this.lchild = null;
    this.rchild = null;
    delete this.lchild;
    delete this.rchild;
    delete this.val;
  }
}

export default Node;
