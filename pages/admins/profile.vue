<template>
  <v-layout>
    <h4>{{ `${admin.first_name}  ${admin.last_name}` }}</h4>
    <v-divider class="mt-4" />
    <v-flex class="text-center">
      <v-btn to="add">ADD ADMIN/STAFF</v-btn>
      <h2>Under construction...</h2>
    </v-flex>
  </v-layout></template
>

<script>
export default {
  computed: {
    admin() {
      return this.$store.state.auth.user;
    }
  }
};
</script>

<style></style>
