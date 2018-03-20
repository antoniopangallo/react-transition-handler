const plugins = ["annotate-pure-calls"];
const presets = ["stage-1", "react"];

// Jest needs to turn on the transpilation of ES2015 modules { loose: true,  modules: false }
if (process.env.NODE_ENV === "test") {
  presets.unshift(["env"]);
} else {
  presets.unshift(["env", { loose: true, modules: false }]);
  if (process.env.BABEL_ENV !== "es-babel") {
    plugins.push("external-helpers");
  }
}

if (process.env.NODE_ENV === "production") {
  plugins.push("dev-expression", [
    "transform-react-remove-prop-types",
    {
      mode: "remove",
      removeImport: true
    }
  ]);
}

module.exports = {
  presets: presets,
  plugins: plugins
};
