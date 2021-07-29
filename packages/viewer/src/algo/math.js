export const vectorUtil = {
  affine3DFromVectorAndPoint: (V, point) => {
    const xTuple = [point[0], V[0]];
    const yTuple = [point[1], V[1]];
    const zTuple = [point[2], V[2]];
    return [xTuple, yTuple, zTuple];
  },
};
