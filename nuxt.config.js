/* eslint-disable quotes */
import colors from "vuetify/es5/util/colors";
require("./config");

module.exports = {
  modules: ["nuxt-stripe-module"],

  stripe: {
    version: "v3",
    publishableKey: process.env.STRIPE_PK
  }
};

export default {
  env: {
    API_URL: process.env.API_URL || "http://localhost:9017",
    GOOGLE_MAPS_API_KEY: process.env.VUE_APP_GOOGLE_MAPS_API_KEY
  },
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  router: {
    middleware: ["auth"]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    // { src: "~/plugins/leaflet.js", ssr: false },
    { src: "~/plugins/google-maps.js" },
    { src: "~/plugins/apex.chart.js" },
    { src: "~/plugins/i18n.js" },
    { src: "~/plugins/amplify.js", ssr: false },
    { src: "~/plugins/amplify.auth.js", mode: "client" },
    { src: "~/plugins/vue-json-to-csv.js" }
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    "@nuxtjs/vuetify"
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // "nuxt-client-init-module",
    ["@nuxtjs/pwa", { Icon: false }],
    "@nuxtjs/toast",
    "nuxt-leaflet",
    "@nuxtjs/axios",
    "nuxt-precompress"
  ],

  nuxtPrecompress: {
    enabled: true, // Enable in production
    report: true, // set false to turn off console messages
    test: /\.(js|css|html|txt|xml|svg|json|geojson)$/, // files to compress on build
    // Serving options
    middleware: {
      // You can disable middleware if you serve static files using nginx...
      enabled: true,
      // Enable if you have .gz or .br files in /static/ folder
      enabledStatic: true,
      // Priority of content-encodings, first matched with request Accept-Encoding will me served
      encodingsPriority: ["br", "gzip"]
    },
    // build time compression settings
    gzip: {
      // should compress to gzip?
      enabled: true,
      // compression config
      // https://www.npmjs.com/package/compression-webpack-plugin
      filename: "[path].gz[query]", // middleware will look for this filename
      threshold: 10240,
      minRatio: 0.8,
      compressionOptions: { level: 9 }
    },
    brotli: {
      // should compress to brotli?
      enabled: false,
      // compression config
      // https://www.npmjs.com/package/compression-webpack-plugin
      filename: "[path].br[query]", // middleware will look for this filename
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8
    }
  },

  toast: {
    position: "top-right",
    duration: 3000
  },

  loadingIndicator: {
    name: "circle",
    color: "#f00",
    background: "#fff"
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: "#fdd30e",
          accent: colors.orange.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: "#fdd30e",
          secondary: "#122a40",
          accent: "#ff9800",
          error: "#f44336",
          warning: "#ff5722",
          info: "#8bc34a",
          success: "#03a9f4"
        }
      }
    }
  },
  pwa: {
    workbox: {
      /* workbox options */
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx && ctx.isClient) {
        config.optimization.splitChunks.maxSize = 256000;
      }
    },
    transpile: [/^vue2-google-maps($|\/)/]
  }
};
