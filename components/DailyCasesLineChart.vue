<template>
  <v-card>
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
        ...chartOptions
      }
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
