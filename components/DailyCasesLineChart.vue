<template>
  <v-card hover elevation="1">
    <v-card-title>{{ chart_title }}</v-card-title>

    <apexchart
      width="100%"
      height="240"
      type="area"
      :options="getChartOptions"
      :series="getSeries"
    ></apexchart>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  props: {
    chartdata: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data: function() {
    return {
      chart_title: `ዬየቀን መረጃ  - ${new Date().toDateString()}`,
      chartOptions: {
        theme: {
          mode: this.$vuetify.theme.dark ? "dark" : "light",
          palette: "palette6",
          monochrome: {
            enabled: false,
            color: "#255aee",
            shadeTo: "light",
            shadeIntensity: 0.55
          }
        },
        stroke: {
          width: 3,
          curve: "smooth"
        },
        xaxis: this.xaxis,
        fill: {
          type: "gradient"
        },
        dataLabels: {
          enabled: true,

          style: {
            fontSize: "10px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "normal",
            colors: undefined
          },
          background: {
            enabled: true,

            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#fff",
            opacity: 0.9
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              dataLabels: {
                enabled: false
              }
            }
          }
        ]
      },
      series: [],
      legend: { position: "top" }
    };
  },

  computed: {
    getChartOptions() {
      if (this.chartdata && this.chartdata.xaxis) {
        return {
          ...this.chartOptions,
          xaxis: this.chartdata.xaxis,
          theme: {
            mode: this.$vuetify.theme.dark ? "dark" : "light",
            palette: "palette6"
          }
        };
      }

      return this.chartOptions;
    },
    getTheme() {
      this.$vuetify.theme.dark ? "dark" : "light";
    },
    getSeries() {
      return this.chartdata
        ? this.chartdata.series
          ? this.chartdata.series
          : []
        : [];
    }
  },
  methods: {}
};
</script>

<style></style>
