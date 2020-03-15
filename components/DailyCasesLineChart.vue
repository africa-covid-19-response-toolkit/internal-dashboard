<template>
  <v-card hover elevation="1">
    <v-card-title>{{ chart_title }}</v-card-title>

    <apexchart
      v-if="!isLoading"
      width="100%"
      height="240"
      type="area"
      :options="chartOptions"
      :series="getLiveStats"
    ></apexchart>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data: function() {
    return {
      chart_title: `ዬየቀን መረጃ  - ${new Date().toDateString()}`,
      chartOptions: {
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

        fill: {
          type: "gradient"
        }
      },
      series: [],
      legend: { position: "top" }
    };
  },

  computed: {
    ...mapState("stats", { isLoading: "isFindPending" }),
    ...mapGetters("stats", { findStatStore: "find" }),
    getLiveStats() {
      const all = this.findStatStore({ query: {} });
      if (all && all.data && all.data.length > 0) {
        const daily = all.data[0].daily;
        const months = [
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
        ];
        // const currentMonth = nonths[daily.month];

        this.chartOptions = {
          ...this.chartOptions,
          xaxis: { categories: daily.confirmed.labels }
        };

        const series = [
          {
            name: "ቫይረሱ የተገኘባቸው",
            data: daily.confirmed.data
          },
          {
            name: "ያገገሙ",
            data: daily.recovered.data
          },
          {
            name: "በሞት የተለዩ",
            data: daily.dead.data
          }
        ];
        return series;
      }
      return [];
    }
  },
  methods: {
    ...mapState("stats", { isLoading: "isFindPending" }),
    ...mapActions("stats", { findStats: "find" }),
    async getStats() {
      const all = await this.findStats({ query: {} });
    }
  },
  mounted() {
    this.getStats();
  }
};
</script>

<style></style>
