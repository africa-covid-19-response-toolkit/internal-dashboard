<template>
  <v-card tile>
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
        ...chartOptions
      }
    };
  },
  mounted() {}
};
</script>
