const axios = require("axios").default;

export const state = () => ({
  // this is the default state
  allstats: false
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
      const stats = await axios.get("https://capi.abren.tech/stats");
      commit("set", stats);
      return stats;
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
