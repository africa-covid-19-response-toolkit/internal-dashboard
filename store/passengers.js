const axios = require("axios").default;

export const state = () => ({
  allPassengers: []
});

export const mutations = {
  set(state, data) {
    state.allPassengers = data;
  }
};

export const actions = {
  async getAllPassengers({ commit, rootState }) {

    let productionUrl = process.env.PRODUCTION_URL
    let headers = {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${rootState.auth.apiToken}`,
      }
    }

    await axios.get(`${productionUrl}/gateway/passengers`, headers)
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
  getAllPassengers: state => {
    return state.allPassengers;
  }
};
