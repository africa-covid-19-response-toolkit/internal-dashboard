<template>
  <div>
    <h4>CASES</h4>
    <h6>COVID19 LIVE STATUS - ETHIOPIA</h6>
    <v-divider class="mt-4" />
    <v-data-table
      :headers="getHeaders"
      :items="cases.data"
      :loading="loading"
      :options.sync="tableProps"
      :loading-text="loadingText"
      :server-items-length="server_items_length"
      fixed-header
      calculate-widths
      no-results-text="No data"
      class="elevation-1 ma-0"
      ref="table"
    >
      <template v-slot:top>
        <v-toolbar flat class="pt-2">
          <v-text-field
            v-model="tableProps.search"
            prepend-inner-icon="mdi-magnify"
            rounded
            filled
            dense
            single-line
            clearable
            @click:clear="fetchCases"
            @keydown="onSearchKeyDown"
            hint="Search..."
            class="my-8"
          ></v-text-field>
          <v-btn
            small
            rounded
            color="primary"
            @click.stop="fetchCases"
            class="mb-7 ml-4 py-1"
          >SEARCH</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getColor(item.status)"
          small
          dark
          class="caption label pt-1 pb-1"
        >{{ getStatus(item.status) }}</v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn
          v-if="user && (item.added_by === user.id || user.role>=-5)"
          icon
          @click="editItem(item)"
        >
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog width="640" v-model="dialog">
      <v-card class="pa-4">
        <v-card-title>Edit Case Status - {{editedItem.first_name}} {{editedItem.last_name}}</v-card-title>
        <v-alert
          color="error"
          border="left"
          elevation="2"
          outlined
          dismissable
          v-model="error"
        >{{error}}</v-alert>
        <v-form ref="editForm">
          <v-col>
            <v-select
              :rules="nameRules"
              :items="status_amharic"
              label="Patient Status"
              v-model="temp_status"
            />

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
          <v-row>
            <v-spacer />
            <v-btn @click="dialog=false" small class="ma-4">CANCEL</v-btn>
            <v-btn @click="saveForm" color="primary" small class="ma-4">SAVE</v-btn>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import invoiceIt from "@rimiti/invoice-it";
// import printJs from "print-js";
// const numberToWord = require("number-to-words");
// import "vuetify/dist/vuetify.min.css";
import { mapActions, mapGetters } from "vuex";
import editUser from "@/components/AddNewCases";

import Util from "../util/util";

