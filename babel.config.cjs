const esbuild = require("esbuild");

const result = esbuild.buildSync({
  entryPoints: ["./src/lib/i18n/languages.ts"],
  write: false,
  bundle: true,
  format: "cjs",
  target: "node14",
});

// biome-ignore lint/security/noGlobalEval: <explanation>
const { LANGUAGES } = eval(result.outputFiles[0].text);

module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ],
  plugins: [
    "@babel/plugin-syntax-jsx",
    [
      "i18next-extract",
      {
        locales: LANGUAGES.SUPPORTED.map((l) => l.code),
        keyAsDefaultValue: LANGUAGES.DEFAULT,
        outputPath: "./public/i18n/{{locale}}/{{ns}}.json",
        defaultNS: "home",
      },
    ],
  ],
};
