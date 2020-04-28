<template>
  <v-card tile elevation="0" class="transparent pa-12">
    <v-card-title>{{ title }}</v-card-title>
    <apexchart
      type="line"
      width="100%"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </v-card>
</template>

<script>
export default {
  props: ["title", "chartdata"],
  data() {
    const { series, ...chartOptions } = this.$props.chartdata;

    return {
      series,
      chartOptions: {
        ...chartOptions,
        stroke: {
          width: 2,
          curve: "smooth"
        },
        chart: {
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 4,
            opacity: 0.6,
            color: ['#449DD1', '#F86624', '#EA3546', '#662E9B', '#C5D86D'],
          },
        },
      }
    };
  },
  mounted() {}
};
</script>
