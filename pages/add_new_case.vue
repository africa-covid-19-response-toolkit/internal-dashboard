<template>
  <v-container align-center>
    <h4>ADD NEW CASE</h4>
    <h6>COVID19 LIVE MONITOR - ETHIOPIA</h6>
    <v-divider class="mt-4" />
    <v-card elevation="1" class="pa-4">
      <v-form>
        <v-row>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-text-field label="First Name" :value="formdata.first_name" />
          </v-col>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-text-field label="Last Name" :value="formdata.last_name" />
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="12" sm="12" md="10" lg="10">
            <v-text-field label="Description of person" :value="formdata.description" />
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-text-field label="Age" :value="formdata.age" />
          </v-col>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-select label="Sex" :items="['Male', 'Female']" :value="formdata.sex" />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-text-field label="Kebele" :value="formdata.kebele" />
          </v-col>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-text-field label="Town" :value="formdata.town" />
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-text-field label="woreda" :value="formdata.wored" />
          </v-col>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-text-field label="Kifle Ketema" :value="formdata.kifleketema" />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-text-field label="City" :value="formdata.city" />
          </v-col>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-text-field label="Region" :value="formdata.region" />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-text-field label="Country" :value="formdata.country" />
          </v-col>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-text-field label="Nationality" :value="formdata.nationality" />
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="12" sm="12" md="6" lg="5">
            <v-select :items="status_amharic" label="Patient Status" :value="formdata.status" />
          </v-col>
          <v-col xs="12" sm="12" md="6" lg="5">
              <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            label="Picker in menu"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
            <v-date-picker label="Onset of first symptom" :v-model="formdata.symptom_onset" />
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
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
      formdata: {
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
        region: "",
        country: "Ethiopia",
        nationality: "",
        status: "",
        symptom_onset: null,
        detection_time: null,
        hospitaliztion_time: null,
        recovery_time: null,
        death_time: null
      }
    };
  }
};
</script>

<style>
</style>