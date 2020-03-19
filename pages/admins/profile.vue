<template>
  <v-layout column>
    <v-avatar size="72">
      <v-img></v-img>
    </v-avatar>
    <h4>{{ `${admin.first_name} ${admin.last_name}` }}</h4>
    <v-divider class="my-8" />
    <v-flex class="text-center">
      <v-btn to="/admins/add">ADD ADMIN/STAFF</v-btn>
      <v-btn @click="changedialog=true">CHANGE PASSWORD</v-btn>
      <v-divider class="my-8" />

      <h2>Under construction...</h2>
    </v-flex>
    <v-dialog width="480" v-model="changedialog">
      <v-card :loading="loading">
        <v-card-title>Change password</v-card-title>

        <v-form lazy-validation ref="passForm">
          <v-layout column align-center>
            <v-text-field :rules="passRules" v-model="newpass" label="New password"></v-text-field>
            <v-text-field :rules="passRules" v-model="newpass2" label="Confirm password"></v-text-field>
          </v-layout>
        </v-form>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" small @click="changePassword">Change</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      loading: false,
      newpass: "",
      newpass2: "",
      changedialog: false,
      passRules: [
        v =>
          (!!v && v.length >= 6) ||
          "This is required and must be atleast 6 characters"
      ]
    };
  },
  methods: {
    ...mapActions("admins", { patchAdmins: "patch" }),
    changePassword() {
      if (!this.$refs.passForm.validate()) {
        return;
      }
      if (this.newpass !== this.newpass2) {
        this.$toast.error("Passwords don't match!");
        return;
      }
      if (
        this.admin.phone === "12345678" ||
        this.admin.phone === "1234567890"
      ) {
        this.$toast.error("You cannot change password for demo accounts.");
        return;
      }
      this.loading = true;
      this.patchAdmins([this.admin.id, { password: this.newpass }, {}])
        .then(res => {
          this.loading = false;
          this.$toast.show("Susscess! password changed!");
        })
        .catch(err => {
          this.loading = false;
          this.$toast.error("Error, " + err.message);
        });
    }
  },
  computed: {
    admin() {
      return this.$store.state.auth.user;
    }
  }
};
</script>

<style></style>
