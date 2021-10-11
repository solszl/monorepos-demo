import { transform as coord } from "../../area";
const length = (data) => {
  const obj = JSON.parse(JSON.stringify(data));
  const position = coord.transformPoint(data.position.x, data.position.y);
  const start = coord.transformPoint(data.position.x + data.start.x, data.position.y + data.start.y);
  const end = coord.transformPoint(data.position.x + data.end.x, data.position.y + data.end.y);

  const textPoint = coord.transformPoint(data.position.x + data.textBox.x, data.position.y + data.textBox.y);

  obj.position.x = position[0];
  obj.position.y = position[1];
  obj.end.x = end[0] - position[0];
  obj.end.y = end[1] - position[1];
  obj.start.x = start[0] - position[0];
  obj.start.y = start[1] - position[1];
  obj.textBox.x = textPoint[0] - position[0];
  obj.textBox.y = textPoint[1] - position[1];
  return obj;
};

const angle = (data) => {
  const obj = JSON.parse(JSON.stringify(data));
  const position = coord.transformPoint(data.position.x, data.position.y);
  const start = coord.transformPoint(data.position.x + data.start.x, data.position.y + data.start.y);
  const middle = coord.transformPoint(data.position.x + data.middle.x, data.position.y + data.middle.y);
  const end = coord.transformPoint(data.position.x + data.end.x, data.position.y + data.end.y);
  const text = coord.transformPoint(data.position.x + data.textBox.x, data.position.y + data.textBox.y);

  obj.position.x = position[0];
  obj.position.y = position[1];
  obj.start.x = start[0] - position[0];
  obj.start.y = start[1] - position[1];
  obj.middle.x = middle[0] - position[0];
  obj.middle.y = middle[1] - position[1];
  obj.end.x = end[0] - position[0];
  obj.end.y = end[1] - position[1];
  obj.textBox.x = text[0] - position[0];
  obj.textBox.y = text[1] - position[1];
  return obj;
};

const ellipse_roi = (data) => {
  const obj = JSON.parse(JSON.stringify(data));
  const position = coord.transformPoint(data.position.x, data.position.y);
  const start = coord.transformPoint(data.position.x + data.start.x, data.position.y + data.start.y);
  const end = coord.transformPoint(data.position.x + data.end.x, data.position.y + data.end.y);
  const text = coord.transformPoint(data.position.x + data.textBox.x, data.position.y + data.textBox.y);

  obj.position.x = position[0];
  obj.position.y = position[1];
  obj.end.x = end[0] - position[0];
  obj.end.y = end[1] - position[1];
  obj.start.x = start[0] - position[0];
  obj.start.y = start[1] - position[1];
  obj.textBox.x = text[0] - position[0];
  obj.textBox.y = text[1] - position[1];
  return obj;
};

const fnList = { length, angle, ellipse_roi };
export const transform = (data) => {
  const { type } = data;
  return fnList?.[type](data);
};

export const localToWorld = (x, y) => {
  return coord.transformPoint(x, y);
};

export const worldToLocal = (x, y) => {
  return coord.invertPoint(x, y);
};
