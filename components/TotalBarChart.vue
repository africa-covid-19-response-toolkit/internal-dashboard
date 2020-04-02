<template>
  <v-card flat class="pr-1">
    <v-card-title>{{ title }}</v-card-title>
    <apexchart type="bar" width="100%" height="300" :series="series" :options="chartOptions" />
  </v-card>
</template>

<script>
export default {
  props: ["title", "series", "labels", "horizontal", "showDataLabel"],
  data() {
    return {
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: this.$props.horizontal,
            columnWidth: "55%",
            endingShape: "rounded"
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
      }
    };
  },
  mounted() {}
};
</script>
