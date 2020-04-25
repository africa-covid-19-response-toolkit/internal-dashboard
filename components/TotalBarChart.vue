
<template>
  <v-card tile class="pr-1" elevation="0">
    <v-card-title>{{ title }}</v-card-title>
    <apexchart type="bar" width="100%" :height="height" :series="series" :options="chartOptions" />
  </v-card>
</template>
<script>
export default {
  props: ["title", "height", "series", "labels", "horizontal", "showDataLabel"],
  data() {
    return {
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: this.$props.horizontal,
            columnWidth: "96%"
          }
        },
        title: { text: undefined, align: "center", floating: true },
        dataLabels: {
          enabled: this.$props.showDataLabel,
          textAnchor: "middle"
        },
        xaxis: {
          categories: this.$props.labels
        }
      }
    };
  },
  mounted() {}
};
</script>