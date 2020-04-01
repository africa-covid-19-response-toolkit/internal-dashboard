<template>
  <v-card tile elevation="1" min-width="100" hover height="100">
    <v-layout column class="flex column mb-1 py-1 px-2 text-sm-center">
      <div class="overline flex">{{title}}</div>
      <div v-if="primaryLabel" class="black--text">
        <span class="title">{{primaryValue || 0}}</span>
        <span class="subtitle-1">{{primaryLabel}}</span>
      </div>
      <div v-if="secondaryLabel" class="red--text">
        <span class="title">{{secondaryValue || 0}}</span>
        <span class="subtitle-1">{{secondaryLabel}}</span>
      </div>
    </v-layout>
  </v-card>
</template>


<script>
export default {
  props: {
    icon: String,
    title: String,
    primaryValue: Number,
    primaryLabel: String,
    secondaryValue: Number,
    secondaryLabel: String,
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
        colors: ["#ffffff", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],

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
