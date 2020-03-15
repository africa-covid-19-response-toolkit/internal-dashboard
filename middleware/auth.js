export default function(context) {
  const { store, redirect, route } = context;
  const { auth } = store.state;
  console.log(route);
  if (
    auth.publicPages.length > 0 &&
    !auth.publicPages.includes(route.name) &&
    !auth.payload
  ) {
    return redirect("/index");
  }
}
