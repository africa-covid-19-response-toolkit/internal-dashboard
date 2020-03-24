<template>
  <v-container id="map-wrap" :style="mapstyle">
    <client-only>
      <l-map :zoom="6" :center="[8.997062, 38.769894]" class="elevation-0" style="z-index: 0">
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <l-geo-json v-if="geojson" :options="geojsonOptions" :geojson="geojson"></l-geo-json>
        <!-- <l-circle-marker
          v-for="item in markers"
          :key="item.id"
          :lat-lng="item.latlng"
          :stroke="true"
          :color="item.color"
          :fill="true"
          :fillColor="item.color"
          :fillOpacity="0.7"
        >
          <l-popup :content="item.info"></l-popup>
        </l-circle-marker>-->

        <l-marker v-for="item in markers" :key="item.id" :lat-lng="item.latlng">
          <l-popup :content="item.info"></l-popup>
        </l-marker>

        <l-control position="topright">
            <v-btn small rounded @click="fetchFromServer">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
            <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
          </div>
        </l-control>
      </l-map>
    </client-only>
  </v-container>
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
  props: {
    mapstyle: { type: String, default: "min-height: 660px; height: 100%; padding: 0;  " }
  },
  data() {
    return {
      loading: false,
      markers: false,
      geojson: false,
      geojsonOptions: {
        style: {
          color: "#40dd00",
          weight: 2,
          opacity: 0.15
        }
      }
    };
  },

  methods: {
    ...mapActions("cases", { fetchCases: "find" }),

    fetchFromServer() {
      this.loading = true;
      this.fetchCases({
        query: {
          $select: ["lat", "lng", "status", "id", "first_name", "last_name"],
          $limit: 10000
        }
      })
        .then(res => {
          this.loading = false;
          const markers = [];
          res.data.forEach(item => {
            if (item.lat && item.lng) {
              markers.push({
                id: item.id,
                latlng: L.latLng(item.lat, item.lng),
                info: `${item.first_name} ${item.last_name}</br> status: ${item.status}`,
                color: this.getColor(item.status)
              });
            }
            this.markers = markers;
          });
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    async fetchRegionGeoJson() {
      this.loading = true;
      const response = await fetch("/ET_Region.geojson");
      const data = await response.json();
      this.geojson = data;
      this.loading = false;
    },

    getColor(status) {
      if (status === "quarantined") return "blue";
      else if (status === "confirmed") return "red";
      else if (status === "hospitalized") return "orange";
      else if (status === "hospitalized_icu") return "brown";
      else if (status === "recovered") return "green";
      else if (status === "dead") return "black";
      else return "grey";
    }
  },
  computed: {
    ...mapGetters("cases", { getCasesStore: "find" }),
    getFromStore() {
      const d = this.getCasesStore({ query: {} });
      console.log(d);
      const markers = [];
      const markersWithInfo = {};

      d.data.forEach(item => {
        if (item.lat && item.lng) {
          const latlng = markers.push({
            latlng: L.latLng(item.lat, item.lng),
            info: `${item.first_name} ${item.last_name}</br> status: ${item.status}`
          });
        }
      });

      return markers;
    }
  },
  mounted() {
    this.fetchFromServer();
    this.fetchRegionGeoJson();
  }
};
</script>

<style scoped>
/* Container holding the image and the text */
.container {
  position: relative;
  text-align: center;
  color: white;
}

/* Bottom left text */
.bottom-left {
  position: absolute;
  bottom: 8px;
  left: 16px;
}

/* Top left text */
.top-left {
  position: absolute;
  top: 8px;
  left: 16px;
}

/* Top right text */
.top-right {
  position: absolute;
  top: 8px;
  right: 16px;
}

/* Bottom right text */
.bottom-right {
  position: absolute;
  bottom: 8px;
  right: 16px;
}

/* Centered text */
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
