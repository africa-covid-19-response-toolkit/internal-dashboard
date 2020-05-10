<template>
  <v-card tile class="pa-12" elevation="0">
    <v-card-title>{{ title }}</v-card-title>
    <apexchart type="bar" width="100%" :height="height" :series="series" :options="chartOptions" />
  </v-card>
</template>
<script>
export default {
  props: [
    "title",
    "height",
    "series",
    "grid",
    "tooltip",
    "colors",
    "labels",
    "labelFormatter",
    "stacked",
    "horizontal",
    "showDataLabel"
  ],
  data() {
    const colors = this.$props.colors;
    const grid = this.$props.grid;
    const tooltip = this.$props.tooltip;
    const labelFormatter = this.$props.labelFormatter;

    return {
      chartOptions: {
        chart: {
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 2,
            opacity: 0.4,
            color: ["#662E9B", "#F86624", "#F9C80E", "#EA3546", "#43BCCD"]
          },
          type: "bar",
          height: 300,
          stacked: this.$props.stacked
        },
        plotOptions: {
          bar: {
            startingShape: "flat",
            endingShape: "flat",
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
          categories: this.$props.labels,
          ...(labelFormatter
            ? {
                labels: {
                  formatter: labelFormatter
                }
              }
            : {})
        },
        theme: {
          mode: this.$vuetify.theme.dark ? "dark" : "light",
          palette: "palette8"
        },
        ...(colors ? { colors } : {}),
        ...(grid ? { grid } : {}),
        ...(tooltip ? { tooltip } : {})
      }
    };
  },
  mounted() {}
};
</script>
