<template>
  <v-container align-center>
    <h4>DASHBOARD</h4>
    <h6>COVID19 LIVE STATUS - ETHIOPIA</h6>
    <v-divider class="mt-4" />
    <v-row>
      <v-col
        v-for="(item, index) in getLiveStats"
        :key="index"
        cols="12"
        xs="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-card height="90px" elevation="1" class="pb-1 my-0">
          <v-card-title>
            <h1>{{item}}</h1>
          </v-card-title>
          <v-card-subtitle>{{getCat(index)}}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="4" lg="4">
        <TotalRadar />
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="8" lg="8">
        <DailyCasesLineChart />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="4" lg="4">
        <TotalDoghnut />
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="8" lg="8">
        <MonthlyCasesLineChart />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import DailyCasesBarChart from "~/components/DailyCasesBarChart";
import DailyCasesLineChart from "~/components/DailyCasesLineChart";
import MonthlyCasesLineChart from "~/components/MonthlyCasesLineChart";
import TotalDoghnut from "~/components/TotalDonut";
import TotalRadar from "~/components/TotalSummaryRadarChart";
import LineChart from "~/components/LineChart.vue";
import TotalBarChart from "~/components/TotalBarchart.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";

export default {
  components: {
    DailyCasesBarChart,
    MonthlyCasesLineChart,
    TotalRadar,
    DailyCasesLineChart,
    TotalDoghnut,
    TotalBarChart,
    LineChart,
    VuetifyLogo
  },
  data() {
    return {
      labels: [
        "ማግለያ የገቡ",
        "የተገኘባቸው",
        "ወደ ህክምና የገቡ",
        "በጠና የታመሙ",
        "ያገገሙ",
        "በሞት የተለዩ"
      ]
    };
  },
  computed: {
    ...mapState("stats", { isLoading: "isFindPending" }),
    ...mapGetters("stats", { findStatStore: "find" }),
    getLiveStats() {
      const all = this.findStatStore({ query: {} });
      if (all && all.data && all.data.length > 0) {
        const daily = all.data[0].total;
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];
        const total = [...daily.data];
        total.splice(0, 1);
        return total;
      }
      return 0;
    }
  },
  methods: {
    ...mapState("stats", { isLoading: "isFindPending" }),
    ...mapActions("stats", { findStats: "find" }),
    async getStats() {
      await this.findStats({ query: {} });
    },
    getCat: function(index) {
      return this.labels[index];
    }
  },
  mounted() {
    this.getStats();
  }
};
</script>
