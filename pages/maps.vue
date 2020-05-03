<template>
  <v-row no-gutters class="mb-6">
    <v-col cols="8" xs="12" sm="12" md="8" lg="9">
      <v-card elevation="0" hover tile style="height: 800px; border-top: 0px;">
        <GmapMap
          :center="{
			     lat: 8.35,
			     lng: 40.35
			    }"
          :zoom="6.0"
          style="width: 100%; height: 800px;"
          ref="mapRef"
        >
          <GmapInfoWindow
            v-if="showingInfoWindow"
            @closeclick="onCancelMarker"
            :options="{
	                    pixelOffset: {
	                        width: 0,
	                        height: -35
	                    }
	                }"
            :position="infoWindowPosition"
          >
            <v-row>
              <v-col xs="12">
                <h2 class="maps__hospital_name">{{ currentMedicalFacility.name }}</h2>
                <p class="maps__hospital_status">
                  Status:
                  <span class="status_classes">{{ currentMedicalFacility.status }}</span>
                </p>
                <p class="maps__hospital_available_beds">
                  Available Beds:
                  <span
                    class="bed_classes"
                  >{{ currentMedicalFacility.available_beds }}</span>
                </p>
                <p class="maps__hospital_address_street">{{ currentMedicalFacility.street }}</p>
                <p
                  class="maps__hospital_address_city_state"
                >{{ currentMedicalFacility.city }}, {{ currentMedicalFacility.admin_region_3 }}</p>
                <p class="maps__hospital_hours">Hours: {{ currentMedicalFacility.opening_hours }}</p>
                <p class="maps__hospital_phone">Phone: {{ currentMedicalFacility.contact_number }}</p>
                <p class="maps__hospital_operator">Operator: {{ currentMedicalFacility.operator }}</p>
                <p
                  class="maps__hospital_operator_phone"
                >Operator Phone: {{ currentMedicalFacility.operator_contact_number }}</p>
              </v-col>
            </v-row>
          </GmapInfoWindow>
        </GmapMap>
      </v-card>
    </v-col>
    <v-col cols="4" xs="12" sm="12" md="4" lg="3">
      <v-card
        elevation="0"
        hover
        tile
        style="height: 800px; max-height: 800px; overflow-y: scroll; border-top: 0px;"
      >
        <v-card-title v-if="markerClicked === true">{{ currentMedicalFacility.name }}</v-card-title>
        <v-card-title
          v-if="markerClicked === false"
        >Medical Facilities{{ currentRegion ? ` in ${currentRegion.name} ` : "" }}</v-card-title>
        <v-card-subtitle v-if="loading === true">
          Loading regional maps...
          <v-progress-linear indeterminate></v-progress-linear>
        </v-card-subtitle>
        <v-card-subtitle
          v-if="markerClicked === false"
        >{{ currentRegion ? `The following medical facilities exist in ${currentRegion.name ? currentRegion.name : 'this region'}` : "Click on a region or tooltip to view medical facility details"}}.</v-card-subtitle>
        <download-excel v-if="currentMedicalFacilities !== null"
                        class   = "btn btn-default"
                        :data   = "json_data"
                        :fields = "json_fields"
                        worksheet = "My Worksheet"
                        type    = "csv"
                        name    = "Medical_Facilities_Report.xls">
          <img style="height: 45px;" align="right" alt="Download Report" src="@/assets/images/export.png"/>
        </download-excel>
        <template v-for="(table, index) in tables">
          <v-data-table
            :key="index"
            :headers="headers[index]"
            :items="table"
            class="elevation-1"
            :footer-props="{
				    'items-per-page-options': [10, 15, 20]
				  }"
            :items-per-page="20"
            style="margin-bottom: 40px;"
          >
            <template v-slot:item="props">
              <tr>
                <td>{{props.item.key}}</td>
                <td :class="getClass(props.item.color)">{{props.item.value}}</td>
              </tr>
            </template>
          </v-data-table>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import axios from "axios";
import _forEach from "lodash/forEach";
import _map from "lodash/map";
import _find from "lodash/find";
import _filter from "lodash/filter";
import { gmapApi } from "vue2-google-maps";
import Util from "@/util/util";

// import administrativeZoneDataAll from "../resources/ethiopia_administrative_zones_full.json";

