<template>
  <v-card hover class="ma-2">
    <v-card-title>{{ name }}</v-card-title>

    <apexchart width="550" height="320" type="bar" :options="chartOptions" :series="series"></apexchart>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data: function() {
    return {
      name: `ዬየቀን መረጃ ${new Date().getFullYear()}`,
      chartOptions: {
        theme: {
          mode: "light",
          palette: "palette4",
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
        },
        legend: {
          position: "top"
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
    ...mapGetters("stats", { findStatss: "find" }),
    async getStats() {
      const s = await this.findStats({});
      console.log(s);
      const daily = s.data[0].daily;

      const date = new Date();

      return s;
    }
  },
  methods: {
    ...mapActions("stats", { findStats: "find" }),
    updateChart() {
      const max = 90;
      const min = 20;
      const newData = this.series[0].data.map(() => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      });

      const colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"];

      // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
      this.chartOptions = {
        colors: [colors[Math.floor(Math.random() * colors.length)]]
      };
      // In the same way, update the series option
      this.series = [
        {
          data: newData
        }
      ];
    }
  }
};
</script>

<style></style>
