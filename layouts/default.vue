<template>
  <v-app :style="bgStyle">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant && !smallScreen"
      clipped
      mini-variant-width="54"
      :expand-on-hover="!smallScreen && expandOnHover"
      app
    >
      <v-layout tag="v-list" column>
        <v-list>
          <v-list-item v-for="(item, i) in navItems" :key="i" :to="item.to" dense router exact>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="$t(item.titleKey)" />
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!-- <v-list-group no-action sub-group value="true" dense>
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-title>{{ $t("menu.languages")}}</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item v-for="(lang, i) in languages" :key="i" dense @click="setLang(lang.value)">
            <v-list-item-action @click="setLang(lang.value)">
              <v-icon>{{ "mdi-earth" }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="$t(lang.titleKey)" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>-->
      </v-layout>
    </v-navigation-drawer>

    <v-app-bar elevation="0" light color="primary"  clipped-left collapse-on-scroll app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-img class="mx-2" src="/logo.png" max-height="60" max-width="190"></v-img>
      <!-- <span class="overline mx-0 mt-6">{{ $t("app.stage") }}</span> -->
      <v-spacer />
      <!-- <v-alert type="error">
        Warning! This is false data! for testing only
        <br />username:1234567890 password:password
      </v-alert>-->

      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn color="secondary" icon v-on="on">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(lang, i) in languages" :key="i" dense @click="setLang(lang.value)">
            <v-list-item-content>
              <v-list-item-title v-text="$t(lang.titleKey)" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon @click="fullscreen">
        <v-icon>{{ fullscreenIcon }}</v-icon>
      </v-btn>
      <v-btn text v-if="!admin" to="/login" router>{{ $t("login") }}</v-btn>
      <v-menu v-else>
        <template v-slot:activator="{ on }">
          <v-btn color="secondary" fab small outlined elevation="0" dark v-on="on">
            <v-img v-if="admin.image_url" :src="admin.image_url"></v-img>
            <v-icon medium v-else>mdi-account-outline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link two-line>
            <v-list-item-content>
              <v-list-item-title>{{ admin.username }}</v-list-item-title>
              <v-list-item-subtitle class="subtitle">{{ admin.first_name }} {{ admin.last_name }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-menu-down</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item @click="signout">
            <v-list-item-title>LOG OUT</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content class="px-auto">
      <v-container fluid class="pa-0">
        <v-fade-transition>
          <nuxt />
        </v-fade-transition>
        <div class="mt-12 text-sm-center" app>
          <span
            class="overline"
          >&copy; {{ new Date().getFullYear() }} ETHIOPIA COVID19 RESPONSE TEAM</span>
        </div>
      </v-container>
    </v-content>
    <!-- <v-footer small app>
      <span class="overline">
        &copy; {{ new Date().getFullYear() }} ETHIOPIA COVID19 RESPONSE TEAM
      </span>
    </v-footer>-->
    <v-speed-dial v-if="admin" v-model="fab" bottom right fixed :open-on-hover="expandOnHover">
      <template v-slot:activator>
        <v-btn v-model="fab" color="secondary" dark fab>
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="green" v-if="admin" to="/admins/add">
        <v-icon>mdi-account-plus-outline</v-icon>
      </v-btn>
      <!-- <v-btn fab dark small color="indigo" v-if="admin" to="/addcases">
        <v-icon>mdi-briefcase-plus-outline</v-icon>
      </v-btn>-->
    </v-speed-dial>
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
      clipped: false,
      drawer: true,
      fixed: false,
      expandOnHover: true,
      add_new_case: false,
      color: "primary",
      btn_color: "#5778ff",
      isFullscreen: false,
      fab: false,
      public: [
        {
          icon: "mdi-apps",
          titleKey: "menu.dashboard",
          to: "/"
        },
        {
          icon: "mdi-briefcase-search-outline",
          titleKey: "menu.surveillance",
          to: "/surveillance"
        },
        {
          icon: "mdi-map-marker-radius",
          titleKey: "menu.map",
          to: "/maps"
        }
      ],
      adminsNav: [
        {
          icon: "mdi-apps",
          titleKey: "menu.dashboard",
          to: "/"
        },
        {
          icon: "mdi-briefcase-search-outline",
          titleKey: "menu.surveillance",
          to: "/surveillance"
        },
        {
          icon: "mdi-map-marker-radius",
          titleKey: "menu.map",
          to: "/maps"
        }
      ],
      languages: [
        {
          titleKey: "lang.amharic",
          value: "am"
        },
        {
          titleKey: "lang.english",
          value: "en"
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
    setLang(lang) {
      this.$store.commit("SET_LANG", lang);
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
      return this.$auth.user;
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
.v-toolbar.v-toolbar--collapsed {
    max-width: 54px;
    overflow: hidden;
}
.v-application--is-ltr .v-toolbar.v-toolbar--collapsed {
    border-bottom-right-radius: 0;
}
</style>
