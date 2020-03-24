<template>
  <v-card tile>
    <apexchart width="100%" height="200" type="line" :options="getChartOptions" :series="getSeries"></apexchart>
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
      chart_title: `የየስዓቱ መረጃ  - ${new Date().toDateString()}`,
      chartOptions: {
        animations: {
          enabled: false
        },
        theme: {
          mode: this.$vuetify.theme.dark ? "dark" : "light",
          monochrome: {
            enabled: false,
            color: "#255aee",
            shadeTo: "light",
            shadeIntensity: 0.55
          }
        },
        colors: [
          "#499ebf",
          "#f26666",
          "#f2a81d",
          "#484c7f",
          "#50bfa0",
          "#122a40"
        ],
        chart: {
          type: "line",
          stacked: false
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        title: {
          text: `የየስዓቱ መረጃ  - ${new Date().toDateString()}`,
          align: "left",
          margin: 10,
          offsetX: 0,
          offsetY: -0,
          floating: false,
          style: {
            fontSize: "18px",
            fontWeight: "normal",
            fontFamily: undefined,
            color: "#263238"
          }
        },

        grid: {
          show: true
        },
        stroke: {
          width: 2,
          curve: "smooth"
        },
        yaxis: {
          min: 0
        },

        // fill: {
        //   type: "gradient"
        // },
        dataLabels: {
          enabled: false,

          style: {
            fontSize: "10px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "normal",
            colors: undefined
          },
          background: {
            enabled: true,
            borderRadius: 10,
            borderWidth: 0.4,
            borderColor: "#999",
            opacity: 0.9
          }
        },

        legend: { position: "top", align: "left", horizontalAlign: "left" }
      },
      series: []
    };
  },

  computed: {
    getChartOptions() {
      if (this.chartdata && this.chartdata.xaxis) {
        return {
          ...this.chartOptions,
          xaxis: {
            labels: {
              show: false,
              format: "hh"
            },
            type: "time",
            axisBorder: {
              show: false
            }
          },
          yaxis: {
            labels: {
              show: true
            },
            axisBorder: {
              show: false
            }
          },
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
      return this.chartdata && this.chartdata.series
        ? this.chartdata.series
        : [];
    }
  },
  methods: {}
};
</script>

<style></style>
