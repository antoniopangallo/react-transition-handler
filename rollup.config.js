import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify-es";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import copy from "rollup-plugin-copy";

const config = {
  input: "./src/index.js",
  output: {
    name: "ReactTransitionHandler",
    globals: {
      react: "React"
    }
  },
  external: ["react"],
  plugins: [
    copy({
      "src/index.css": "build/index.css"
    }),
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs({
      include: /node_modules/
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ]
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(uglify());
}

export default config;
