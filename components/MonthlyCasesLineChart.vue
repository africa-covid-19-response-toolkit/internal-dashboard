<template>
  <v-card hover tile>
    <v-card-title>{{ chart_title }}</v-card-title>

    <apexchart width="100%" height="240" type="line" :options="getChartOptions" :series="getSeries"></apexchart>
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
      chart_title: `ወርሃዊ መረጃ - ${new Date().getFullYear()}`,
      chartOptions: {
        animations: {
          enabled: false
        },
        theme: {
          mode: "light",
          palette: "palette1",
          monochrome: {
            enabled: false,
            color: "#255aee",
            shadeTo: "light",
            shadeIntensity: 0.65
          }
        },

        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ]
        },

        stroke: {
          width: 2,
          curve: "smooth"
        },
        fill: {
          type: "gradient"
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "10px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold",
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
        legend: { position: "top", align: "left", horizontalAlign: "left" },
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
      }
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
    getSeries() {
      return this.chartdata && this.chartdata.series
        ? this.chartdata.series
        : [];
    }
  }
};
</script>

<style></style>
