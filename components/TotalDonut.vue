<template>
  <v-card hover elevation="1">
    <v-card-title>{{ name }}</v-card-title>
    <apexchart
      v-if="!isLoading"
      ref="donut"
      width="100%"
      height="252"
      type="donut"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data: function() {
    return {
      name: "አጠቃላይ ቻርት",
      chartOptions: {
        dataLabels: {
          formatter: function(val, opts) {
            return opts.w.globals.series[opts.seriesIndex];
          }
        },
        theme: {
          palette: "palette4"
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
            customScale: 1,
            offsetX: 0,
            offsetY: 0,
            expandOnClick: true,
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10
            },
            donut: {
              size: "65%",
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
                  fontSize: "18px",
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
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 100],
            colorStops: []
          }
        }
      },
      series: [],
      xaxis: {
        type: "category"
      }
    };
  },
  methods: {
    updateChart() {
      const max = 90;
      const min = 20;
      const newData = this.series.map(() => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      });
      this.series = newData;
    },
    ...mapActions("stats", { findStats: "find" })
  },
  computed: {
    ...mapState("stats", { isLoading: "isFindPending" }),
    ...mapGetters("stats", { findStatsStore: "find" }),
    async getStats() {
      const all = await this.findStats({ query: {} });
      if (all && all.data && all.data.length > 0) {
        const totals = all.data[0].total;
        var series = [];
        const labels = [
          "ማግለያ የገቡ",
          "የተገኘባቸው",
          "ወደ ህክምና የገቡ",
          "በጥና የታመሙ",
          "ያገገሙ",
          "በሞት የተለዩ",
          "ሁሉም"
        ];
        var c = 0;
        for (var o in totals) {
          if (c == 0) {
            c++;
            continue;
          }
          series.push(totals[o]);
          li++;
          c++;
        }

        this.chartOptions = { ...this.chartOptions, labels };
        // this.series = series;
      }

      return [];
    }
  },
  mounted() {
    this.findStats({ query: {} }).then(all => {
      if (all && all.data && all.data.length > 0) {
        const totals = all.data[0].total;

        const labels = [
          "ማግለያ የገቡ",
          "የተገኘባቸው",
          "ወደ ህክምና የገቡ",
          "በጥና የታመሙ",
          "ያገገሙ",
          "በሞት የተለዩ"
        ];

        this.chartOptions = { ...this.chartOptions, labels };
        const filteredAry = [...totals.data];
        filteredAry.splice(0, 1);
        this.series = filteredAry;
      }
    });
  }
};
</script>

<style></style>
