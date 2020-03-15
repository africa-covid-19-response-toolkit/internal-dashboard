<template>
  <v-card hover elevation="1" class="ma-0">
    <v-card-title>{{ name }}</v-card-title>

    <apexchart
      ref="radialBar"
      width="100%"
      height="252"
      type="radialBar"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </v-card>
</template>

<script>
export default {
  data: function() {
    return {
      name: "ቫይረሱ የተገኘባቸው",
      series: [76, 15, 60, 1],
      chartOptions: {
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 0,
              size: "2%",
              background: "transparent",
              image: undefined
            },
            dataLabels: {
              name: {
                show: false
              },
              value: {
                show: false
              }
            }
          }
        },
        labels: ["የተገኘባቸው", "ወደ ህክምና የገቡ", "ያገገሙ", "በሞት የተለዩ"],
        legend: {
          show: true,
          floating: true,
          fontSize: "13px",
          position: "left",
          offsetX: 0,
          offsetY: -6,
          labels: {
            useSeriesColors: true
          },
          markers: {
            size: 1
          },
          formatter: function(seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
          },
          itemMargin: {
            vertical: 3
          }
        }
      }
    };
  }
};
</script>

<style></style>
