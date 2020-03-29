// import { CookieStorage } from "cookie-storage";

// const cookieStorage = new CookieStorage();
// const storedToken = cookieStorage.getItem("feathers-jwt");

// // see if token is available in URL - this is used when redirecting
// // from oAuth strategies from the api
// const hashTokenAvailable = window.location.hash.indexOf("access_token" > -1);

// export default async context => {
//   // if token is available authenticate the user
//   if (
//     (!context.app.store.state.auth.user && storedToken) ||
//     hashTokenAvailable
//   ) {
//     await context.app.store
//       .dispatch("auth/authenticate")
//       .then(() => {})
//       .catch(e => {
//         console.error(e);
//       });
//   }
// };
