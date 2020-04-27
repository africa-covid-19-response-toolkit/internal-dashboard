<template>
  <v-container id="map-wrap" :style="mapstyle" class="pa-3">
    <v-card elevation="0" hover tile style="height: 100%; border-top: 0px;">
      <GmapMap
        :center="{
           lat: 8.96,
           lng: 40.35
          }"
        :zoom="6.0"
        style="width: 100%; height: 100%;"
        ref="frontPageMap"
      >
        <GmapInfoWindow
          v-if="showingInfoWindow"
          @closeclick="showingInfoWindow=false"
          :options="{
                        pixelOffset: {
                            width: 0,
                            height: 0
                        }
                    }"
          :position="infoWindowPosition"
        >
          <v-row>
            <v-col xs="12">
              <h2 class="map__region_name">{{ infoWindowDetails.name }}</h2>
              <p class="map__region_total_cases">
                Total Cases:
                <span class="status_classes">{{ infoWindowDetails.totalCases }}</span>
              </p>
            </v-col>
          </v-row>
        </GmapInfoWindow>
      </GmapMap>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import _forEach from "lodash/forEach";
import _map from "lodash/map";
import _find from "lodash/find";
import _filter from "lodash/filter";
import { gmapApi } from "vue2-google-maps";
// import administrativeZoneDataAll from "../resources/ethiopia_administrative_zones_full.json";
import pmoPatients from "../resources/pmoPatients.json";
import Util from "@/util/util";

const POLYGON_COLORS = ["rgba(253,211,14,0.8)", "#800000", "#FF0000"];