export default {
  components: { editUser },
  //   props: { userRole: Number },
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
      error: false,
      dialog: false,
      nameRules: [v => !!v || "This is required"],

      status_date_fields: [
        "quarantine_time",
        "detection_time",
        "hospitaliztion_time",
        "hospitaliztion_icu_time",
        "recovery_time",
        "death_time"
      ],
      temp_status: false,
      datepicker: false,
      datepicker_status: false,
      date_status: new Date().toISOString().substr(0, 10),
      menu_items: [
        { title: "Edit" }
        // { title: "Disable" },
        // { title: "Edit" }
        // { title: "Delete" }
      ],
      //   menu_items_disabled: [
      //     { title: "Balance" },
      //     { title: "Enable" },
      //     { title: "Edit" }
      //     // { title: "Delete" }
      //   ],
      loading: true,
      loadingText: "Loading ...",
      server_items_length: 0,

      headers: [
        { text: "No.", value: "id", align: "left" },

        {
          text: "First Name",
          value: "first_name",
          align: "left"
        },
        {
          text: "Last Name",
          value: "last_name",
          align: "left"
        },
        {
          text: "Description",
          value: "description",
          align: "left"
        },
        { text: "Age", value: "age" },
        { text: "Sex", value: "sex" },
        { text: "City", value: "city" },
        { text: "Zone", value: "zone" },
        { text: "Region", value: "region" },
        { text: "Nationality", value: "nationality" },
        { text: "status", value: "status", align: "center" },
        { text: "Hospital", value: "hospitalizedAt", align: "center" },
        { text: "Edit", value: "action", sortable: false }
      ],
      // cases: [],

      tableProps: {
        lastSearched: null,
        page: 1,
        itemsPerPage: 10,
        sortBy: ["updatedAt"],
        sortDesc: [true],
        groupBy: [],
        groupDesc: [],
        multiSort: true,
        mustSort: false,
        search: "",
        searchFeild: ["nationality", "region", "description", "email"]
      },
      editedItem: false
    };
  },

  methods: {
    ...mapActions("cases", { patchCase: "patch", fetchFromServer: "find" }),

    async saveForm() {
      if (!this.$refs.editForm.validate()) {
        return;
      }

      if (!this.user) {
        this.error = "Unautherized! You must be logged in first!";
        this.$toast.error("Unautherized! You must be logged in first!");
        return;
      }

      // we are editing existion case
      this.loading = true;
      const data = {};

      const statusIndex = this.status_amharic.indexOf(this.temp_status);
      data.status = this.status[statusIndex];

      if (this.status_date_fields[statusIndex]) {
        data[this.status_date_fields[statusIndex]] = Date.parse(
          this.date_status
        );
      }
      data.added_by = this.user.id;

      await this.patchCase([this.editedItem.id, data, {}])
        .then(res => {
          this.loading = false;
          this.dialog = false;
          this.$toast.show("Successfully Edited");
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
          this.$toast.error("Cannot save ... \n" + err.msg);
          this.error = true;
        });
    },
    getMenuItems(item) {
      return item && !item.disabled
        ? this.menu_items
        : this.menu_items_disabled;
    },
    onSearchKeyDown(keyboardEvent) {
      if (
        keyboardEvent.keyCode === 13 &&
        this.tableProps.lastSearched !== this.tableProps.search
      ) {
        //enter key
        this.fetchCases();
      }
    },

    menuClicked(menu, item) {
      console.log(menu, item);
      this.currentItem = null;
      if (menu.title === "Edit") {
        this.editItem(item);
      }
    },
    fetchCases: async function() {
      this.loading = true;

      this.fetchFromServer({
        query: this.currentQuery
      })
        .then(res => {
          this.loading = false;
          this.server_items_length = res.total;
        })
        .catch(err => {
          this.loading = false;
          console.log("ERRR", err);
        });
    },

    editItem(item) {
      const index = this.status.indexOf(item.status);
      if (index >= 0 && index < this.status_amharic.length) {
        this.temp_status = this.status_amharic[index];
      } else {
        this.temp_status = "";
      }
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    suspendItem(item) {
      const index = this.cases.indexOf(item);
      confirm(`Are you sure you want to suspend ${item.first_name}?`) &&
        this.cases.splice(index, 1);
    },

    getColor(status) {
      if (status === "quarantined") return "blue";
      else if (status === "confirmed") return "red";
      else if (status === "hospitalized") return "orange";
      else if (status === "hospitalized_icu") return "brown";
      else if (status === "recovered") return "green";
      else if (status === "dead") return "black";
      else return "grey";
    },

    getStatus(status) {
      return status;
    },
    reloadTable() {
      this.$refs.table.values = this.cases;
    },
    getAvatar(item) {
      if (!item.image_url) {
        return "favicon.png";
      }
      var path = item.image_url.replace("public/");
      path = path.replace("//", "/");

      return `${Util.apiHost}/${item.image_url.replace("public/", "")}`;
    }
  },

  mounted() {
    this.fetchCases();
  },
  computed: {
    ...mapGetters("cases", { casesFromStore: "find" }),
    cases() {
      delete this.currentQuery.$or;
      return this.casesFromStore({
        query: this.currentQuery
      });
    },

    currentQuery() {
      // const { users } = this.$FeathersVuex.api;
      //map sort values according to backend params
      const sort = {};
      var i = 0;
      for (i = 0; i < this.tableProps.sortBy.length; i++) {
        sort[this.tableProps.sortBy[i]] = this.tableProps.sortDesc[i] ? -1 : 1;
      }

      const query = {
        $sort: sort,
        $limit: this.tableProps.itemsPerPage,
        $skip: (this.tableProps.page - 1) * this.tableProps.itemsPerPage,
        role: this.userRole
      };

      //this line prevents abusive enter key

      const searching =
        this.tableProps.search &&
        this.tableProps.lastSearched !== this.tableProps.search &&
        this.tableProps.search.length > 2;

      this.tableProps.lastSearched = this.tableProps.search;

      if (searching) {
        i = 0;

        //combine queries for searching with or operator
        const or = [];
        for (i = 0; i < this.tableProps.searchFeild.length; i++) {
          const single = {};
          single[this.tableProps.searchFeild[i]] = {
            $like: `%${this.tableProps.search}%`
          };
          or.push(single);
        }
        query.$or = or;
      }
      return query;
    },
    getHeaders() {
      if (this.user) {
        return this.headers;
      } else {
        const h = [...this.headers];
        h.splice(1, 2);
        return h;
      }
    },
    user() {
      return this.$store.state.auth.user;
    },
    skipAmount() {
      return (this.tableProps.page - 1) * this.tableProps.perPage;
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  background-color: #fafafa;
  font: 12pt "Tahoma";
}
* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}
.page {
  width: 21cm;
  min-height: 29.7cm;
  padding: 0.5cm;
  margin: 1cm auto;
  border: 1px #d3d3d3 solid;
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.subpage {
  padding: 1cm;
  border: 5px red solid;
  height: 237mm;
  outline: 2cm #ffeaea solid;
}

#summary_row {
  margin-left: 0.5cm;
  margin-right: 1cm;
  background-color: #efefef;
}

#recipt_title {
  margin-top: 5em;
}

@page {
  size: A4;
  margin: 0;
}
@media print {
  body * {
    display: none;
  }
  .page {
    display: block;
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  }
}
</style>
