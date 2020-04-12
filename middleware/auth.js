export default function({ store, redirect, route }) {
  if (!store.state.auth.user && route.path !== "/login") {
    return redirect("/login");
  }
}
