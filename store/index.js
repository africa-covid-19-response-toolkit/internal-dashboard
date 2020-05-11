import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

export const state = () => ({
  locales: ['en', 'am'],
  locale: 'en'
  // Custom state
});

export const mutations = {
  // Custom mutations
  SET_LANG (state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  }
};

export const actions = {
  nuxtServerInit() {}
};
