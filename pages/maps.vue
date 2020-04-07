<template>
	<v-row>
      <v-col cols="8" xs="12" sm="12" md="8" lg="8">
      	<v-card elevation="0" hover tile style="height: 800px; border-top: 0px;">
	      	<GmapMap
			    :center="{
			     lat: 8.35,
			     lng: 40.35
			    }"
			    :zoom="6.3"
			    map-type-id="hybrid"
			    style="width: 100%; height: 800px;"
			    ref="mapRef"
			>
				<GmapInfoWindow
					v-if="showingInfoWindow"
					@closeclick="showingInfoWindow=false"
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
						  <p class="maps__hospital_status">Status: <span class="status_classes">{{ currentMedicalFacility.status }}</span></p>
			              <p class="maps__hospital_available_beds">Available Beds: <span class="bed_classes">{{ currentMedicalFacility.available_beds }}</span></p>
			              <p class="maps__hospital_address_street">{{ currentMedicalFacility.street }}</p>
			              <p class="maps__hospital_address_city_state">{{ currentMedicalFacility.city }}, {{ currentMedicalFacility.admin_region_3 }}</p>
			              <p class="maps__hospital_hours">Hours: {{ currentMedicalFacility.opening_hours }}</p>
			              <p class="maps__hospital_phone">Phone: {{ currentMedicalFacility.contact_number }} </p>
			              <p class="maps__hospital_operator">Operator: {{ currentMedicalFacility.operator }}</p>
			              <p class="maps__hospital_operator_phone">Operator Phone: {{ currentMedicalFacility.operator_contact_number }}</p>
						</v-col>
					</v-row>
					
				</GmapInfoWindow>
			</GmapMap>
		</v-card>
      </v-col>
      <v-col cols="4" xs="12" sm="12" md="4" lg="4">
      	<v-card elevation="0" hover tile style="height: 800px; max-height: 800px; overflow-y: scroll; border-top: 0px;">
		    <v-card-title>{{ currentRegion ? `${currentRegion.name} ` : "" }}Medical Facilities</v-card-title>
		    <h4 v-if="loading === true">Loading...</h4>
		    <v-card-subtitle>{{ currentRegion ? `The following medical facilities exist in ${currentRegion.name ? currentRegion.name : 'this region'}` : "Click on a region or tooltip to view medical facility details"}}.</v-card-subtitle>
		    <template v-for="(table, index) in tables" v-if="currentMedicalFacilities !== null">
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
import axios from 'axios'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import {gmapApi} from 'vue2-google-maps'
import administrativeZoneDataAll from '../resources/ethiopia_administrative_zones_full.json'

const MAP_CENTER = {
	lat: 8.75,
	lng: 40.25
}

const ETHIOPIA_BOUNDS = {
		north: 14,
		south: 15,
		west: 35,
		east: 44,
};

const ETHIOPIA_BOUNDS_2 = {
		latLngBounds: {
			north: 14,
				south: 15,
				west: 35,
				east: 44,
			},
		strictBounds: true
};