function roundValue(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function polygonColor(count) {
  var color = null;
  if (count === 0) {
    color = POLYGON_COLORS[0];
  }

  if (count > 0) {
    color = POLYGON_COLORS[1];
  }

  if (count > 1) {
    color = POLYGON_COLORS[2];
  }

  return color;
}

function transformDataForGoogleMaps(latLongData) {
  return {
    lat: parseFloat(roundValue(latLongData[1], 3))
      ? parseFloat(roundValue(latLongData[1], 3))
      : 0,
    lng: parseFloat(roundValue(latLongData[0], 3))
      ? parseFloat(roundValue(latLongData[0], 3))
      : 0
  };
}

function createNewRegionRecord(data) {
  return {
    adminRegion1Id: data.properties.ID_1,
    adminRegion1Name: data.properties.NAME_1,
    adminRegion3Id: data.properties.ID_3,
    name: data.properties.NAME_3,
    totalCases: 0,
    totalRecovered: 0,
    totalHospitalized: 0,
    totalIsolated: 0,
    totalDeceased: 0,
    firstCase: null
  };
}

export default {
  props: {
    mapstyle: {
      type: String,
      default:
        "min-height: 660px; height: 100%; width: 100%; max-width: none; padding: 0;"
    }
  },

  data() {
    return {
      map: undefined,
      administrativeZoneDataAll: null,
      regionSelected: false,
      showingInfoWindow: false,
      infoWindowPosition: null,
      infoWindowDetails: null,
      currentRegion: null,
      regionRecords: [],
      regionOverlayRecords: [],
      largestCases: 1,
      sampleData: [
        {
          name: "Enderta",
          lat: 13.493334,
          lng: 39.46907,
          confirmed: 0,
          hospitalized: 0,
          critical: 0,
          dead: 0
        },
        {
          name: "Enderta",
          lat: 13.49452,
          lng: 39.46907,
          confirmed: 0,
          hospitalized: 0,
          critical: 0,
          dead: 0
        },
        {
          name: "Gambela",
          lat: 8.248474,
          lng: 34.589961,
          confirmed: 0,
          hospitalized: 0,
          critical: 0,
          dead: 0
        },
        {
          name: "Amaro",
          lat: 7.051976,
          lng: 38.495342,
          confirmed: 0,
          hospitalized: 0,
          critical: 0,
          dead: 0
        },
        {
          name: "Somali",
          lat: 9.352147,
          lng: 42.79737,
          confirmed: 0,
          hospitalized: 0,
          critical: 0,
          dead: 0
        },
        {
          name: "WEREDA 01",
          lat: 9.010117,
          lng: 38.761353,
          confirmed: 22,
          hospitalized: 20,
          critical: 2,
          dead: 0
        },
        {
          name: "Harar/Hundene",
          lat: 9.312948,
          lng: 42.123789,
          confirmed: 0,
          hospitalized: 0,
          critical: 0,
          dead: 0
        },
        {
          name: "Dire Dawa",
          lat: 9.600638,
          lng: 41.855466,
          confirmed: 1,
          hospitalized: 1,
          critical: 0,
          dead: 0
        },
        {
          name: "Afambo",
          lat: 11.795548,
          lng: 41.009302,
          confirmed: 0,
          hospitalized: 0,
          critical: 0,
          dead: 0
        },
        {
          name: "Bati",
          lat: 8.540664,
          lng: 39.268965,
          confirmed: 2,
          hospitalized: 2,
          critical: 0,
          dead: 0
        }
      ],
      loading: false,
      markers: false,
      geojson: false,
      geojsonOptions: {
        style: {
          color: "#ffd443",
          weight: 2,
          opacity: 0.15
        }
      }
    };
  },

  computed: {
    google: gmapApi
  },

  methods: {
    async getRegionRecords() {
      this.regionRecords = [];

      let patients = pmoPatients.results;

      this.regionOverlayRecords = _map(
        this.administrativeZoneDataAll[0].features,
        (data, index) => {
          let regionRecord = createNewRegionRecord(data);
          regionRecord.totalCases = _filter(patients, patient => {
            return patient.location === regionRecord.adminRegion1Name;
          }).length;
          this.regionRecords.push(regionRecord);

          const formattedCoordinates = _map(
            data.geometry.coordinates[0],
            latLongData => {
              const coordinates = transformDataForGoogleMaps(latLongData);
              return coordinates;
            }
          );

          const caseLevelColor = polygonColor(regionRecord.totalCases);

          return {
            adminRegion3Id: data.properties.ID_3,
            name: data.properties.NAME_3,
            key: index,
            paths: formattedCoordinates,
            strokeColor: "rgba(0,0,0,0.1)",
            strokeWeight: 1,
            strokeOpacity: 1.0,
            fillColor: caseLevelColor,
            fillOpacity: 0.45
          };
        }
      );
    },
    async createPolygons() {
      _forEach(this.regionOverlayRecords, regionOverlayRecord => {
        let regionId = regionOverlayRecord.adminRegion3Id;
        let regionName = regionOverlayRecord.name;

        let regionRecordForOverlay = _find(this.regionRecords, {
          adminRegion3Id: regionId
        });
        // let matchingRecords = _filter(this.sampleData, { 'name': regionName })

        // const caseLevelColor = polygonColor(regionOverlayRecord.totalCases)

        var polygon = new this.google.maps.Polygon({
          paths: regionOverlayRecord.paths,
          strokeColor: regionOverlayRecord.strokeColor,
          strokeOpacity: regionOverlayRecord.strokeOpacity,
          strokeWeight: regionOverlayRecord.strokeWeight,
          fillColor: regionOverlayRecord.fillColor,
          fillOpacity: regionOverlayRecord.fillOpacity
        });

        this.google.maps.event.addListener(polygon, "mouseover", e =>
          this.mouseOverPolygon(e, polygon, regionOverlayRecord)
        );
        this.google.maps.event.addListener(polygon, "mouseout", e =>
          this.mouseOutPolygon(e)
        );
        polygon.setMap(this.map);
      });
    },

    async init() {
      this.loading = true;
      this.administrativeZoneDataAll = await Util.downloadGeoJson(this.$axios);

      await this.getRegionRecords();
      await this.createPolygons();
      this.loading = false;
    },

    mouseOverPolygon(e, polygon, regionOverlayRecord) {
      var bounds = new google.maps.LatLngBounds();
      polygon.getPath().forEach(function(path, index) {
        bounds.extend(path);
      });
      let polygonCenter = bounds.getCenter();

      let latLngData = {
        lat: parseFloat(roundValue(polygonCenter.lat(), 3)),
        lng: parseFloat(roundValue(polygonCenter.lng(), 3))
      };

      let regionId = regionOverlayRecord.adminRegion3Id;
      let regionName = regionOverlayRecord.name;
      let regionRecordForOverlay = _find(this.regionRecords, {
        adminRegion3Id: regionId
      });

      var totalCases = regionRecordForOverlay.totalCases;

      if (regionName.includes("WEREDA ") === true) {
        regionName = `Addis Ababa (${regionName})`;
        totalCases = `${totalCases} (Addis Ababa Total)`;
      }

      this.infoWindowDetails = {
        name: regionName,
        totalCases: totalCases
      };

      this.showingInfoWindow = true;
      this.infoWindowPosition = latLngData;
    },
    mouseOutPolygon(e) {
      this.showingInfoWindow = false;
      this.infoWindowDetails = null;
      this.infoWindowPosition = null;
    },
    fetchFromServer() {
      this.loading = true;
      //TODO url here for map data
      // this.$axios
      //   .get("https://api.pmo.gov.et/v1/patients/?format=json&limit=0")
      //   .then(res => {
      //     this.loading = false;
      //     // const markers = [];
      //     // res.data.results.forEach(item => {
      //     //   if (item.lat && item.lng) {
      //     //     markers.push({
      //     //       id: item.id,
      //     //       latlng: L.latLng(item.lat, item.lng),
      //     //       info: `${item}</br> status: ${item.status}`,
      //     //       color: this.getColor(item.status)
      //     //     });
      //     //   }
      //     //   this.markers = markers;
      //     // });
      //   })
      //   .catch(err => {
      //     this.loading = false;
      //     console.log(err);
      //   });
    }
  },
  beforeDestroy() {
    delete this.map;
  },
  mounted() {
    this.$refs.frontPageMap.$mapPromise.then(map => {
      this.map = map;
      this.init();
    });
    // this.fetchFromServer();
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
