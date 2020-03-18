<template>
  <v-container align-center>
    <h1 class="px-2">Send SMS</h1>
    <v-divider class="mt-4" />
    <v-card flat>
      <v-snackbar v-model="snackbar" absolute top right color="success">
        <span>Message Sent!</span>
        <v-icon dark>mdi-checkbox-marked-circle</v-icon>
      </v-snackbar>

      <v-form ref="form" @submit.prevent="submit">
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="form.number"
                :rules="rules.number"
                color="purple darken-2"
                label="Enter Number"
                required
              ></v-text-field>

              <small class="blue-grey--text">
                Enter a comma separated list of numbers, all in the
                international format i.e. +254712345678, +255787654321
              </small>
            </v-col>

            <v-col cols="12">
              <v-textarea v-model="form.message" color="teal">
                <template v-slot:label>
                  <div>
                    Message
                  </div>
                </template>
              </v-textarea>
              <small class="blue-grey--text">
                Enter your message here
              </small>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-btn text @click="resetForm">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="!formIsValid" text color="primary" type="submit"
            >Send</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
const API_URL = "https://covid-19-eth.herokuapp.com/sendsms";
export default {
  data() {
    const defaultForm = Object.freeze({
      number: "",
      message: ""
    });

    return {
      form: Object.assign({}, defaultForm),
      rules: {
        number: [val => val > 0 || "This field is required"]
      },
      snackbar: false,
      defaultForm
    };
  },

  computed: {
    formIsValid() {
      return this.form.number && this.form.message;
    }
  },

  methods: {
    resetForm() {
      this.form = Object.assign({}, this.defaultForm);
      this.$refs.form.reset();
    },
    submit() {
      console.log("submit form");

      fetch(API_URL, {
        method: "post",
        body: JSON.stringify({
          to: this.form.number,
          message: this.form.message
        }),
        headers: {
          "content-type": "application/json"
        }
      })
        .then(response => response.json())
        .then(result =>
          console.log(result.meessage.SMSMessageData.Recipients[0].status)
        );

      this.snackbar = true;
      this.resetForm();
    }
  }
};
</script>
