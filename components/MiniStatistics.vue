<template>
  <v-card min-width="100" hover height="100">
    <v-layout column class="flex column">
      <div class="overline font-weight-bold flex ml-2">{{title}}</div>
      <v-flex row class="black--text ml-2 mb-0">
        <span class="display-1 font-weight-bold">{{primaryValue || 0}}</span>
        <div v-if="secondaryLabel" class="red--text ml-2">
          <span class="overline font-weight-medium">{{secondaryValue || 0}} {{secondaryLabel}}</span>
          <!-- <span class="body-2">{{secondaryLabel}}</span> -->
        </div>
      </v-flex>
      <apexchart width="100%" height="30" type="area" :options="chartOptions" :series="getSeries"></apexchart>
    </v-layout>
  </v-card>
</template>


<script>
export default {
  props: {
    color: String,
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
            enabled: true,
            color: this.color,
            shadeTo: "light",
            shadeIntensity: 0.5
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
        colors: ["secondary", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],

        stroke: {
          width: 2,
          opacity: 0.8
        },
        fill: {
          opacity: 0.5
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
