
<template>
  <v-card tile class="pa-12" elevation="0">
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
        chart: {
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 2,
            opacity: 0.4,
            color: ['#662E9B', '#F86624', '#F9C80E', '#EA3546', '#43BCCD'],
          },
        },
        plotOptions: {
          bar: {
            startingShape: 'flat',
            endingShape: 'flat',
            horizontal: this.$props.horizontal,
            columnWidth: "50%"
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
        theme: {
          mode: this.$vuetify.theme.dark ? "dark" : "light",
          palette: "palette8"
        },
      }
    };
  },
  mounted() {}
};
</script>