<template>
  <v-card hover elevation="1">
    <v-card-title>{{ name }}</v-card-title>
    <apexchart
      ref="donut"
      width="100%"
      height="252"
      type="donut"
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
      name: "አጠቃላይ ቻርት",
      labels: [
        "ማግለያ የገቡ",
        "የተገኘባቸው",
        "ወደ ህክምና የገቡ",
        "በጥና የታመሙ",
        "ያገገሙ",
        "በሞት የተለዩ"
      ],
      chartOptions: {
        dataLabels: {
          formatter: function(val, opts) {
            return opts.w.globals.series[opts.seriesIndex];
          }
        },
        theme: {
          palette: "palette6"
        },
        labels: [
          "ማግለያ የገቡ",
          "የተገኘባቸው",
          "ወደ ህክምና የገቡ",
          "በጥና የታመሙ",
          "ያገገሙ",
          "በሞት የተለዩ"
        ],
        plotOptions: {
          pie: {
            customScale: 0.9,
            offsetX: 0,
            offsetY: 0,
            expandOnClick: true,
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10
            },
            donut: {
              size: "58%",
              background: "transparent",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "22px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  color: undefined,
                  offsetY: -10
                },
                value: {
                  show: true,
                  fontSize: "16px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: 400,
                  color: undefined,
                  offsetY: 16,
                  formatter: function(val) {
                    return val;
                  }
                },
                total: {
                  show: true,
                  showAlways: false,
                  label: "ሁሉም",
                  fontSize: "14px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  color: "#373d3f",
                  formatter: function(w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b;
                    }, 0);
                  }
                }
              }
            }
          }
        },
        legend: {
          position: "right"
        }
      },
      series: [],
      xaxis: {
        type: "category"
      }
    };
  },
  methods: {
    updateChart() {}
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
