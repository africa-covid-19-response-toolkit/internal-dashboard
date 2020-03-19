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
          <v-col xs="12" sm="6" md="4" lg="4">
            <v-text-field :rules="nameRules" label="Last Name" v-model="formdata.last_name" />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-select
              label="Sex"
              :rules="nameRules"
              :items="['Male', 'Female']"
              v-model="formdata.sex"
            />
          </v-col>

          <v-col xs="12" sm="6" md="4" lg="4">
            <v-text-field :rules="nameRules" type="number" label="Phone" v-model="formdata.phone" />
          </v-col>

          <v-col xs="12" sm="6" md="4" lg="4">
            <v-text-field label="Email" v-model="formdata.email" />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="6" md="6" lg="5">
            <v-select
              label="Admin Level"
              :rules="nameRules"
              :items="allowedAdminLevels"
              v-model="tmep_role"
            />
          </v-col>
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
          <v-spacer />
          <v-btn @click="$emit('canceled')" class="ma-8 my-auto">CANCEL</v-btn>

          <v-progress-circular v-if="loading" color="primary" indeterminate class="my-auto mx-2" />

          <v-btn dark color="primary" @click.stop="saveForm" class="ma-8 my-auto">SAVE</v-btn>
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
    event: ["successCallback", "canceled"]
  },
  props: {
    title: {
      type: String,
      default: "ADD NEW ADMIN/STAFF"
    },
    case: {
      type: Object,
      default: () => {
        return {
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          sex: "",
          image_url: "",
          role: -6,
          kebele: "",
          town: "",
          woreda: "",
          kifleketema: "",
          city: "",
          zone: "",
          region: "",
          country: "",
          added_by: null
        };
      }
    }
  },

  data() {
    return {
      rolenames: [
        "SysAdmin",
        "Federal",
        "Regional",
        "Zonal",
        "Woreda",
        "Kebele"
      ],
      rolevalues: [-1, -2, -3, -4, -5, -6],

      locationRequesting: false,
      tmep_role: "",
      loading: false,
      temp_status: false,
      datepicker: false,
      success: false,
      newuser: false,
      datepicker_status: false,
      date: new Date().toISOString().substr(0, 10),
      date_status: new Date().toISOString().substr(0, 10),
      nameRules: [v => !!v || "This is required"],
      formdata: this.case
    };
  },
  methods: {
    ...mapActions("admins", { findAdmins: "find", patchAdmin: "patch" }),
    async saveForm() {
      if (!this.validate()) {
        return;
      }

      if (!this.admin) {
        this.$toast.error("Error, Not Authorized");
        return;
      }

      const { Admins } = this.$FeathersVuex.api;

      if (this.case.id && this.case.id > 0) {
        // we are editing existion case
        this.loading = true;
        const data = this.formdata;

        this.patchAdmin([this.case.id, data, {}])
          .then(res => {
            this.loading = false;
            this.success = res;
            this.$toast.show("Successfully edited");
            this.$emit("successCallback");
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
            this.$toast.error("Error " + err.message);
            this.err = err;
          });

        return;
      }

      this.loading = true;
      const statusIndex = this.rolenames.indexOf(this.tmep_role);
      const data = this.formdata;
      data.role = this.rolevalues[statusIndex];

      if (this.admin.role < data.role) {
        this.$toast.error("Error cannot add more preveledged user");
        console.log(data, this.admin);
        this.loading = false;
        return;
      }

      data.added_by = this.admin.id;
      if (this.admin.role === -3) {
        data.region = this.admin.region;
      }

      if (this.admin.role === -4) {
        data.region = this.admin.region;
        data.zone = this.admin.zone;
      }

      if (this.admin.role <= -3) {
        data.region = this.admin.region;
        data.zone = this.admin.zone;
        data.woreda = this.admin.woreda;
      }

      console.log(data);

      new Admins(data)
        .create()
        .then(res => {
          this.loading = false;
          this.newuser = res;
          this.success = true;
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
  mounted() {
    if (this.case && this.case.id) {
      const index = this.rolevalues.indexOf(this.case.role);

      this.tmep_role =
        index >= 0 && index < this.rolenames.length
          ? this.rolenames[index]
          : "";
    }
  },
  computed: {
    admin() {
      return this.$store.state.auth.user;
    },
    allowedAdminLevels() {
      if (this.admin) {
        const role = this.admin.role;
        const index = this.rolevalues.indexOf(role);
        return this.rolenames.slice(index, this.rolenames.length);
      } else {
        // return [this.rolenames[4]];
        return [this.rolenames[2]];
      }
    }
  }
};
</script>

<style></style>
