<template>
  <div>
    <h4>STAFFS and ADMINS</h4>
    <v-divider class="mt-4" />
    <v-data-table
      :headers="getHeaders"
      :items="staffs"
      :loading="loading"
      :options.sync="tableProps"
      :loading-text="loadingText"
      :server-items-length="server_items_length"
      calculate-widths
      @update:page="fetchFromServer"
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
            @click:clear="fetchStaffs"
            @keydown="onSearchKeyDown"
            hint="Search..."
            class="my-8"
          ></v-text-field>
          <v-btn
            small
            rounded
            color="primary"
            @click.stop="fetchStaffs"
            class="mb-7 ml-4 py-1"
          >SEARCH</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.disabled="{ item }">
        <v-icon small :color="item.disabled ? 'error' : 'info'">
          {{
          item.disabled ? "mdi-alert-circle" : "mdi-checkbox-marked-circle"
          }}
        </v-icon>
      </template>
      <template v-slot:item.role="{ item }">
        <v-chip small class="caption label pt-1 pb-1">{{ getRole(item.role) }}</v-chip>
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
        <div row v-if=" item.id !== user.id && (item.added_by===user.id || user.role>item.role )">
          <v-btn icon @click="editItem(item)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="suspendItem(item)">
            <v-icon
              small
              :color="item.disabled ? '' : 'error'"
            >{{item.disabled ? "mdi-checkbox-marked-circle" : "mdi-alert-circle"}}</v-icon>
          </v-btn>
        </div>
        <!-- <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(menu, i) in getMenuItems(item)"
              :key="i"
              @click.stop="menuClicked(menu, item)"
            >
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>-->
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog">
      <v-card>
        <AddStaff
          title="Edit"
          :case="editedItem"
          @canceled="editDialog=false;"
          @successCallback="editDialog=false"
        />
      </v-card>
    </v-dialog>

    <v-dialog width="480" v-model="disableWarning">
      <v-card>
        <v-card-title>Confirm</v-card-title>
        <v-card-text>Are you sure you want to {{disablingItem.disabled? 'ENABLE':'DISABLE'}} {{disablingItem.first_name}}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="disableWarning=false" small class="ma-4">CANCEL</v-btn>
          <v-btn
            @click="disableItem()"
            color="primary"
            small
            class="ma-4"
          >{{disablingItem.disabled? 'ENABLE':'DISABLE'}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AddStaff from "@/components/AddStaff";

import Util from "../util/util";

export default {
  components: { AddStaff },
  data() {
    return {
      menu_items: [{ title: "Edit" }],
      loading: true,
      loadingText: "Loading ...",
      server_items_length: 0,
      editDialog: false,
      editedItem: false,
      disableWarning: false,
      disablingItem: false,
      headers: [
        { text: "ON", value: "disabled" },

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
        { text: "Sex", value: "sex" },
        { text: "City", value: "city" },
        { text: "Zone", value: "zone" },
        { text: "Region", value: "region" },
        { text: "Admin Level", value: "role", align: "center" },
        { text: "status", value: "status", align: "center" },
        { text: "Actions", value: "action", sortable: false }
      ],
      staffs: [],
      tableProps: {
        lastSearched: null,
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [true],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false,
        search: "",
        searchFeild: ["first_name", "last_name", "phone", "email"]
      },

      rolenames: [
        "SysAdmin",
        "Federal",
        "Regional",
        "Zonal",
        "Woreda",
        "Kebele"
      ],
      rolevalues: [-1, -2, -3, -4, -5, -6]
    };
  },

  methods: {
    ...mapActions("admins", { patchAdmin: "patch", fetchFromServer: "find" }),

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
        this.fetchStaffs();
      }
    },

    menuClicked(menu, item) {
      console.log(menu, item);
      this.currentItem = null;
      if (menu.title === "Edit") {
        this.editItem(item);
      }
    },
    fetchStaffs: async function() {
      this.loading = true;

      this.fetchFromServer({
        query: this.currentQuery()
      })
        .then(res => {
          this.loading = false;
          this.server_items_length = res.total;
          this.staffs = res.data;
        })
        .catch(err => {
          this.loading = false;
          console.log("ERRR", err);
        });
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.editDialog = true;
    },

    suspendItem(item) {
      this.disablingItem = item;
      this.disableWarning = true;
    },

    disableItem() {
      if (!this.disablingItem) {
        this.disableWarning = false;
        this.loading = false;
        return;
      }
      this.loading = true;
      this.patchAdmin([
        this.disablingItem.id,
        { disabled: !this.disablingItem.disabled },
        {}
      ])
        .then(success => {
          this.disableWarning = false;
          this.loading = false;
        })
        .catch(err => {
          this.disableWarning = false;
          this.loading = false;
        });
    },
    getColor(status) {
      if (status === 1) return "green";
      else return "grey";
    },

    getStatus(status) {
      return status === 1 ? "online" : "offline";
    },

    getRole(role) {
      const index = this.rolevalues.indexOf(role);

      return (this.tmep_role =
        index >= 0 && index < this.rolenames.length
          ? this.rolenames[index]
          : "");
    },
    reloadTable() {
      this.$refs.table.values = this.Staffs;
    },
    getAvatar(item) {
      if (!item.image_url) {
        return "favicon.png";
      }
      var path = item.image_url.replace("public/");
      path = path.replace("//", "/");

      return `${Util.apiHost}/${item.image_url.replace("public/", "")}`;
    },
    currentQuery() {
      // return {};
      // const { users } = this.$FeathersVuex.api;
      //map sort values according to backend params
      const sort = {};
      var i = 0;
      for (i = 0; i < this.tableProps.sortBy.length; i++) {
        sort[this.tableProps.sortBy[i]] = this.tableProps.sortDesc[i] ? -1 : 1;
      }

      const query = {
        $limit: this.tableProps.itemsPerPage,
        $skip: (this.tableProps.page - 1) * this.tableProps.itemsPerPage
      };

      if (this.addedBy) {
        query.added_by = this.addedBy;
      }

      //this line prevents abusive enter key

      const searching =
        this.tableProps.search &&
        this.tableProps.lastSearched !== this.tableProps.search;

      if (searching) {
        this.tableProps.lastSearched = this.tableProps.search;

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
    }
  },

  mounted() {
    this.fetchStaffs();
  },
  computed: {
    ...mapGetters("admins", { StaffsFromStore: "find" }),
    // staffs() {
    //   // delete this.currentQuery().$or;
    //   // console.log(this.currentQuery());
    //   return this.StaffsFromStore({
    //     query: this.currentQuery
    //   });
    // },

    getEditingItem() {
      return this.editedItem;
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
