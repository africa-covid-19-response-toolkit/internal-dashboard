const axios = require("axios").default;

export const state = () => ({
  // this is the default state
  allstats: null
});

export const mutations = {
  set(state, data) {
    state.allstats = data;
  }
};

export const actions = {
  async loadStats({ commit }) {
    try {
      //this is where we change the url for actual stats
      //TODO: this is where the actual api endpoint url is given
      const stats = await axios.get("https://api.pmo.gov.et/v1/cases/");
      commit("set", stats.data);
      return stats.data;
    } catch (err) {
      commit("set", null);
    }
  }
};

export const getters = {
  getAllStats: state => {
    return state.allstats;
  }
};
