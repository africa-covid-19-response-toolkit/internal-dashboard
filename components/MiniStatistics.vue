<template>
  <v-card elevation="0" light tile min-width="100" hover height="120" :style="{ borderColor: color}">

    <v-layout row class="py-0 my-0">
      <div
        flat
        dark
        tile
        style="font-weight: 900; text-align:center; height=100%;"
        :style="{ color: color}"
        class="sm4 xs4 flex text-sm-center display-1 my-auto mx-auto"
      >{{ title }}</div>

      <div
        style="text-align:center; height=100%;"
        class="sm8 caption xs8 flex text-sm-center my-auto"
      >{{ subTitle }}</div>
    </v-layout>
    <v-spacer />
    <apexchart width="100%" height="40" type="bar" :options="chartOptions" :series="getSeries"></apexchart>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    subTitle: String,
    color: String,
    chart: {
      type: Object,
      default: () => {
        return {
          data: []
        };
      }
    }
  },
  data() {
    return {
      chartOptions: {
        animations: {
          enabled: false
        },
        theme: {
          // mode: "light",
          palette: "palette1",
          monochrome: {
            enabled: false,
            color: "#255aee",
            shadeTo: "light",
            shadeIntensity: 0.55
          }
        },

        tooltip: {
          enabled: false
        },

        chart: {
          type: "line",
          sparkline: {
            enabled: true
          },
          background: "transparent"
        },
        colors: ["#000000", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],

        stroke: {
          width: 1
        },
        fill: {
          opacity: 1
        },
        xaxis: { min: 0, max: 31 },
        yaxis: {
          min: 0
        }
      }
    };
  },
  computed: {
    getSeries() {
      return [this.chart];
    }
  },
  mounted() {}
};
</script>
<style>
.v-card {
  border-top: 10px solid;
}
</style>