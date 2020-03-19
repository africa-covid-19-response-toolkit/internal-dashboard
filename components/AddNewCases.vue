<template>
  <v-container align-center>
    <h4>{{title}}</h4>
    <v-divider class="mt-4" />
    <v-card elevation="1" class="pa-4">
      <v-form lazy-validation ref="form">
        <v-row>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="First Name" v-model="formdata.first_name" />
          </v-col>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="Last Name" v-model="formdata.last_name" />
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="12" sm="6" md="10" lg="10">
            <v-text-field
              :rules="nameRules"
              label="Description of person"
              v-model="formdata.description"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" type="number" label="Age" v-model="formdata.age" />
          </v-col>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-select
              label="Sex"
              :rules="nameRules"
              :items="['Male', 'Female']"
              v-model="formdata.sex"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="Kebele" v-model="formdata.kebele" />
          </v-col>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="Town" v-model="formdata.town" />
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="woreda" v-model="formdata.woreda" />
          </v-col>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="Kifle Ketema" v-model="formdata.kifleketema" />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="City" v-model="formdata.city" />
          </v-col>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="Zone" v-model="formdata.zone" />
          </v-col>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="Region" v-model="formdata.region" />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="Country" v-model="formdata.country" />
          </v-col>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="Nationality" v-model="formdata.nationality" />
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-menu
              ref="onset_menu"
              v-model="datepicker"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="date"
                  label="Symptom onset"
                  prepend-icon="mdi-calendar-check"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="datepicker = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.onset_menu.save(date)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-select
              :rules="nameRules"
              :items="status_amharic"
              label="Patient Status"
              v-model="temp_status"
            />
          </v-col>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-menu
              ref="status_date_menu"
              v-model="datepicker_status"
              :close-on-content-click="false"
              :return-value.sync="date_status"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="date_status"
                  label="Date for the status"
                  prepend-icon="mdi-calendar-check"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date_status" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="datepicker_status = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.status_date_menu.save(date_status)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field
              label="Hospitalized At (if hospitalized)"
              v-model="formdata.hospitalizedAt"
            />
          </v-col>
          <!-- <v-col xs="12" sm="6" md="6" lg="5">
            <v-text-field :rules="nameRules" label="Town" v-model="formdata.town" />
          </v-col>-->
        </v-row>
        <v-divider />
        <v-row>Geo Location (GPS) (optional)</v-row>
        <v-row>
          <v-progress-linear indeterminate v-if="locationRequesting" />
        </v-row>
        <v-row>
          <v-col xs="12" sm="6" md="4" lg="4">
            <v-text-field type="number" label="Latitude" v-model="formdata.lat" />
          </v-col>
          <v-col xs="12" sm="6" md="4" lg="4">
            <v-text-field type="number" label="Longtitude" v-model="formdata.lng" />
          </v-col>
          <v-btn color="primary" @click="requestLocation">Use this device's GPS</v-btn>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>

          <v-btn dark color="primary" @click.stop="saveForm" class="ma-8">SAVE</v-btn>
        </v-row>
        <v-row class="my-0 mx-1">
          <v-progress-linear indeterminate v-if="loading" />
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  model: {
    prop: ["case", "title"],
    event: "successCallback"
  },
  props: {
    title: {
      type: String,
      default: "ADD NEW CASE"
    },
    case: {
      type: Object,
      default: () => {
        return {
          first_name: "",
          last_name: "",
          description: "",
          age: 32,
          sex: "",
          kebele: "",
          town: "",
          woreda: "",
          kifleketema: "",
          city: "",
          zone: "",
          region: "",
          country: "Ethiopia",
          nationality: "",
          status: "",
          hospitalizedAt: "",
          lat: null,
          lng: null
        };
      }
    }
  },

  data() {
    return {
      status_amharic: [
        "ማግለያ የገባ",
        "ቫይረሱ የተገኘበት",
        "ህክምና የጀመረ",
        "በጠና የታመመ (ICU)",
        "ያገገመ",
        "ህይወቱ ያለፈ"
      ],
      status: [
        "quarantined",
        "confirmed",
        "hospitalized",
        "hospitalized_icu",
        "recovered",
        "dead"
      ],

      status_date_fields: [
        "quarantine_time",
        "detection_time",
        "hospitaliztion_time",
        "hospitaliztion_icu_time",
        "recovery_time",
        "death_time"
      ],
      loading: false,
      locationRequesting: false,
      temp_status: false,
      datepicker: false,
      datepicker_status: false,
      date: new Date().toISOString().substr(0, 10),
      date_status: new Date().toISOString().substr(0, 10),
      nameRules: [v => !!v || "This is required"],
      formdata: this.case
    };
  },
  methods: {
    ...mapActions("cases", [
      { findCases: "find" },
      { addNewCase: "create" },
      { patchCase: "patch" }
    ]),
    async saveForm() {
      if (!this.validate()) {
        return;
      }

      if (!this.admin) {
        this.$toast.error("Unautherized! You must be logged in first!");
        return;
      }

      const { cases } = this.$FeathersVuex.api;

      if (this.case.id && this.case.id > 0) {
        // we are editing existion case
        this.loading = true;
        const data = this.formdata;

        if (this.case.status !== this.temp_status) {
          const statusIndex = this.status_amharic.indexOf(this.temp_status);
          data.status = this.status[statusIndex];

          if (this.status_date_fields[statusIndex]) {
            data[this.status_date_fields[statusIndex]] = Date.parse(
              this.date_status
            );
          }
        }

        data.added_by = this.admin.id;

        await this.patchCase([this.case.id, data, {}])
          .then(res => {
            this.loading = false;
            this.success = res;
            this.$toast.show("Successfully added");
            this.$refs.form.reset();
            if (this.successCallback) {
              this.$emit("successCallback");
            }
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
            this.$toast.error("Cannot save ... \n" + err.msg);

            this.err = err;
          });

        return;
      }
      // this.$refs.from.disable();

      this.loading = true;
      const statusIndex = this.status_amharic.indexOf(this.temp_status);
      const data = this.formdata;
      data.status = this.status[statusIndex];
      data.symptom_onset = Date.parse(this.date);

      if (this.status_date_fields[statusIndex]) {
        data[this.status_date_fields[statusIndex]] = Date.parse(
          this.date_status
        );
      }

      console.log(data);

      new cases(data)
        .create()
        .then(res => {
          this.loading = false;
          this.success = res;
          this.reset();
          this.$emit("successCallback");
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
          this.err = err;
        });
    },
    requestLocation() {
      this.locationRequesting = true;
      navigator.geolocation.getCurrentPosition(this.onLocationReady);
    },
    onLocationReady(location) {
      this.locationRequesting = false;
      this.formdata.lat = location.coords.latitude;
      this.formdata.lng = location.coords.longitude;
    },
    validate() {
      return this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  },
  computed: {
    admin() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (this.case.id && this.case.status) {
      const indexOfStatus = this.status.indexOf(this.case.status);
      if (indexOfStatus > -1 && indexOfStatus < this.status_amharic.length) {
        this.temp_status = status_amharic[indexOfStatus];
      }
    }
  }
};
</script>

<style></style>
