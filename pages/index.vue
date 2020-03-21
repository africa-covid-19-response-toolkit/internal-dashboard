<template>
  <v-container align-center>
    <v-row>
      <v-col class="my-0">
        <h4>DASHBOARD</h4>
        <h6>COVID19 LIVE STATUS - ETHIOPIA</h6>
      </v-col>
      <v-spacer />

      <v-progress-circular indeterminate color="primary" v-if="loading" class="my-auto mx-2" />
      <v-btn rounded small color="primary" class="my-auto" @click="getStats">REFRESH</v-btn>
    </v-row>
    <v-divider class="mt-0" />
    <v-row>
      <!-- <v-col v-for="(item, index) in getLiveStats" :key="index" xs="6" sm="4" md="4" lg="2">
        <v-card tile hover class="pb-1 my-0 align-content-center">
          <v-row class="mx-auto my-auto align-center">
              <span class="ml-2 pt-1 display-1">{{ item }}</span>
            <span class="caption mx-2">{{ getCat(index) }}</span>
          </v-row>
        </v-card>
      </v-col>-->
      <v-col v-for="(item, index) in getLiveStats" :key="index" xs="6" sm="4" md="3" lg="2">
        <v-lazy>
          <MiniStatistics
            :subTitle="getCat(index)"
            :title="`${item}`"
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
      <v-col cols="12" xs="12" sm="6" md="4" lg="4">
        <v-lazy>
          <TotalDoghnut :chartdata="getLiveTotal" />
        </v-lazy>
      </v-col>

      <v-col cols="12" xs="12" sm="6" md="8" lg="8">
        <v-lazy>
          <DailyCasesLineChart :chartdata="getDailyLiveStats" />
        </v-lazy>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="6" md="4" lg="4">
        <v-lazy>
          <TotalRadar :chartdata="getLiveTotalConfirmed" />
        </v-lazy>
      </v-col>
      <v-col cols="12" xs="12" sm="6" md="8" lg="8">
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
import VuetifyLogo from "~/components/VuetifyLogo.vue";

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
    getHourlyLiveStats() {
      const all = this.findStatStore({ query: {} });
      if (all && all.data && all.data.length > 0) {
        const daily = all.data[0].today;

        // const currentMonth = nonths[daily.month];

        const xaxis = { categories: daily.labels };

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
        return { series, xaxis: { categories: months } };
      }
      return {};
    },

    getLiveTotal() {
      const all = this.findStatStore({ query: {} });
      if (all && all.data && all.data.length > 0) {
        const dt = all.data[0].total;

        // const currentMonth = nonths[daily.month];

        this.case_names_eng = dt.labels;
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

        const series = [];

        console.log(dt.data);
        series.push(dt.data[2]);
        series.push(dt.data[3] + dt.data[4]);
        series.push(dt.data[5]);
        series.push(dt.data[6]);
        return { series };
      }
      return { series: [0, 0, 0, 0, 0, 0] };
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
    },
    getColorForCase: function(index) {
      const status = this.status[index];
      if (status === "quarantined") return "blue";
      else if (status === "confirmed") return "red";
      else if (status === "hospitalized") return "orange";
      else if (status === "hospitalized_icu") return "brown";
      else if (status === "recovered") return "green";
      else if (status === "dead") return "black";
      else return "grey";
    }
  },
  created() {
    this.getStats();
  }
};
</script>
