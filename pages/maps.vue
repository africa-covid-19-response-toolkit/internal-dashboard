<template>
  <v-layout id="map-wrap" style="height: 100vh">
    <client-only>
      <l-map :zoom="6" :center="[8.997062, 38.769894]">
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>

        <l-marker v-for="(item,index) in markers" :key="index" :lat-lng="item"></l-marker>
      </l-map>
    </client-only>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { marker } from "leaflet";
import { Icon } from "leaflet";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});
export default {
  data() {
    return {
      loading: false,
      markers: false
    };
  },

  methods: {
    ...mapActions("cases", { fetchCases: "find" }),
    fetchCaseServer() {
      this.loading = true;
      this.fetchCases({ query: {} })
        .then(res => {
          this.loading = false;
          this.markers = [];
          res.data.forEach(item => {
            if (item.lat && item.lng) {
              this.markers.push([item.lat, item.lng, item.status]);
            }
          });
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  computed: {
    ...mapGetters("cases", { getCasesStore: "find" }),
    getFromStore() {
      const d = this.getCasesStore({ query: {} });
      console.log(d);
      return d.data.filter(item => {
        return item && item.lat != null && item.lng != null;
      });
    }
  },
  mounted() {
    this.fetchCaseServer();
  }
};
</script>

<style></style>
