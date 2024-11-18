export default {
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
        locales: ["en", "ja", "fr"],
        keyAsDefaultValue: ["en"],
        outputPath: "./public/i18n/{{locale}}/{{ns}}.json",
        defaultNS: "common",
      },
    ],
  ],
};
