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
      chart_title: `ወርሃዊ መረጃ - ${new Date().getFullYear()}`,
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

        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        },
        fill: {
          type: "gradient"
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 81]
        },
        {
          name: "series-1",
          data: [60, 40, 64, 50, 49, 10, 47, 51]
        }
      ]
    };
  },

  computed: {
    ...mapState("stats", { isLoading: "isFindPending" }),
    ...mapGetters("stats", { findStatStore: "find" }),
    getLiveStats() {
      const all = this.findStatStore({ query: {} });
      if (all && all.data && all.data.length > 0) {
        const daily = all.data[0].monthly;
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
          xaxis: { categories: months }
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
