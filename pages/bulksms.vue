<template>
  <v-layout column fill-width>
    <h1>BULK SMS</h1>
    <h6>AfricasTalking SMS API<br>
    PHONE NUMBERS SHOULD BE IN INTERNATIONAL FORMAT +251********.</h6>
    <v-divider class="mt-4 mb-4" />
    <v-card elevation="0">
      <v-container fluid class="pa-8 mt-2">
        <v-layout column>
          <!-- <v-alert dark color="error" v-if="error"  dismissible>{{error}}</v-alert>
          <v-alert dark color="info" v-if="success" dismissible>{{success}}</v-alert>-->
          <v-flex xs2 row>
            <v-subheader>To</v-subheader>
            <v-text-field v-model="recipient" label="Phone No. comma separated" />
          </v-flex>
          <v-flex xs12>
            <v-divider></v-divider>
            <v-text-field
              label="Message"
              v-model="message"
              counter
              height="240"
              full-width
              multi-line
            ></v-text-field>
          </v-flex>
          <v-flex row>
            <v-spacer />
            <v-btn color="primary" class="mx-4" @click="clear">CLEAR</v-btn>
            <v-btn color="primary" class="mx-4" @click="send">SEND</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      recipient: "",
      message: "",
      sending: false,
      error: false,
      success: false
    };
  },
  methods: {
    ...mapActions("bulksms", { sendBulkSms: "create" }),
    clear() {
      this.recipient = "";
      this.message = "";
      this.sending = false;
      this.error = false;
      this.success = false;
    },
    send() {
      const reci = this.recipient.replace(" ", "");
      if (reci.length === 0) {
        this.error = "        No phone number       ";
        this.$toast.error(this.error);
        return;
      } else if (this.message.length === 0) {
        this.error = "        No message         ";
        this.$toast.error(this.error);

        return;
      }
      this.sending = true;

      const { bulksms } = this.$FeathersVuex.api;

      new bulksms({
        recipient: reci,
        message: this.message
      })
        .create()
        .then(result => {
          this.success = true;
          this.$toast.info("Success! SMS Sent");
        })
        .catch(err => {
          this.error = err.message;
          this.$toast.error(this.error);
        });
    }
  }
};
</script>

<style>
</style>