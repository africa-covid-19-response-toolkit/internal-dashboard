const axios = require("axios").default;

export const state = () => ({
  allMedicalFacilities: []
});

export const mutations = {
  set(state, data) {
    state.allMedicalFacilities = data;
  }
};

export const actions = {
  async getAllMedicalFacilities({ commit, rootState }) {

    let productionUrl = process.env.PRODUCTION_URL
    let headers = {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${rootState.auth.apiToken}`
      }
    }

    await axios.get(`${productionUrl}/gateway/medical-facilities`, headers)
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
  getAllMedicalFacilities: state => {
    return state.allMedicalFacilities;
  }
};
