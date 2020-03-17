<template>
  <v-container align-center>
    <v-row
      ><v-col class="my-0"
        ><h4>DASHBOARD</h4>
        <h6>COVID19 LIVE STATUS - ETHIOPIA</h6></v-col
      >
      <v-spacer /><v-progress-circular v-if="loading" /><v-btn @click="getStats"
        >REFRESH</v-btn
      ></v-row
    >
    <v-divider class="mt-0" />
    <v-row>
      <v-col
        v-for="(item, index) in getLiveStats"
        :key="index"
        xs="6"
        sm="10"
        md="3"
        lg="2"
      >
        <v-card height="90px" elevation="1" class="pb-1 my-0">
          <v-card-title>
            <h1>{{ item }}</h1>
          </v-card-title>
          <v-card-subtitle>{{ getCat(index) }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="6" md="4" lg="4">
        <TotalRadar :chartdata="getLiveTotalConfirmed" />
      </v-col>
      <v-col cols="12" xs="12" sm="6" md="8" lg="8">
        <DailyCasesLineChart :chartdata="getDailyLiveStats" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="6" md="4" lg="4">
        <TotalDoghnut :chartdata="getLiveTotal" />
      </v-col>
      <v-col cols="12" xs="12" sm="6" md="8" lg="8">
        <MonthlyCasesLineChart :chartdata="getMonthlyLiveStats" />
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
      loading: false,
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
    },

    getDailyLiveStats() {
      const all = this.findStatStore({ query: {} });
      if (all && all.data && all.data.length > 0) {
        const daily = all.data[0].daily;
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
        // const currentMonth = nonths[daily.month];

        const xaxis = { categories: daily.confirmed.labels };

        const series = [
          {
            name: "ቫይረሱ የተገኘባቸው",
            data: daily.confirmed.data
          },
          {
            name: "ያገገሙ",
            data: daily.recovered.data
          },
          {
            name: "በሞት የተለዩ",
            data: daily.dead.data
          }
        ];

        const d = { series, xaxis };
        return d;
      }
      return {};
    },

    getMonthlyLiveStats() {
      const all = this.findStatStore({ query: {} });
      if (all && all.data && all.data.length > 0) {
        const daily = all.data[0].monthly;
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
        // const currentMonth = nonths[daily.month];

        const series = [
          {
            name: "ቫይረሱ የተገኘባቸው",
            data: daily.confirmed.data
          },
          {
            name: "ያገገሙ",
            data: daily.recovered.data
          },
          {
            name: "በሞት የተለዩ",
            data: daily.dead.data
          }
        ];
        return { series, xaxis: { categories: months } };
      }
      return {};
    },

    getLiveTotal() {
      const all = this.findStatStore({ query: {} });
      if (all && all.data && all.data.length > 0) {
        const dt = all.data[0].total;

        // const currentMonth = nonths[daily.month];

        const series = [...dt.data];
        series.splice(0, 1);
        return { series };
      }
      return {};
    },
    getLiveTotalConfirmed() {
      const all = this.findStatStore({ query: {} });
      if (all && all.data && all.data.length > 0) {
        const dt = all.data[0].total;

        // const currentMonth = nonths[daily.month];

        const series = [];
        // series.push(st.data[dt.labels.indexOf("confirmed")]);
        // series.push(
        //   st.data[dt.labels.indexOf("hospitalized")] +
        //     st.data[dt.labels.indexOf("hospitalized_icu")]
        // );
        // series.push(st.data[dt.labels.indexOf("recovered")]);
        // series.push(st.data[dt.labels.indexOf("dead")]);

        console.log(dt.data);
        series.push(dt.data[2]);
        series.push(dt.data[3] + dt.data[4]);
        series.push(dt.data[5]);
        series.push(dt.data[6]);
        return { series };
      }
      return {};
    }
  },

  methods: {
    ...mapActions("stats", { findStats: "find" }),
    async getStats() {
      this.loading = true;
      await this.findStats({ query: {} })
        .then(r => {
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getCat: function(index) {
      return this.labels[index];
    }
  },
  created() {
    this.getStats();
  }
};
</script>
