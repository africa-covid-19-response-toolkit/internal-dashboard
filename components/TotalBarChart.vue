<template>
  <v-card elevation="1" hover tile class="pr-1">
    <v-card-title>{{ title }}</v-card-title>
    <apexchart type="bar" width="100%" height="300" :series="series" :options="chartOptions" />
  </v-card>
</template>

<script>
export default {
  props: ["title", "values", "labels", "horizontal", "showDataLabel"],
  data() {
    return {
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: this.$props.horizontal
          }
        },
        title: { text: undefined, align: "center", floating: true },
        dataLabels: {
          enabled: this.$props.showDataLabel,
          textAnchor: "middle"
        },
        xaxis: {
          categories: this.$props.labels
        },
        tooltip: {
          y: {
            title: {
              formatter() {
                return "";
              }
            }
          }
        }
      },
      series: [
        {
          data: this.$props.values
        }
      ]
    };
  },
  mounted() {}
};
</script>
