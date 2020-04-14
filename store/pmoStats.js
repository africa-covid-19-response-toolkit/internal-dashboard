const axios = require("axios").default;
import pmoPatients from '../resources/pmoPatients.json'

export const state = () => ({
  // this is the default state
  allCases: null,
  allPatients: null,
});

export const mutations = {
  setCases(state, data) {
    state.allCases = data
  },
  setPatients(state, data) {
    state.allPatients = data
  },
};

export const actions = {
  async getCases({ commit }) {
    try {
      let headers = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'content-type': 'application/json'
        }
      }

      const cases = await axios.get("https://api.pmo.gov.et/v1/cases/?format=json", headers)
      commit("setCases", cases.data)
      return cases.data
    } catch (err) {
      commit("setCases", null)
    }
  },
  async getPatients({ commit }, limit) {
    try {
      let headers = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'content-type': 'application/json'
        }
      }

      const patients = await axios.get(`https://api.pmo.gov.et/v1/patients/?format=json&limit=${limit}`, headers)
      commit("setPatients", patients.data)
      return patients.data
    } catch (err) {
      commit("setPatients", null)
    }
  },
};

export const getters = {
  getAllCases: state => {
    return state.allCases
  },
  getPatients: state => {
    return state.allPatients
  },
};
