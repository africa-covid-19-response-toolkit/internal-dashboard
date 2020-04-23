// import Vue from "vue";

// class AuthService {
//   constructor(store) {
//     this.$store = store;
//   }

//   get isAuthenticated() {
//     return this.$store.state.auth.isAuthenticated;
//   }

//   get user() {
//     return this.$store.state.auth.user;
//   }

//   set onEvent(event) {
//     if (event === "signedIn") {
//       //just signed in refresh user
//       this.$store.dispatch("auth/load");
//     } else if (event === "signedOut") {
//       this.store.dispatch("auth/set", null);
//     }
//   }
//   get email() {
//     if (!this.user) return;
//     return this.user.attributes.email;
//   }
// }

// export default async ({ store }) => {
//   const authService = new AuthService(store);
//   Vue.$auth = authService;
//   Vue.prototype.$auth = authService;
//   await store.dispatch("auth/load");
// };
