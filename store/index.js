import Vuex from "vuex";
import Vue from "vue";
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import VuePlaceAutocomplete from 'vue-place-autocomplete';

Vue.use(Vuex);
Vue.use(VueGoogleAutocomplete);
Vue.use(VuePlaceAutocomplete);

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
  nuxtServerInit() {},
  nuxtServerInit() {}
};
