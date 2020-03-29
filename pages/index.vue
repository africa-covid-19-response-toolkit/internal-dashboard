<template>
  <v-container fluid align-center>
    <v-row>
      <v-col class="my-0">
        <h1>DASHBOARD</h1>
        <h6>COVID19 LIVE STATUS - ETHIOPIA</h6>
      </v-col>
      <v-spacer />

      <v-progress-circular indeterminate color="primary" v-if="loading" class="my-auto mx-2" />
      <v-btn depressed rounded color="secondary" class="my-auto" @click="getStats">
        <v-icon>mdi-reload</v-icon>REFRESH
      </v-btn>
    </v-row>
    <v-divider class="mt-0" />
    <v-row>
      <v-col v-for="(item, index) in getLiveTotal.series" :key="index" xs="6" sm="4" md="3" lg="2">
        <v-lazy>
          <MiniStatistics
            :subTitle="getCat(index)"
            :title="`${item}`"
            :chart="getDailyLiveStats.series[index]"
            :color="getColorForCase(index)"
          />
        </v-lazy>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-lazy>
          <HourlyCasesLineChart :chartdata="getHourlyLiveStats" />
        </v-lazy>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="6" md="8" lg="8">
        <Map />
      </v-col>
      <v-col cols="12" xs="12" sm="6" md="4" lg="4">
        <v-lazy>
          <TotalDoghnut :chartdata="getLiveTotalDonut" />
        </v-lazy>
        <v-lazy>
          <TotalRadar :chartdata="getLiveTotalConfirmed" class="mt-8" />
        </v-lazy>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-lazy>
          <DailyCasesLineChart :chartdata="getDailyLiveStats" />
        </v-lazy>
      </v-col>
    </v-row>
    <v-row>
      <!-- <v-col cols="12" xs="12" sm="6" md="4" lg="4">
        <v-lazy>
          <TotalRadar :chartdata="getLiveTotalConfirmed" />
        </v-lazy>
      </v-col>-->
      <!--  xs="12" sm="6" md="8" lg="8" -->
      <v-col cols="12">
        <v-lazy>
          <MonthlyCasesLineChart :chartdata="getMonthlyLiveStats" />
        </v-lazy>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

// import DailyCasesBarChart from "~/components/DailyCasesBarChart";
import MiniStatistics from "~/components/MiniStatistics";
import DailyCasesLineChart from "~/components/DailyCasesLineChart";
import HourlyCasesLineChart from "~/components/HourlyCasesLineChart";
import MonthlyCasesLineChart from "~/components/MonthlyCasesLineChart";
import TotalDoghnut from "~/components/TotalDonut";
import TotalRadar from "~/components/TotalSummaryRadarChart";
import LineChart from "~/components/LineChart.vue";
import TotalBarChart from "~/components/TotalBarChart.vue";
import Map from "@/components/Map";

export default {
  components: {
    HourlyCasesLineChart,
    MonthlyCasesLineChart,
    MiniStatistics,
    TotalRadar,
    DailyCasesLineChart,
    TotalDoghnut,
    TotalBarChart,
    LineChart,
    Map
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
      ],
      status: [
        "quarantined",
        "confirmed",
        "hospitalized",
        "hospitalized_icu",
        "recovered",
        "dead"
      ]
    };
  },
  computed: {
    // ...mapGetters("stats", { findStatStore: "getAllStats" }),

    findStatStore() {
      return this.$store.state.stats.allstats;
    },
    getHourlyLiveStats() {
      const all = this.findStatStore;
      if (all && all.data && all.data.length > 0) {
        const daily = all.data[0].today;

        // const currentMonth = nonths[daily.month];

        const xaxis = {
          categories: {
            min: 0,
            max: 24,
            title: {
              text: "Hour"
            }
          }
        };

        const series = [
          {
            name: "ማግለያ የገቡ",
            data: daily.quarantined.data
          },
          {
            name: "ቫይረሱ የተገኘባቸው",
            data: daily.confirmed.data
          },
          {
            name: "ህክምና የገቡ",
            data: daily.hospitalized.data
          },
          {
            name: "በጠና የታመሙ",
            data: daily.hospitalized_icu.data
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

    getDailyLiveStats() {
      const all = this.findStatStore;
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

        const xaxis = {
          categories: daily.confirmed.labels,
          title: {
            text: "days"
          }
        };

        const series = [
          {
            name: "ማግለያ የገቡ",
            data: daily.quarantined.data
          },
          {
            name: "ቫይረሱ የተገኘባቸው",
            data: daily.confirmed.data
          },
          {
            name: "ህክምና የገቡ",
            data: daily.hospitalized.data
          },
          {
            name: "በጠና የታመሙ",
            data: daily.hospitalized_icu.data
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
      return { series: [] };
    },

    getMonthlyLiveStats() {
      const all = this.findStatStore;
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
            name: "ማግለያ የገቡ",
            data: daily.quarantined.data
          },
          {
            name: "ቫይረሱ የተገኘባቸው",
            data: daily.confirmed.data
          },
          {
            name: "ህክምና የገቡ",
            data: daily.hospitalized.data
          },
          {
            name: "በጠና የታመሙ",
            data: daily.hospitalized_icu.data
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
        return {
          series,
          xaxis: {
            categories: months,
            title: {
              text: "Month"
            }
          }
        };
      }
      return {};
    },

    getLiveTotalDonut() {
      const all = this.findStatStore;
      if (all && all.data && all.data.length > 0) {
        const dt = all.data[0].total;

        // const currentMonth = nonths[daily.month];

        this.case_names_eng = dt.labels;
        const series = [...dt.data];
        series.splice(0, 1);
        //allconfirmed
        // series[1] = dt.allconfirmed;
        return { series };
      }
      return { series: [0, 0, 0, 0, 0, 0] };
    },
    getLiveTotal() {
      const all = this.findStatStore;
      if (all && all.data && all.data.length > 0) {
        const dt = all.data[0].total;

        // const currentMonth = nonths[daily.month];

        this.case_names_eng = dt.labels;
        const series = [...dt.data];
        series.splice(0, 1);
        //allconfirmed
        series[1] = dt.allconfirmed;
        return { series };
      }
      return { series: [0, 0, 0, 0, 0, 0] };
    },
    getLiveTotalConfirmed() {
      const all = this.findStatStore;
      if (all && all.data && all.data.length > 0) {
        const dt = all.data[0].total;

        const series = [];

        console.log(dt.data);
        series.push(dt.allconfirmed);
        series.push(dt.data[3] + dt.data[4]);
        series.push(dt.data[5]);
        series.push(dt.data[6]);
        return { series };
      }
      return { series: [0, 0, 0, 0, 0, 0] };
    }
  },

  methods: {
    ...mapActions("stats", { loadStats: "loadStats" }),
    async getStats() {
      this.loading = true;
      try {
        await this.loadStats();
        this.loading = false;
      } catch (err) {
        console.log(err);
        this.loading = false;
      }
    },
    getCat: function(index) {
      return this.labels[index];
    },
    getColorForCase: function(index) {
      const status = this.status[index];
      if (status === "quarantined") return "#499ebf";
      else if (status === "confirmed") return "#f26666";
      else if (status === "hospitalized") return "#f2a81d";
      else if (status === "hospitalized_icu") return "#484c7f";
      else if (status === "recovered") return "#50bfa0";
      else if (status === "dead") return "#122a40";
      else return "grey";
    }
  },
  async created() {
    this.getStats();
  }
};
</script>
