module.exports = (props) => {
  props.cache(true);
  const presetConfig = {
    targets: {
      chrome: "49",
    },
    useBuiltIns: "usage",
    corejs: {
      version: 3,
      proposals: true,
    },
  };

  const presets = [["@babel/preset-env", presetConfig]];
  const plugins = [
    ["@babel/plugin-transform-runtime"],
    "@babel/plugin-proposal-export-default-from", // Stage 1
    "@babel/plugin-proposal-logical-assignment-operators",
    ["@babel/plugin-proposal-optional-chaining", { loose: false }],
    ["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }],
    ["@babel/plugin-proposal-nullish-coalescing-operator", { loose: false }],
    "@babel/plugin-proposal-do-expressions",
    ["@babel/plugin-proposal-decorators", { legacy: true }], // Stage 2
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions",
    "@babel/plugin-syntax-dynamic-import", // Stage 3
    "@babel/plugin-syntax-import-meta",
    ["@babel/plugin-proposal-class-properties", { loose: false }],
    "@babel/plugin-proposal-json-strings",
    "@babel/plugin-proposal-object-rest-spread",
  ];
  return { presets, plugins };
};
