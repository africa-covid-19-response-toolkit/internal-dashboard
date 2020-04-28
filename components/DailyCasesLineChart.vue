<template>
  <v-card tile elevation="0" class="transparent pa-12">
    <v-card-title>{{ title }}</v-card-title>
    <apexchart
      type="line"
      width="100%"
      height="350"
      :options="{...getChartOptions }"
      :series="getSeries"
    ></apexchart>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  props: [ "title", "chartdata" ],
  data() {
    const { series, ...chartOptions } = this.$props.chartdata;

    return {
      series,
      chartOptions: {
        ...chartOptions,
        xaxis: {
          type: 'datetime',
          tickAmount: 6,
        },
        stroke: {
          width: 2,
          curve: "smooth"
        },
        tooltip: {
          x: {
            format: 'dd MMMM'
          }
        },
        chart: {
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 2,
            opacity: 0.4,
            color: ['#449DD1', '#F86624', '#EA3546', '#662E9B', '#C5D86D'],
          },
        },
      },
    };
  },

  computed: {
    getChartOptions() {
      if (this.chartdata && this.chartdata.xaxis) {
        return {
          ...this.chartOptions,
          xaxis: {
            labels: {
              show: true
            },
            type: "category",
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
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 50,
              bottom: 0
            }
          },
          theme: {
            mode: this.$vuetify.theme.dark ? "dark" : "light",
            palette: "palette6"
          }
        };
      }
      return { ...this.chartOptions };
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
