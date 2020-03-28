<template>
  <v-card tile>
    <v-card-title>{{ chart_title }}</v-card-title>

    <apexchart width="100%" height="340" type="line" :options="getChartOptions" :series="getSeries"></apexchart>
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
   const titleDaily = this.$t('chart_titles.daily')
    return {
      chart_title: `${titleDaily} - ${new Date().toDateString()}`,
      chartOptions: {
        colors: [
          "#499ebf",
          "#f26666",
          "#f2a81d",
          "#484c7f",
          "#50bfa0",
          "#122a40"
        ],
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2,
          curve: "smooth"
        },
        xaxis: this.xaxis,
        animations: {
          enabled: false
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
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
            borderWidth: 0.4,
            borderColor: "#999",
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
        ],
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
