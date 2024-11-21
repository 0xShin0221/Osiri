const { LANGUAGES } = require("./src/i18n-config");

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
        keyAsDefaultValue: LANGUAGES.DEFAULT.code,
        outputPath: "./public/i18n/{{locale}}/{{ns}}.json",
        defaultNS: "common",
      },
    ],
  ],
};
