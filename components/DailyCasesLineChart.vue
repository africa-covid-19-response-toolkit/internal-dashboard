<template>
  <v-card flat>
    <v-card-title>{{ title }}</v-card-title>

    <apexchart width="100%" height="340" :options="getChartOptions" :series="getSeries"></apexchart>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  props: {
    chartType: {
      type: String,
      default: "line"
    },

    title: {
      type: String,
      default: null
    },
    chartdata: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data: function() {
    return {
      defaultTitle: `${this.$t(
        "chart_titles.daily"
      )} - ${new Date().toDateString()}`,
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
        series: this.chartdata,
        chart: {
          type: this.chartType,
          stacked: true
        },
        stroke: {
          width: 2.5
          // curve: "smooth"
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
        // responsive: [
        //   {
        //     breakpoint: 800,
        //     options: {
        //       dataLabels: {
        //         enabled: false
        //       }
        //     }
        //   }
        // ],
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
      return this.chartdata && this.chartdata.series
        ? this.chartdata.series
        : [];
    }
  },
  methods: {},
  mounted() {
    if (!this.title) {
      this.title = this.defaultTitle;
    }
  }
};
</script>

<style></style>
