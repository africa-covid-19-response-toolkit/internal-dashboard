<template>
  <v-app :style="bgStyle">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      floating
      dark
      color="primary"
      mini-variant-width="54"
      :expand-on-hover="!smallScreen && expandOnHover"
      app
    >
      <v-layout tag="v-list" column>
        <v-chip
          v-if="!miniVariant || expandOnHover"
          small
          color="transparent"
          icon
          class="mx-auto"
          @click.stop="
            miniVariant = !miniVariant;
            expandOnHover = !expandOnHover;
          "
        >
          <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
        </v-chip>
        <v-list>
          <v-container v-if="admin">
            <v-list-item md="auto">
              <v-avatar
                class="center mx-auto my-1 elevation-1"
                color="rgba(255,255,255,0.5)"
                :size="avatarSize"
              >
                <v-img v-if="admin.image_url" :src="admin.image_url"></v-img>
                <v-icon large v-else>mdi-account</v-icon>
              </v-avatar>
            </v-list-item>
            <v-list-item link two-line to="/admins/profile">
              <v-list-item-content>
                <v-list-item-title class="subtitle">
                  {{ admin.first_name }}
                  {{ admin.last_name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ admin.email }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-menu-down</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-container>

          <v-divider class="mx-2"></v-divider>
          <v-list-item v-for="(item, i) in navItems" :key="i" :to="item.to" dense router exact>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-layout>
    </v-navigation-drawer>

    <v-app-bar elevation="8" dark color="primary" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title v-text="title" />
      <span class="overline mx-1 mt-4">ALPHA</span>
      <v-spacer />
      <v-alert dark dense color="red" type="warning" border="left">
        THIS IS A DEMO!! IT IS NOT REAL DATA
        <br />to test the system: login username:1234567890 password:password
      </v-alert>
      <v-btn v-if="admin" text to="/addcases">+NEW</v-btn>
      <v-btn text v-if="!admin" to="/login" router>LOG IN</v-btn>
      <v-btn text v-else @click="signout">LOG OUT</v-btn>

      <v-btn icon @click="fullscreen">
        <v-icon>{{ fullscreenIcon }}</v-icon>
      </v-btn>
      <v-btn @click.stop="darkTheme" icon>
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content class="px-auto">
      <v-container>
        <v-fade-transition>
          <nuxt />
        </v-fade-transition>
      </v-container>
      <v-dialog
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        persistent
        v-model="add_new_case"
      >
        <v-card tile>
          <v-toolbar flat dark color="primary">
            <v-btn icon dark @click="add_new_case = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>New Case Form</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <AddNewCases @successCallback="add_new_case = false" />
        </v-card>
      </v-dialog>
    </v-content>
    <v-footer small app>
      <span class="overline">
        &copy; {{ new Date().getFullYear() }}, Yohannes Ejigu - Fyn
        Systems
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import Util from "@/util/util";
import AddNewCases from "@/components/AddNewCases";
import { mapActions, mapMutations } from "vuex";

export default {
  components: { AddNewCases },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      expandOnHover: true,
      add_new_case: false,
      color: "primary",
      btn_color: "#5778ff",
      isFullscreen: false,
      public: [
        {
          icon: "mdi-apps",
          title: "Dashboard",
          to: "/"
        },
        {
          icon: "mdi-card-text",
          title: "Cases",
          to: "/cases"
        },
        {
          icon: "mdi-map",
          title: "Map",
          to: "/maps"
        },
        {
          icon: "mdi-earth",
          title: "World Data",
          to: "/world"
        }
      ],

      adminsNav: [
        {
          icon: "mdi-apps",
          title: "Dashboard",
          to: "/"
        },
        {
          icon: "mdi-card-text",
          title: "Cases",
          to: "/cases"
        },

        {
          icon: "mdi-cellphone-message",
          title: "Bulk SMS",
          to: "/bulksms"
        },
        {
          icon: "mdi-account-plus",
          title: "Add Staff",
          to: "/admins/add"
        },
        {
          icon: "mdi-account-multiple",
          title: "All Staffs",
          to: "/admins/list"
        },
        {
          icon: "mdi-map",
          title: "Map",
          to: "/maps"
        },
        {
          icon: "mdi-earth",
          title: "World Data",
          to: "/world"
        }
      ],
      miniVariant: true,
      title: "COVID19.ET"
    };
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    async signout() {
      this.loading = true;
      this.deleteAllCookies();
      //delete cookie, yes this is how you delete a cookie
      await localStorage.clear();
      await this.logout();
      this.$router.push("/");
      setTimeout(() => location.reload(true), 200);

      // location.reload(true);
    },
    darkTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    fullscreen() {
      this.isFullscreen = Util.toggleFullScreen();
    },
    deleteAllCookies() {
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  },
  computed: {
    navItems() {
      return this.admin ? this.adminsNav : this.public;
    },
    admin() {
      return this.$store.state.auth.user;
    },
    fullscreenIcon() {
      return this.isFullscreen ? "mdi-fullscreen-exit" : "mdi-fullscreen";
    },
    avatarSize() {
      return /*this.$data.miniVariant ? "46" : */ "48";
    },
    smallScreen() {
      return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs;
    },
    bgStyle() {
      if (!this.$vuetify.theme) {
        return;
      }
      const bgColor = this.$vuetify.theme.dark ? "#333840" : "#efefef";
      return `background-color:${bgColor}`;
    }
  }
};
</script>
<style lang="scss" scoped>
body,
.bg {
  background-image: url("/svg/dashboard.svg");
  background-size: contain; /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
}

html {
  overflow-y: auto !important;
}
</style>
