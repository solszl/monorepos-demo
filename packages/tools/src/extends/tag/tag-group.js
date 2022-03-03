import { Group } from "konva/lib/Group";
import Tag from "./tag";

class TagGroup extends Group {
  constructor(config = {}) {
    super(config);
    this.id("tagGroup");
  }

  setData(data) {
    this.removeChildren();
    const { tags, highlightTag, path } = data;
    this.path = path;
    this.highlightTag = highlightTag;
    this.tags = tags;
    Object.entries(tags).forEach(([tagKey, tagData]) => {
      return tagData.map((t) => {
        // 未见狭窄的隐藏掉
        if (t.level === 0) {
          return;
        }
        const tag = new Tag();
        tag.setData({ ...t, subname: tagKey });
        const { location } = t;
        const position = path[location];
        const p = this.$transform.transformPoint(position[0], position[1]);
        tag.position({
          x: p[0],
          y: p[1],
        });
        this.add(tag);

        if (highlightTag) {
        }
      });
    });
  }

  autofit() {
    const { children, path } = this;
    children.forEach((child) => {
      const { location } = child.getData();
      const position = path[location];
      const p = this.$transform.transformPoint(position[0], position[1]);
      child.position({
        x: p[0],
        y: p[1],
      });
    });
  }

  renderData() {}

  updateProps(props) {
    const { path } = props;
    const { children } = this;
    // 中线变更，需要重置每个tag的坐标
    if (path && children.length) {
      this.path = path;
      this.setData({
        path,
        tags: this.tags,
        highlightTag: this.highlightTag,
      });
    }

    const { tags } = props;
    if (tags) {
      this.tags = tags;
      this.setData({
        path: this.path,
        tags,
        highlightTag: this.highlightTag,
      });
    }

    const { highlightTag } = props;
    if (highlightTag >= 0) {
      children.forEach((child) => {
        const data = child.getData();
        const { location } = data;
        child.setOpen(highlightTag === location);
      });
    }

    const { visible } = props;
    this.visible(visible ?? true);
  }
}

export default TagGroup;
