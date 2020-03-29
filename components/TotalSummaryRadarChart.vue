<template>
  <v-card elevation="0" hover tile>
    <v-card-title>{{ $t('chart_titles.confirmed') }}</v-card-title>

    <apexchart
      ref="radialBar"
      width="100%"
      height="252"
      type="radialBar"
      :options="getChartOptions"
      :series="getSeries"
    ></apexchart>
  </v-card>
</template>

<script>
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
      chartOptions: {
        theme: {
          palette: "palette6"
        },
        colors : ['#f26666', '#f2a81d', '#50bfa0', '#122a40'],
        animations: {
          enabled: false
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 0,
              size: "2%",
              background: "transparent",
              image: undefined
            },
            dataLabels: {
              name: {
                show: false
              },
              value: {
                show: false
              }
            }
          }
        },
        labels: [
          this.$t('covid_stages.confirmed'),
          this.$t('covid_stages.hospitalized'),
          this.$t('covid_stages.hospitalized_icu'),
          this.$t('covid_stages.dead')
        ],
        legend: {
          show: true,
          floating: true,
          fontSize: "11px",
          position: "left",
          offsetX: 20,
          offsetY: -6,
          labels: {
            useSeriesColors: true
          },
          markers: {
            size: 1
          },
          formatter: function(seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
          },
          itemMargin: {
            vertical: 3
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                show: false
              },
              plotOptions: {
                radialBar: {
                  dataLabels: {
                    name: {
                      show: true
                    },
                    value: {
                      show: true
                    }
                  }
                }
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
      return this.chartdata
        ? this.chartdata.series
          ? this.chartdata.series
          : []
        : [];
    }
  }
};
</script>

<style></style>
