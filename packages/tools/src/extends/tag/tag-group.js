import { Group } from "konva/lib/Group";
import Tag from "./tag";

class TagGroup extends Group {
  constructor(config = {}) {
    super(config);
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
        tag.position({
          x: position[0],
          y: position[1],
        });
        this.add(tag);

        if (highlightTag) {
        }
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
  }
}

export default TagGroup;
