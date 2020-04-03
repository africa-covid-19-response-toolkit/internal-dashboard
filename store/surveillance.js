const axios = require("axios").default;

export const state = () => ({
  allSurveillance: []
});

export const mutations = {
  set(state, data) {
    state.allSurveillance = data;
  }
};

export const actions = {
  async getAllSurveillance({ commit, rootState }) {

    let productionUrl = process.env.PRODUCTION_URL
    let headers = {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${rootState.auth.apiToken}`
      }
    }

    await axios.get(`${productionUrl}/gateway/surveillance`, headers)
      .then(function (response) {
        commit("set", response.data.result);
      })
      .catch(function (error) {
        console.log(error);

        commit("set", []);
      });
  }
};

export const getters = {
  getAllSurveillance: state => {
    return state.allSurveillance;
  }
};
