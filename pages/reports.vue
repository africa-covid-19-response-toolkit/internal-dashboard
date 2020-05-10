<template>
  <v-container fluid>
    <h1>Report Center</h1>
    <v-divider class="mt-4 mb-4"/>
    <v-card>
      <v-card-subtitle v-if="medicalFacilityRecords.length > 0">
        <download-excel
          class="btn btn-default"
          :data="json_data"
          :fields="json_fields"
          worksheet="My Worksheet"
          type="csv"
          name='Medical_Facilities_Records.xls'>
          <img style="height: 45px; " align="right" alt="Download Report" src="@/assets/images/export.png"/>
        </download-excel>
      </v-card-subtitle>
      <v-card-title>
        Medical Facility Records
        <v-spacer>
        </v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :loading="loading"
        :loading-text="loadingText"
        :items="medicalFacilityRecords"
        :sort-by="['name']"
        calculate-widths
        no-results-text="No Medical Facility Records found"
        class="elevation-1 ma-0"
        ref="table"
        :search="search">
        <template v-slot:item.available_beds="{ item }">
          <v-chip :color="getAvailableBedColor(item.available_beds)" dark>{{ item.available_beds }}</v-chip>
        </template>
        <template v-slot:item.available_ventilators="{ item }">
          <v-chip :color="getAvailableVentilatorsColor(item.available_ventilators)" dark>{{ item.available_ventilators }}</v-chip>
        </template>
        <template v-slot:item.masks="{ item }">
          <v-chip :color="getColorCode(item.masks)" dark>{{ item.masks }}</v-chip>
        </template>
        <template v-slot:item.gloves="{ item }">
          <v-chip :color="getColorCode(item.gloves)" dark>{{ item.gloves }}</v-chip>
        </template>
        <template v-slot:item.gowns="{ item }">
          <v-chip :color="getColorCode(item.gowns)" dark>{{ item.gowns }}</v-chip>
        </template>
        <template v-slot:item.goggles="{ item }">
          <v-chip :color="getColorCode(item.goggles)" dark>{{ item.goggles }}</v-chip>
        </template>
        <template v-slot:item.face_shields="{ item }">
          <v-chip :color="getColorCode(item.face_shields)" dark>{{ item.face_shields }}</v-chip>
        </template>
      </v-data-table>


    </v-card>
    <v-divider class="mt-4 mb-4"/>
  </v-container>
</template>

<script>
  import axios from "axios";
  import _map from "lodash/map";

  export default {
    components: {},
    data() {
      return {
        search: '',
        loading: true,
        loadingText: "Loading ...",
        server_items_length: 0,
        headers: [
          {text: "Facility Name", value: "name", sortable: true, filterable: true},
          {text: "Facility Type", value: "amenity"},
          {text: "Facility Status", value: "status"},
          {text: "Total Beds", value: "total_beds"},
          {text: "Occupied Beds", value: "occupied_beds"},
          {text: "Available Beds", value: "available_beds"},
          {text: "Total ICU Beds", value: "occupied_icu_beds"},
          {text: "Total Occupied ICU Beds", value: "available_icu_beds"},
          {text: "Total Mechanical Ventilators", value: "total_ventilators"},
          {text: "Occupied Mechanical Ventilators", value: "occupied_ventilators"},
          {text: "Available Mechanical Ventilators", value: "available_ventilators"},
          {text: "Masks", value: "masks"},
          {text: "Gloves", value: "gloves"},
          {text: "Gowns", value: "gowns"},
          {text: "Goggles", value: "goggles"},
          {text: "Face Shields", value: "face_shields"},
          {text: "Testings Kits", value: "testing_kits"}
        ],
        medicalFacilityRecords: [],
        tableProps: {
          lastSearched: null,
          page: 1,
          itemsPerPage: 10,
          sortBy: ["name"],
          sortDesc: [true],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
          search: "",
          searchFeild: ["name", "amenity", "status"]
        },
        pagination: {
          sortBy: 'name'
        },
        json_fields: null,
        json_data: null
      };
    },
    methods: {
      fetchAllMedicalFacilitesData: async function () {
        this.loading = true;
        try {
          const response = await axios.get(
            `https://sheetsu.com/apis/v1.0su/97079a6a1458/`
          );
          this.medicalFacilityRecords = response.data;
          this.server_items_length = this.medicalFacilityRecords.length;
          this.json_fields = this.getJsonFields();
          this.json_data = this.getJsonData();
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.loading = false;
        }
      },
      getColorCode (input_data) {
        if (input_data > 1000) return 'green'
        else if (input_data > 199) return 'orange'
        else return 'red'
      },
      getAvailableBedColor (available_beds) {
        if (available_beds > 100) return 'green'
        else if (available_beds > 50) return 'orange'
        else return 'red'
      },
      getAvailableVentilatorsColor (available_ventilators) {
        if (available_ventilators > 3) return 'green'
        else if (available_ventilators > 2) return 'orange'
        else return 'red'
      },
      getJsonFields() {
        return {
          'Facility Name': 'name',
          'Facility Type': 'amenity',
          'Facility Status': 'status',
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
        return _map(this.medicalFacilityRecords, (medicalFacilityRecord) => {
          return {
            name: medicalFacilityRecord.name,
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
      }
    },
    mounted() {
      this.fetchAllMedicalFacilitesData();
    }
  };
</script>

<style scoped>
  body {
    margin: 0;
    padding: 0;
    background-color: #fafafa;
    font: 12pt "Tahoma";
  }

  * {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
  }

  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    body * {
      display: none;
    }
    .page {
      display: block;
      margin: 0;
      border: initial;
      border-radius: initial;
      width: initial;
      min-height: initial;
      box-shadow: initial;
      background: initial;
      page-break-after: always;
    }
  }
</style>
