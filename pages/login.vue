<template>
  <amplify-authenticator class="flex justify-md-space-around vertical-center"></amplify-authenticator>
  <!--<v-content class="flex justify-md-space-around vertical-center">
    <v-card
      max-width="480"
      width="380"
      :loading="loading"
      lg="6"
      md="8"
      sm="10"
      xs="11"
      class="my-auto px-8 py-3"
    >
      <v-img src="/logo.png"></v-img>
      <v-card-title>Covid19.ET</v-card-title>
      <v-card-subtitle>Log in</v-card-subtitle>
      <v-card-text>
        <v-alert
          color="warn"
          dark
          dense
          dismissible
          class="caption"
          v-if="error"
        >
          {{ error }}
        </v-alert>

        <v-form ref="loginForm">
          <v-row class="mt-6">
            <v-text-field
              outlined
              rounded
              name="username"
              prepend-inner-icon="mdi-account"
              dense
              id="username"
              v-model="username"
              label="Phone/email"
            ></v-text-field>
          </v-row>

          <v-row>
            <v-text-field
              dense
              outlined
              rounded
              prepend-inner-icon="mdi-lock"
              name="password"
              type="password"
              id="password"
              v-model="password"
              label="password"
            ></v-text-field>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="login">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-content>-->
</template>

<script>
import { mapActions } from "vuex";
import { components, AmplifyEventBus } from "aws-amplify-vue";

export default {
  layout: "login-layout",
  data() {
    return {
      username: "",
      password: "",
      loading: false,
      error: false
    };
  },
  components: {
    ...components
  },
  methods: {
    // login() {}
  },
  created() {
    AmplifyEventBus.$on("authState", info => {
      this.$auth.onEvent(info);
      console.log(
        `Here is the auth event that was just emitted by an Amplify component: ${info}`
      );
    });
  }
};
</script>

<style>
.vertical-center {
  margin: auto;
  position: relative;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
