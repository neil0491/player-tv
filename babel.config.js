module.exports = {
  presets: [
    "@babel/preset-env",
    { targets: { ie: "11", chrome: "38" } },
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: [],
};
