module.exports = (env, argv) => {
  return {
    mode: argv.mode ? argv.mode : 'development',
    devtool: 'eval-source-map',
    entry: __dirname + "/app/main.js",

    output: {
      path: __dirname ,
      filename: "dist/monaco-editor-word-suggestion.js",
      library: {
        root: "monaco-editor-word-suggestion",
        amd: "monaco-editor-word-suggestion",
        commonjs: "monaco-editor-word-suggestion"
      },
      libraryTarget: "umd"
    },
    devServer: {
      static:`./`
    }
  }
}