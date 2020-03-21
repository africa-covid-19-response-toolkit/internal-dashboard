<template>
  <v-layout id="map-wrap" style="height: 100vh">
    <client-only>
      <l-map :zoom="6" :center="[8.997062, 38.769894]">
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <l-marker
          v-for="(item, index) in getFromStore"
          :key="index"
          :lat-lng="item.latlng"
          @add="$nextTick(() => $event.target.openPopup())"
        >
          <l-popup :content="item.info"></l-popup>
        </l-marker>
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
    ...mapActions("cases", { fetchCases: "find" })
  },
  computed: {
    ...mapGetters("cases", { getCasesStore: "find" }),
    getFromStore() {
      const d = this.getCasesStore({ query: {} });
      console.log(d);
      const markers = [];
      const markersWithInfo = {};

      d.data.forEach(item => {
        if (item.lat != null && item.lng != null) {
          const latlng = [item.lat, item.lng];
          const info = `${item.first_name} ${item.last_name}</br> status:${item.status}`;
          markers.push({ latlng, info });
        }
      });

      return markers;
    }
  },
  mounted() {
    this.fetchCases({
      query: {
        $select: ["lat", "lng", "status", "id", "first_name", "last_name"]
      }
    })
      .then(res => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        console.log(err);
      });
  }
};
</script>

<style></style>