const MAP_CENTER = {
  lat: 8.75,
  lng: 40.25
};

const ETHIOPIA_BOUNDS = {
  north: 14,
  south: 15,
  west: 35,
  east: 44
};

  const ETHIOPIA_BOUNDS_2 = {
    latLngBounds: {
      north: 14,
      south: 15,
      west: 35,
      east: 44
    },
    strictBounds: true
  };

  const POLYGON_COLORS = ["rgba(253,211,14,0.8)", "#800000", "#FF0000"];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function roundValue(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }

  function polygonColor(count) {
    if (count === 0) {
      return POLYGON_COLORS[0];
    }

    if (count < 10 && count > 0) {
      return POLYGON_COLORS[1];
    }

    if (count > 10) {
      return POLYGON_COLORS[2];
    }
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
    data() {
      return {
        loading: false,
        map: undefined,
        administrativeZoneDataAll: null,
        markerClicked: false,
        showingInfoWindow: false,
        infoWindowPosition: null,
        regionSelected: false,
        currentRegion: null,
        currentMedicalFacility: null,
        currentMedicalFacilities: null,
        regionRecords: [],
        regionOverlayRecords: [],
        medicalFacilityRecords: [],
        headers: null,
        tables: null
      };
    },
    computed: {
      google: gmapApi
    },
    mounted() {
      this.$refs.mapRef.$mapPromise.then(map => {
        this.map = map;
        this.init();
      });
    },
    beforeDestroy() {
      delete this.map;
    },
    methods: {
      getClass(property) {
        return {
          maps__great: property
        };
      },
      mouseOutPolygon(e) {
        // 	if (this.regionSelected === false) {
        //  	this.resetViews()
        // }
      },
      resetViews() {
        this.currentRegion = null;
        this.currentMedicalFacilities = null;
      },
      onCancelMarker() {
        this.showingInfoWindow = false;
        this.currentMedicalFacility = null;
        this.markerClicked = false;
      },
      onClickMarker(e, medicalFacilityRecord, latLngData) {
        this.currentMedicalFacility = medicalFacilityRecord;
        this.currentMedicalFacilities = [medicalFacilityRecord];

        this.headers = _map(
          this.currentMedicalFacilities,
          medicalFacilityRecord => {
            return [
              {
                text: medicalFacilityRecord.name,
                align: "start",
                sortable: false,
                value: "key"
              },
              { text: "", value: "value" }
            ];
          }
        );
        this.tables = this.getTables();
        this.showingInfoWindow = true;
        this.infoWindowPosition = latLngData;
        this.json_fields = this.getJsonFields();
        this.json_data = this.getJsonData();

        if (this.currentMedicalFacility) {
          this.markerClicked = true;
        } else {
          this.markerClicked = false;
        }
      },
      onClickPolygon(e, adminRegion3Id) {
        this.markerClicked = false;

        let selectedRegion = _find(this.regionRecords, {
          adminRegion3Id: adminRegion3Id
        });

        if (selectedRegion !== this.currentRegion) {
          this.regionSelected = true;
          this.currentRegion = selectedRegion;

          this.currentMedicalFacilities = _filter(this.medicalFacilityRecords, {
            admin_region_3_id: adminRegion3Id
          });
          this.headers = _map(
            this.currentMedicalFacilities,
            medicalFacilityRecord => {
              return [
                {
                  text: medicalFacilityRecord.name,
                  align: "start",
                  sortable: false,
                  value: "key"
                },
                { text: "", value: "value" }
              ];
            }
          );
          this.tables = this.getTables();
        } else {
          this.regionSelected = false;
          this.currentRegion = null;
          this.currentMedicalFacilities = null;
        }
      },
      getTables() {
        return _map(this.currentMedicalFacilities, medicalFacilityRecord => {
          // caculate color values for each label once thresholds are decided
          return [
            {
              key: "Facility Type",
              value: medicalFacilityRecord.amenity,
              color: "#228b22"
            },
            {
              key: "Facility Status",
              value: medicalFacilityRecord.status,
              color: "#228b22"
            },
            {
              key: "Total Beds",
              value: medicalFacilityRecord.total_beds,
              color: "#228b22"
            },
            {
              key: "Occupied Beds",
              value: medicalFacilityRecord.occupied_beds,
              color: "#228b22"
            },

            {
              key: "Available Beds",
              value: medicalFacilityRecord.available_beds,
              color: "#228b22"
            },
            {
              key: "Total ICU Beds",
              value: medicalFacilityRecord.total_icu_beds,
              color: "#228b22"
            },
            {
              key: "Total Occupied ICU Beds",
              value: medicalFacilityRecord.occupied_icu_beds,
              color: "#228b22"
            },
            {
              key: "Total Available ICU Beds",
              value: medicalFacilityRecord.available_icu_beds,
              color: "#228b22"
            },
            {
              key: "Total Mechanical Ventilators",
              value: medicalFacilityRecord.total_ventilators,
              color: "#228b22"
            },
            {
              key: "Occupied Mechanical Ventilators",
              value: medicalFacilityRecord.occupied_ventilators,
              color: "#228b22"
            },
            {
              key: "Available Mechanical Ventilators",
              value: medicalFacilityRecord.available_ventilators,
              color: "#228b22"
            },
            {
              key: "Masks",
              value: medicalFacilityRecord.masks,
              color: "#228b22"
            },
            {
              key: "Gloves",
              value: medicalFacilityRecord.gloves,
              color: "#228b22"
            },
            {
              key: "Gowns",
              value: medicalFacilityRecord.gowns,
              color: "#228b22"
            },
            {
              key: "Goggles",
              value: medicalFacilityRecord.goggles,
              color: "#228b22"
            },
            {
              key: "Face Shields",
              value: medicalFacilityRecord.face_shields,
              color: "#228b22"
            },
            {
              key: "Testings Kits",
              value: medicalFacilityRecord.testing_kits,
              color: "#228b22"
            }
          ];
        });
      },
      getJsonFields() {
        return {
          'Facility Type': 'amenity',
          'Facility Status':  'status',
          'Total Beds': 'total_beds',
          'Occupied Beds': 'occupied_beds',
          'Available Beds': 'available_beds',
          'Total ICU Beds': 'total_icu_beds',
          'Total Occupied ICU Beds': 'occupied_icu_beds',
          'Total Available ICU Beds': 'available_icu_beds',
          'Total Mechanical Ventilators': 'total_ventilators',
          'Occupied Mechanical Ventilators': 'occupied_ventilators',
          'Available Mechanical Ventilators': 'available_ventilators',
          'Masks': 'masks',
          'Gloves': 'gloves',
          'Gowns': 'gowns',
          'Goggles': 'goggles',
          'Face Shields': 'face_shields',
          'Testings Kits': 'testing_kits'
        }
      },
      getJsonData() {
        return _map(this.currentMedicalFacilities, (medicalFacilityRecord) => {
          return {
            amenity: medicalFacilityRecord.amenity,
            status: medicalFacilityRecord.status,
            total_beds: medicalFacilityRecord.total_beds,
            occupied_beds: medicalFacilityRecord.occupied_beds,
            available_beds: medicalFacilityRecord.available_beds,
            total_icu_beds: medicalFacilityRecord.total_icu_beds,
            occupied_icu_beds: medicalFacilityRecord.occupied_icu_beds,
            available_icu_beds: medicalFacilityRecord.available_icu_beds,
            total_ventilators: medicalFacilityRecord.total_ventilators,
            occupied_ventilators: medicalFacilityRecord.occupied_ventilators,
            available_ventilators: medicalFacilityRecord.available_ventilators,
            masks: medicalFacilityRecord.masks,
            gloves: medicalFacilityRecord.gloves,
            gowns: medicalFacilityRecord.gowns,
            goggles: medicalFacilityRecord.goggles,
            face_shields: medicalFacilityRecord.face_shields,
            testing_kits: medicalFacilityRecord.testing_kits
          }
        })
      },
      mouseOverPolygon(e, adminRegion3Id) {
        // console.log("mouseover")
      },
      async getRegionRecords() {
        this.regionRecords = [];
        this.regionOverlayRecords = _map(
          this.administrativeZoneDataAll[0].features,
          (data, index) => {
            let regionRecord = createNewRegionRecord(data);
            this.regionRecords.push(regionRecord);

            const formattedCoordinates = _map(
              data.geometry.coordinates[0],
              latLongData => {
                const coordinates = transformDataForGoogleMaps(latLongData);
                return coordinates;
              }
            );

            return {
              adminRegion3Id: data.properties.ID_3,
              key: index,
              paths: formattedCoordinates,
              strokeColor: "rgba(0,0,0,0.2)",
              strokeWeight: 0.5,
              strokeOpacity: 1.0,
              fillColor: POLYGON_COLORS[1],
              fillOpacity: 0.45
            };
          }
        );
      },
      async createPolygons() {
        _forEach(this.regionOverlayRecords, regionOverlayRecord => {
          let regionId = regionOverlayRecord.adminRegion3Id;
          let regionRecordForOverlay = _find(this.regionRecords, {
            adminRegion3Id: regionId
          });
          const caseLevelColor = polygonColor(regionRecordForOverlay.totalCases);

          var poly = new this.google.maps.Polygon({
            paths: regionOverlayRecord.paths,
            strokeColor: regionOverlayRecord.strokeColor,
            strokeOpacity: regionOverlayRecord.strokeOpacity,
            strokeWeight: regionOverlayRecord.strokeWeight,
            fillColor: caseLevelColor,
            fillOpacity: regionOverlayRecord.fillOpacity
          });
          this.google.maps.event.addListener(poly, "mouseover", e =>
            this.mouseOverPolygon(e, regionRecordForOverlay.adminRegion3Id)
          );
          this.google.maps.event.addListener(poly, "mouseout", e =>
            this.mouseOutPolygon(e)
          );
          this.google.maps.event.addListener(poly, "click", e =>
            this.onClickPolygon(e, regionRecordForOverlay.adminRegion3Id)
          );
          poly.setMap(this.map);
        });
      },
      async createMarkers() {
        _forEach(this.medicalFacilityRecords, medicalFacilityRecord => {
          let latLngData = {
            lat: parseFloat(roundValue(medicalFacilityRecord.latitude, 3)),
            lng: parseFloat(roundValue(medicalFacilityRecord.longitude, 3))
          };

          let marker = new this.google.maps.Marker({
            position: latLngData,
            map: this.map
          });

          this.google.maps.event.addListener(marker, "click", e =>
            this.onClickMarker(e, medicalFacilityRecord, latLngData)
          );
        });
      },
      async init() {
        this.loading = true;
        try {
          const response = await axios.get(
            `https://sheetsu.com/apis/v1.0su/97079a6a1458/`
          );

          this.administrativeZoneDataAll = await Util.downloadGeoJson(
            this.$axios
          );
          await this.getRegionRecords();

          this.medicalFacilityRecords = _map(
            response.data,
            medicalFacilityRecord => {
              return Object.assign({}, medicalFacilityRecord, {
                osm_id: parseInt(medicalFacilityRecord.osm_id),
                status: capitalizeFirstLetter(medicalFacilityRecord.status),
                admin_region_3_id: parseInt(
                  medicalFacilityRecord.admin_region_3_id
                ),
                latitude: parseFloat(medicalFacilityRecord.latitude),
                longitude: parseFloat(medicalFacilityRecord.longitude)
              });
            }
          );

          await this.createPolygons();
          await this.createMarkers();
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.loading = false;
        }
      }
    }
  };
</script>
<style>
  .text-start {
    border: 0.5px solid lightgray;
  }

  .maps__great {
    color: #228b22;
  }

  .maps__good {
    color: #ff8000;
  }

  .maps__bad {
    color: #ff0000;
  }

  .maps__hospital_name {
    font-size: 22px;
    margin-bottom: 8px;
  }

  .maps__hospital_faciliy_type_header {
    font-size: 14px;
    margin-bottom: 8px;
  }

  .maps__hospital_status {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .maps__hospital_available_beds {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .maps__hospital_address_street,
  .maps__hospital_hours,
  .maps__hospital_operator {
    font-size: 14px;
    margin: 0px 0px 4px 0px;
  }

  .maps__hospital_phone {
    font-size: 14px;
  }

  .maps__hospital_address_city_state {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .maps__hospital_status_available {
    color: #228b22;
  }

  .maps__hospital_status_unavailable {
    color: grey;
  }

  .maps__hospital_status_full {
    color: #ff0000;
  }

  .maps__hospital_available_beds_great {
    color: #228b22;
  }

  .maps__hospital_available_beds_good {
    color: #ff8000;
  }

  .maps__hospital_available_beds_bad {
    color: #ff0000;
  }
</style>
