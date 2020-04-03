const axios = require("axios").default;

export const state = () => ({
  allCommunities: []
});

export const mutations = {
  set(state, data) {
    state.allCommunities = data;
  }
};

export const actions = {
  async getAllCommunities({ commit, rootState }) {

    let productionUrl = process.env.PRODUCTION_URL
    let headers = {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${rootState.auth.apiToken}`
      }
    }

    await axios.get(`${productionUrl}/gateway/communities`, headers)
      .then(function (response) {
        commit("set", response.data.result);
      })
      .catch(function (error) {
        console.log(error);

        commit("set", []);
      });
  },

  async getCommunity( { commit, rootState }, { id } ) {
    
    let productionUrl = process.env.PRODUCTION_URL
    let headers = {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${rootState.auth.apiToken}`
      }
    }

    await axios.get(`${productionUrl}/gateway/communities/${id.id}`, headers)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};

export const getters = {
  getAllCommunities: state => {
    return state.allCommunities;
  }
};
