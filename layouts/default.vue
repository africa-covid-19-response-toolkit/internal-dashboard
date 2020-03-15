<template>
  <v-app :style="bgStyle">
    <v-app-bar dark :color="color" elevation="2" hide-on-scroll scroll-off-screen app>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->

      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-toolbar-items class="pa-1">
        <v-btn text to="/">DASHBOARD</v-btn>
        <v-btn v-if="admin" text to="add_new_case">ADD NEW</v-btn>
        <v-btn v-if="admin" text>UPDATE CASE</v-btn>
        <v-btn v-if="admin" icon>
          <v-badge>
            <v-icon>mdi-chart-bubble</v-icon>
          </v-badge>
        </v-btn>
        <v-btn text to="login">LOG IN</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>mdi-repeat</v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      color: "#5778fd",
      btn_color: "#5778ff",
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/"
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "COVID19.ET"
    };
  },
  computed: {
    admin() {
      return this.$store.state.auth.user;
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
