<template></template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

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

      status_date_fields: [
        "quarantine_time",
        "detection_time",
        "hospitaliztion_time",
        false,
        "recovery_time",
        "death_time"
      ],
      temp_status: false,
      datepicker: false,
      datepicker_status: false,
      date: new Date().toISOString().substr(0, 10),
      date_status: new Date().toISOString().substr(0, 10),
      nameRules: [v => !!v || "This is required"],
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
        lat: null,
        lng: null
      }
    };
  },
  methods: {
    ...mapActions("cases", [{ findCases: "find" }, { addNewCase: "create" }])
  }
};
</script>

<style>
</style>