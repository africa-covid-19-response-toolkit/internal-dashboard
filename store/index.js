import {
  FeathersVuex,
  initAuth,
  hydrateApi,
  makeAuthPlugin,
  models
} from "../plugins/feathers-client";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

const requireModule = require.context(
  // The path where the service modules live
  "../services",
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
);
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default);

export const modules = {
  // Custom modules
};

export const state = () => ({
  // Custom state
});

export const mutations = {
  // Custom mutations
};

export const actions = {
  // Custom actions
  nuxtServerInit({ commit, dispatch }, { req }) {
    return initAuth({
      commit,
      dispatch,
      req,
      moduleName: "auth",
      cookieName: "feathers-jwt"
    });
  },
  nuxtClientInit({ state, dispatch, commit }, context) {
    hydrateApi({ api: models.api });
    if (state.auth.accessToken) {
      return dispatch("auth/onInitAuth", state.auth.payload);
    }
  }
};

export const getters = {
  // Custom getters
};

const auth = makeAuthPlugin({
  userService: "admins",
  state: {
    publicPages: ["login", "index"]
  },
  actions: {
    // Handles initial authentication
    onInitAuth({ state, dispatch }, payload) {
      if (payload) {
        dispatch("authenticate", {
          strategy: "jwt",
          accessToken: state.accessToken
        })
          .then(result => {
            // handle success like a boss
            console.log("logged in");
          })
          .catch(error => {
            // handle error like a boss
            console.log(error, "payload", payload);
          });
      }
    },

    authenticate({state, dispatch}, payload) {
      // Talk to AWS
    }
  }
});

export const plugins = [...servicePlugins, auth];
