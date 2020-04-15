<template>
  <v-container id="map-wrap" class="py-0" :style="mapstyle">
    <v-row style="height: 100%;">
      <v-col cols="12" xs="12" sm="12" md="12" lg="12" class="py-0">
        <v-card elevation="1" tile style="height: 100%; border-top: 0px;">
          <client-only>
            <l-map
              ref="map"
              :zoom="zoom"
              :center="[8.9, 40.5]"
              class="elevation-0"
              style="z-index: 0"
            >
              <!-- <l-tile-layer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" /> -->
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <l-geo-json
                :geojson="geojson"
                :options="geojsonOptions"
              ></l-geo-json>
              <l-control position="topright">
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-btn small rounded @click="fetchData">
                  <v-icon>mdi-reload</v-icon>
                </v-btn>
              </l-control>
            </l-map>
          </client-only>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import ethiopiaMap from "@/resources/ethiopia_regions.json";
import { latLng, latLngBounds } from "leaflet";

const COLOR_RANGES = [
  "#888",
  "#228b22",
  "#ff8000",
  "orangered",
  "red",
  "darkred"
];
const SAMPLE_DATA = {
  "ET-TI": {
    tested: 200,
    confirmed: 1,
    hospitalized: 0,
    critical: 0,
    recovered: 0,
    dead: 0
  },
  "ET-AF": {
    tested: 200,
    confirmed: 0,
    hospitalized: 0,
    critical: 0,
    recovered: 0,
    dead: 0
  },
  "ET-AM": {
    tested: 400,
    confirmed: 4,
    hospitalized: 3,
    critical: 0,
    recovered: 0,
    dead: 0
  },
  "ET-BE": {
    tested: 100,
    confirmed: 0,
    hospitalized: 0,
    critical: 0,
    recovered: 0,
    dead: 0
  },
  "ET-OR": {
    tested: 500,
    confirmed: 4,
    hospitalized: 2,
    critical: 0,
    recovered: 0,
    dead: 0
  },
  "ET-GA": {
    tested: 50,
    confirmed: 0,
    hospitalized: 0,
    critical: 0,
    recovered: 0,
    dead: 0
  },
  "ET-SN": {
    tested: 100,
    confirmed: 1,
    hospitalized: 0,
    critical: 0,
    recovered: 0,
    dead: 0
  },
  "ET-SO": {
    tested: 100,
    confirmed: 0,
    hospitalized: 0,
    critical: 0,
    recovered: 0,
    dead: 0
  },
  "ET-AA": {
    tested: 500,
    confirmed: 25,
    hospitalized: 20,
    critical: 2,
    recovered: 2,
    dead: 2
  },
  "ET-HA": {
    tested: 50,
    confirmed: 0,
    hospitalized: 0,
    critical: 0,
    recovered: 0,
    dead: 0
  },
  "ET-DD": {
    tested: 50,
    confirmed: 5,
    hospitalized: 0,
    critical: 0,
    recovered: 0,
    dead: 0
  }
};

export default {
  props: {
    zoom: {
      type: Number,
      default: 6
    },
    mapstyle: {
      type: String,
      default: "min-height: 780px; height: 100%;"
    },
    onRegionClick: {
      type: Function,
      default: undefined
    },
    onRegionHover: {
      type: Function,
      default: undefined
    }
  },

  data() {
    return {
      regionData: SAMPLE_DATA,
      totalCases: Object.values(SAMPLE_DATA).reduce(
        (sum, item) => sum + item.confirmed,
        0
      ),
      loading: false,
      geojson: ethiopiaMap,
      geojsonOptions: {
        onEachFeature: this.handleFeatureEvents,
        style: this.getStyle
      }
    };
  },
  methods: {
    highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        color: "black",
        fillOpacity: 0.7
      });
      layer.bringToFront();

      if (this.$props.onRegionHover) {
        this.$props.onRegionHover(feature);
      }
    },
    resetHighlight(e) {
      var layer = e.target;

      layer.setStyle({
        color: "white",
        fillOpacity: 0.75
      });
      // layer.sendToBack();
    },
    handleClickRegion(e) {
      if (this.$refs.map) {
        this.$refs.map.mapObject.fitBounds(e.target.getBounds());
      }
      const feature = e.target.feature;

      if (this.$props.onRegionClick) {
        this.$props.onRegionClick(feature);
      }
    },
    handleFeatureEvents(feature, layer) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.handleClickRegion
      });

      const featureProps = feature.properties;
      const regionalCases = this.regionData[feature.id];

      layer.bindTooltip(
        `<div class="map-region-info">
          <div><h2>${featureProps.NAME_EN}</h2></div>
          <div>TESTED: <strong>${regionalCases.tested}</strong></div>
          <div>CONFIRMED: <strong>${regionalCases.confirmed}</strong></div>
          <div>RECOVERED: <strong>${regionalCases.recovered}</strong></div>
          <div>DEAD: <strong>${regionalCases.dead}</strong></div>
          </div>
          `,
        { permanent: false, sticky: true, className: "map-region-info" }
      );
    },
    getColor(featureProps) {
      const data = this.regionData[featureProps.id];

      if (!data || !data.confirmed) {
        return COLOR_RANGES[0];
      }

      const confirmedPct = data.confirmed / this.totalCases;

      if (confirmedPct <= 0.05) {
        return COLOR_RANGES[1];
      } else if (confirmedPct > 0.05 && confirmedPct <= 0.1) {
        return COLOR_RANGES[2];
      } else if (confirmedPct > 0.1 && confirmedPct <= 0.2) {
        return COLOR_RANGES[3];
      } else if (confirmedPct > 0.2 && confirmedPct <= 0.5) {
        return COLOR_RANGES[4];
      } else {
        return COLOR_RANGES[5];
      }
    },
    getStyle(feature) {
      return {
        fillColor: this.getColor(feature.properties),
        fillOpacity: 0.75,
        weight: 1.5,
        color: "white",
        opacity: 1
      };
    },
    fetchData() {
      this.loading = true;

      this.$axios
        .get("https://api.pmo.gov.et/v1/cases/?format=json&limit=0")
        .then(res => {
          this.loading = false;
          res.shs.results.forEach(item => {
            // TODO: update regionData
          });
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
/* Container holding the image and the text */

.map__region_name {
  font-size: 20px;
  font-weight: 500;
}

.map__region_total_cases {
  margin: 10px 0px 10px 0px;
}

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

<style>
.leaflet-tooltip.map-region-info {
  width: 200px;
  overflow: hidden;
  overflow-wrap: normal;
  word-wrap: normal;
  word-break: normal;
  white-space: normal;
}

.leaflet-tooltip.map-region-info h2 {
  font-size: 1rem;
  margin: 8px auto;
  margin-top: 0;
}

.leaflet-tooltip.map-region-info div {
  text-align: left;
}

.leaflet-tooltip.map-region-info strong {
  display: block;
  font-size: 1.3rem;
  margin: 8px auto;
  margin-top: 2px;
}
</style>
