const axios = require("axios").default;

export const state = () => ({
  allTollFree: []
});

export const mutations = {
  set(state, data) {
    state.allTollFree = data;
  }
};

export const actions = {
  async getAllTollFree({ commit, rootState }) {

    let headers = {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${rootState.auth.apiToken}`
      }
    }

    await axios.get('https://api.ethiopia-covid19.com/gateway/toll-free', headers)
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
  getAllTollFree: state => {
    return state.allTollFree;
  }
};
