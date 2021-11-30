export default {
  server: {
    host: "0.0.0.0",
    port: 9999,
  },
  ssr: false,
  target: "static",
  router: {
    base: "/mira/",
  },
  head: {
    title: "Mira",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no",
      },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
  },
  render: {
    static: {
      setHeaders(res: any) {
        res.setHeader("Access-Control-Allow-Origin", "cdn.jsdelivr.net");
      },
    },
  },

  css: [
    "~/assets/reset.css",
    "~/assets/global.css",
    "@spectrum-css/vars/dist/spectrum-global.css",
    "@spectrum-css/vars/dist/spectrum-medium.css",
    "@spectrum-css/vars/dist/spectrum-light.css",
    "@spectrum-css/vars/dist/spectrum-dark.css",
    "@toshusai/spectrum-vue/dist/index.css",
  ],

  plugins: ["~/plugins/register"],

  // components: true,

  buildModules: ["@nuxt/typescript-build"],

  generate: {
    dir: "../../dist/renderer",
  },

  // https://github.com/nuxt/nuxt.js/issues/9224#issuecomment-893289291
  build: {
    babel: {
      plugins: [
        ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
      ],
    },
    extend(config: any) {
      const path = require("path");
      config.resolve.alias.vue = path.join(__dirname, "../../node_modules/vue");
      config.performance = config.performance || {};
      config.performance.maxEntrypointSize = 1000 * 1024;
      config.performance.maxAssetSize = 1000 * 1024;
      config.optimization.splitChunks.maxSize = 100 * 1024;
    },
  },
};
