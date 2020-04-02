<template>
  <v-container fluid align-center>
    <v-row>
      <v-col class="my-0">
        <h1>{{ $t("titles.dashboard") }}</h1>
        <h6>{{ $t("titles.live_status") }}</h6>
      </v-col>
      <v-spacer />

      <v-progress-circular indeterminate color="primary" v-if="loading" class="my-auto mx-2" />
      <v-btn depressed rounded color="secondary" class="my-auto" @click="getStats">
        <v-icon>mdi-reload</v-icon>
        {{ $t("refresh") }}
      </v-btn>
    </v-row>
    <v-divider class="mt-0" />
    <v-row>
      <v-col v-for="(item, index) in getTotalStats.series" :key="index" xs="4">
        <v-lazy>
          <MiniStatistics
            :title="getCat(index)"
            :primaryValue="item[0]"
            :secondaryValue="item[1]"
            :chart="getLast30DayStats.series[index]"
            :color="getColorForCase(index)"
            :primaryLabel="$t(suffixesMap[index][0])"
            :secondaryLabel="$t(suffixesMap[index][1])"
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
      <v-col cols="12" xs="12" sm="6" md="7" lg="7">
        <Map />
      </v-col>
      <v-col cols="12" xs="12" sm="6" md="5" lg="5">
        <v-lazy>
          <TotalBarChart
            :horizontal="false"
            :showDataLabel="false"
            :title="$t('chart_titles.total_by_traveled_from')"
            :series="getTotalByTravelSeries.series"
            :labels="getTotalByTravelSeries.labels"
          />
        </v-lazy>
        <v-lazy>
          <TotalBarChart
            class="mt-8"
            :horizontal="false"
            :showDataLabel="false"
            :title="$t('chart_titles.total_by_city')"
            :series="getTotalByRegionSeries.series"
            :labels="getTotalByRegionSeries.labels"
          />
        </v-lazy>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="6" md="12" lg="6">
        <v-lazy>
          <DailyCasesLineChart
            chartType="line"
            title="Last 30 days"
            :chartdata="getLast30DayStats"
          />
        </v-lazy>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="12" lg="6">
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
        "covid_stages.confirmed",
        "covid_stages.hospitalized",
        "covid_stages.recovered",
        "covid_stages.quarantined"
      ],
      status: ["confirmed", "hospitalized", "recovered", "quarantined"],
      suffixesMap: {
        0: ["covid_stages.confirmed", "covid_stages.dead"],
        1: [
          "covid_stages.hospitalized_stable",
          "covid_stages.hospitalized_critical"
        ],
        2: ["covid_stages.recovered"],
        3: ["covid_stages.quarantined"]
      }
    };
  },
  computed: {
    // ...mapGetters("stats", { findStatStore: "getAllStats" }),

    findStatStore() {
      return this.$store.state.stats.allstats;
    },
    getTotalStats() {
      return { series: [[26, 0], [19, 2], [2], [1]] };
    },
    getTotalByTravelSeries() {
      const whatapigives = {
        confirmed: [0, 0, 3, 0, 0, 25, 0, 0],
        labels: [
          "Japan",
          "Dubai",
          "Italy",
          "USA",
          "Australia",
          "China",
          "France",
          "Korea"
        ]
      };

      const chartdata = {
        series: [
          {
            name: this.$t("covid_stages.confirmed"),
            data: whatapigives.confirmed
          }
        ],
        labels: whatapigives.labels
      };

      return chartdata;
    },
    getTotalByRegionSeries() {
      const whatapigives = {
        confirmed: [0, 0, 3, 0, 0, 25, 0, 0, 0, 0],
        recovored: [0, 0, 3, 0, 0, 25, 0, 0, 0, 0],
        dead: [0, 0, 3, 0, 0, 25, 0, 0, 0, 0],
        labels: [
          "Tigray",
          "Afar",
          "Amhara",
          "Benishangul",
          "Oromiya",
          "Gambela",
          "SNNP",
          "Somali",
          "Addis Ababa",
          "Harar",
          "Dire Dawa"
        ]
      };

      const chartdata = {
        series: [
          {
            name: this.$t("covid_stages.confirmed"),
            data: whatapigives.confirmed
          },
          {
            name: this.$t("covid_stages.recovered"),
            data: whatapigives.recovored
          },
          {
            name: this.$t("covid_stages.dead"),
            data: whatapigives.dead
          }
        ],
        labels: whatapigives.labels
      };

      return chartdata;
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
              text: this.$t("calendar.hour")
            }
          }
        };

        const series = [
          {
            name: this.$t("covid_stages.quarantined"),
            data: daily.quarantined.data
          },
          {
            name: this.$t("covid_stages.confirmed"),
            data: daily.confirmed.data
          },
          {
            name: this.$t("covid_stages.hospitalized"),
            data: daily.hospitalized.data
          },
          {
            name: this.$t("covid_stages.hospitalized_icu"),
            data: daily.hospitalized_icu.data
          },
          {
            name: this.$t("covid_stages.recovered"),
            data: daily.recovered.data
          },
          {
            name: this.$t("covid_stages.dead"),
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
            text: this.$t("calendar.days")
          }
        };

        const series = [
          {
            name: this.$t("covid_stages.quarantined"),
            data: daily.quarantined.data
          },
          {
            name: this.$t("covid_stages.confirmed"),
            data: daily.confirmed.data
          },
          {
            name: this.$t("covid_stages.hospitalized"),
            data: daily.hospitalized.data
          },
          {
            name: this.$t("covid_stages.hospitalized_icu"),
            data: daily.hospitalized_icu.data
          },
          {
            name: this.$t("covid_stages.recovered"),
            data: daily.recovered.data
          },
          {
            name: this.$t("covid_stages.dead"),
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
            name: this.$t("covid_stages.quarantined"),
            data: daily.quarantined.data
          },
          {
            name: this.$t("covid_stages.confirmed"),
            data: daily.confirmed.data
          },
          {
            name: this.$t("covid_stages.hospitalized"),
            data: daily.hospitalized.data
          },
          {
            name: this.$t("covid_stages.hospitalized_icu"),
            data: daily.hospitalized_icu.data
          },
          {
            name: this.$t("covid_stages.recovered"),
            data: daily.recovered.data
          },
          {
            name: this.$t("covid_stages.dead"),
            data: daily.dead.data
          }
        ];
        return {
          series,
          xaxis: {
            categories: months,
            title: {
              text: this.$t("calendar.month")
            }
          }
        };
      }
      return {};
    },

    getLast30DayStats() {
      const all = this.findStatStore;
      if (all && all.data && all.data.length > 0) {
        const daily = all.data[0].last30;
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
            text: this.$t("calendar.days")
          }
        };

        const series = [
          {
            name: this.$t("covid_stages.quarantined"),
            data: daily.quarantined.data
          },
          {
            name: this.$t("covid_stages.confirmed"),
            data: daily.confirmed.data
          },
          {
            name: this.$t("covid_stages.hospitalized"),
            data: daily.hospitalized.data
          },
          {
            name: this.$t("covid_stages.hospitalized_icu"),
            data: daily.hospitalized_icu.data
          },
          {
            name: this.$t("covid_stages.recovered"),
            data: daily.recovered.data
          },
          {
            name: this.$t("covid_stages.dead"),
            data: daily.dead.data
          }
        ];

        const d = { series, xaxis };
        return d;
      }
      return { series: [] };
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
        console.log("series ", series);
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
      return this.$t(this.labels[index]);
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
  async mounted() {
    this.getStats();
  }
};
</script>
