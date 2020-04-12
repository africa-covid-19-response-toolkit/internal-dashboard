/* eslint-disable quotes */
import colors from "vuetify/es5/util/colors";

export default {
  env: {
    API_URL: process.env.API_URL || "http://localhost:9017",
    GOOGLE_MAPS_API_KEY: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
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
    script: [{
      src: "https://maps.googleapis.com/maps/api/js?key=<PLACE-HOLDER-FOR-G-KEY>&libraries=places"
  }],
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
    { src: "~/plugins/amplify.auth.js", mode: "client" }
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
    "@nuxtjs/axios"
  ],

  toast: {
    position: "top-right",
    duration: 3000
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
    },
    transpile: [/^vue2-google-maps($|\/)/],
    // transpile: ["feathers-vuex", "vue-echarts", "resize-detector"]
  }
};
