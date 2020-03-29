import { Auth } from "aws-amplify";
export const state = () => ({
  // this is the default state
  isAuthenticated: false,
  user: null
});

export const mutations = {
  set(state, user) {
    state.isAuthenticated = !!user;
    state.user = user;
  }
};

export const actions = {
  //this mutates the user based on
  //Auth.currentAuthenticatedUser();
  async load({ commit }) {
    try {
      //check for currently loggedin user
      const user = await Auth.currentAuthenticatedUser();
      //then commit the rsult
      commit("set", user);
      return user;
    } catch (err) {
      //if err set current user null
      commit("set", null);
    }
  },

  async login({ commit }, { email, password }) {
    const user = await Auth.signIn(email, password);
    commit("set", user);
    return user;
  },

  async logout({ commit }) {
    await Auth.signOut();
    commit("set", null);
  }
};