const POLYGON_COLORS = [
  "#228b22",
  "#ff8000",
  "#ff0000"
]

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function roundValue(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function polygonColor(count) {
  if (count === 0) {
    return POLYGON_COLORS[0]
  }

  if (count < 10 && count > 0) {
    return POLYGON_COLORS[1]
  }

  if (count > 10) {
    return POLYGON_COLORS[2]
  }
}

function transformDataForGoogleMaps(latLongData) {
  return { lat: parseFloat(roundValue(latLongData[1], 3)) ? parseFloat(roundValue(latLongData[1], 3)) : 0, lng: parseFloat(roundValue(latLongData[0], 3)) ? parseFloat(roundValue(latLongData[0], 3)) : 0 }
}

function createNewRegionRecord(data) {
  return {
    adminRegion3Id: data.properties.ID_3,
    name: data.properties.NAME_3,
    totalCases: 0,
    totalRecovered: 0,
    totalHospitalized: 0,
    totalIsolated: 0,
    totalDeceased: 0,
    firstCase: null,
  }
}

export default {
	data() {
	  return {
	    map: undefined,
	    administrativeZoneDataAll: administrativeZoneDataAll,
      	activeMarker: null,
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
	    tables: null,
	  }
	},
    computed: {
        google: gmapApi,
    },
    mounted() {
		 this.$refs.mapRef.$mapPromise.then((map) => {
		    this.map = map
		    this.init();
		 });
	},
	methods: {
	  getClass(property){
	    return {
	      'maps__great': property,
	    }
	  },
	  mouseOutPolygon(e) {
	  // 	if (this.regionSelected === false) {
		 //  	this.resetViews()
		 // }
	  },
	  resetViews() {
  		this.currentRegion = null
      	this.currentMedicalFacilities = null
	  },
	  onClickMarker(e, medicalFacilityRecord, latLngData) {
	  	console.log("clicked marker")
	  	// this.resetViews()
	  	this.currentMedicalFacility = medicalFacilityRecord
	  	this.currentMedicalFacilities = [ medicalFacilityRecord ]
	  	
	  	this.headers = _map(this.currentMedicalFacilities, (medicalFacilityRecord) => {
				return [
				{
			      text: medicalFacilityRecord.name,
			      align: 'start',
			      sortable: false,
			      value: 'key',
			    },
			    { text: '', value: 'value' }
			    ]
			})
	  	this.tables = this.getTables()
	  	this.showingInfoWindow = true
	  	this.infoWindowPosition = latLngData
	  },
	  onClickPolygon(e, adminRegion3Id) {
	  	let selectedRegion = _find(this.regionRecords, { 'adminRegion3Id': adminRegion3Id })

	  	if (selectedRegion !== this.currentRegion) {
	  		this.regionSelected = true
	  		this.currentRegion = selectedRegion

	  		this.currentMedicalFacilities = _filter(this.medicalFacilityRecords, { 'admin_region_3_id': adminRegion3Id })
			this.headers = _map(this.currentMedicalFacilities, (medicalFacilityRecord) => {
				return [
				{
			      text: medicalFacilityRecord.name,
			      align: 'start',
			      sortable: false,
			      value: 'key',
			    },
			    { text: '', value: 'value' }
			    ]
			})
			this.tables = this.getTables()

	  	} else {
	  		this.regionSelected = false
	  		this.currentRegion = null
	      	this.currentMedicalFacilities = null
	  	}
	  },
	  getTables() {
	  	return _map(this.currentMedicalFacilities, (medicalFacilityRecord) => {

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
					},				{
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
					},
				]
			})
	  },
	  mouseOverPolygon(e, adminRegion3Id) {
		// console.log("mouseover")
	  },
	  getRegionRecords() {
	  	this.regionRecords = []
		this.regionOverlayRecords = _map(this.administrativeZoneDataAll[0].features, (data, index) => {
		  let regionRecord = createNewRegionRecord(data)
		  this.regionRecords.push(regionRecord)

		  const formattedCoordinates = _map(data.geometry.coordinates[0], (latLongData) => {
		    const coordinates = transformDataForGoogleMaps(latLongData)
		    return coordinates
		  })

		  return { adminRegion3Id: data.properties.ID_3, key: index, paths: formattedCoordinates, strokeColor: "#000000", strokeWeight: 2, strokeOpacity: 1.0, fillColor: POLYGON_COLORS[1], fillOpacity: 0.45 }
		})
	  },
	  createPolygons() {
	  	_forEach(this.regionOverlayRecords, (regionOverlayRecord) => {
    		let regionId = regionOverlayRecord.adminRegion3Id
	        let regionRecordForOverlay = _find(this.regionRecords, { 'adminRegion3Id': regionId })
	        const caseLevelColor = polygonColor(regionRecordForOverlay.totalCases)

    		var poly = new this.google.maps.Polygon({
		        paths: regionOverlayRecord.paths,
		        strokeColor: regionOverlayRecord.strokeColor,
		        strokeOpacity: regionOverlayRecord.strokeOpacity,
		        strokeWeight: regionOverlayRecord.strokeWeight,
		        fillColor: caseLevelColor,
		        fillOpacity: regionOverlayRecord.fillOpacity,
		    });
		    this.google.maps.event.addListener(poly, 'mouseover', (e) => this.mouseOverPolygon(e, regionRecordForOverlay.adminRegion3Id));
		    this.google.maps.event.addListener(poly, 'mouseout', (e) => this.mouseOutPolygon(e));
		    this.google.maps.event.addListener(poly, 'click', (e) => this.onClickPolygon(e, regionRecordForOverlay.adminRegion3Id));
    		poly.setMap(this.map)
    	})
	  },
	  createMarkers() {
	  	_forEach(this.medicalFacilityRecords, (medicalFacilityRecord) => {
    		let latLngData = {
		        lat: parseFloat(roundValue(medicalFacilityRecord.latitude, 3)),
			    lng: parseFloat(roundValue(medicalFacilityRecord.longitude, 3))
		     }

    		let marker = new this.google.maps.Marker({
		      position: latLngData,
		      map: this.map,
		    });

		    this.google.maps.event.addListener(marker, 'click', (e) => this.onClickMarker(e, medicalFacilityRecord, latLngData));
    	})
	  },
	  init() {
	  	axios
	      .get(`https://sheetsu.com/apis/v1.0su/97079a6a1458/`)
	      .then((response) => {
	        	this.getRegionRecords()

	        	this.medicalFacilityRecords = _map(response.data, (medicalFacilityRecord) => {
			        return Object.assign({}, medicalFacilityRecord, {
			          osm_id: parseInt(medicalFacilityRecord.osm_id),
			          status: capitalizeFirstLetter(medicalFacilityRecord.status),
			          admin_region_3_id: parseInt(medicalFacilityRecord.admin_region_3_id),
			          latitude: parseFloat(medicalFacilityRecord.latitude),
			          longitude: parseFloat(medicalFacilityRecord.longitude),
			        });
			    })

	        	this.createPolygons()
	        	this.createMarkers()
	      })
	      .catch((error) => {
	        console.log(error)
	      })
	  },
	}
}
</script>
<style>
	.text-start {
		border:  0.5px solid lightgray;
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
	  font-size: 16px;
	  margin-bottom: 8px;
	}

	.maps__hospital_status {
	  font-size: 16px;
	  margin-bottom: 4px;
	}

	.maps__hospital_available_beds {
	  font-size: 16px;
	  margin-bottom: 10px;
	}

	.maps__hospital_address_street, .maps__hospital_hours, .maps__hospital_operator {
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