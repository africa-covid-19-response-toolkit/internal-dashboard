<template>
  <v-container fluid align-center class="mx-0 px-0">
    <v-row class="px-3 mx-0">
      <v-col class="my-0 px-0">
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
    <!-- <v-divider class="mt-0 px-3" /> -->
    <v-row class="px-3">
      <v-col v-for="(item, index) in getTotalStats.series" :key="index" xs="4">
        <v-lazy>
          <MiniStatistics
            :height="584"
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
      <v-flex xs12 sm12>
        <Map />
      </v-flex>
    </v-row>
    <v-container>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6">
          <v-lazy>
            <TotalBarChart
              :height="400"
              :horizontal="true"
              :showDataLabel="false"
              :title="$t('Cases by Region (Top 20)')"
              :series="getTop20Regions.series"
              :labels="getTop20Regions.labels"
              class="transparent"
            />
          </v-lazy>
        </v-col>

        <v-col cols="12" xs="12" sm="12" md="6" lg="6">
          <v-lazy>
            <TotalBarChart
              :height="400"
              :horizontal="false"
              :showDataLabel="false"
              :title="$t('Cases by Zone')"
              :series="getTotalByRegionSeries.series"
              :labels="getTotalByRegionSeries.labels"
              class="transparent"
            />
          </v-lazy>
        </v-col>
      </v-row>
    </v-container>
    <v-row class="px-6">
      <v-col cols="12" xs="12" sm="12" md="12" lg="12">
        <v-lazy>
          <TotalBarChart
            :height="360"
            :horizontal="true"
            :showDataLabel="false"
            :title="$t('Cases by Travel History (Top 10)')"
            :series="getTotalByTravelSeries.series"
            :labels="getTotalByTravelSeries.labels"
          />
        </v-lazy>
      </v-col>
    </v-row>
    <v-row class="px-12 mx-12">
      <v-col cols="12" xs="12" sm="6" md="6">
        <v-lazy>
          <v-card elevation="0" hover tile style="height: 510px;" class="transparent">
            <v-card-title>
              Hospitalization Status
              <span
                class="index__pie_chart_percentage_label"
              >{{ hospitalizedPercentage ? ` ${hospitalizedPercentage}% ICU` : '' }}</span>
            </v-card-title>
            <PieChart
              :labels="[ 'Non-hospitalized', 'Hospitalized ICU', 'Hospitalized Non-ICU' ]"
              :datasets="getHospitalizationStats"
            />
          </v-card>
        </v-lazy>
      </v-col>
      <v-col cols="12" xs="12" sm="6" md="6">
        <v-lazy>
          <v-card elevation="0" hover tile style="height: 510px;" class="transparent">
            <v-card-title>
              Outcome Status
              <span
                class="index__pie_chart_percentage_label"
              >{{ finalOutcomePercentage ? ` ${finalOutcomePercentage}% Deceased` : '' }}</span>
            </v-card-title>
            <PieChart :labels="[ 'Recovered', 'Deceased' ]" :datasets="getFinalOutcomeStats" />
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
    <v-row class="px-3 mx-0">
      <v-col cols="12">
        <v-lazy>
          <HourlyCasesLineChart :chartdata="getHourlyLiveStats" />
        </v-lazy>
      </v-col>
    </v-row>
    <v-row class="px-3 mx-0">
      <v-col cols="12">
        <v-lazy>
          <TimeSeriesChart :title="$t('Last 7 Days')" :chartdata="getWeekStats" />
        </v-lazy>
      </v-col>
    </v-row>
    <v-row class="px-3 mx-0">
      <v-col cols="12" xs="12" sm="6" md="12" lg="12">
        <v-lazy>
          <DailyCasesLineChart
            chartType="line"
            :title="'Last 30 days'"
            :chartdata="getLast30DayStats"
          />
        </v-lazy>
      </v-col>
    </v-row>
    <v-row class="px-3 mx-0">
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
import { addDays, format } from "date-fns";
import getEstimatedCases from "@/util/estimates";

// import DailyCasesBarChart from "~/components/DailyCasesBarChart";
import MiniStatistics from "~/components/MiniStatistics";
import TimeSeriesChart from "@/components/TimeSeriesChart";
import DailyCasesLineChart from "~/components/DailyCasesLineChart";
import HourlyCasesLineChart from "~/components/HourlyCasesLineChart";
import MonthlyCasesLineChart from "~/components/MonthlyCasesLineChart";
import TotalDoghnut from "~/components/TotalDonut";
import TotalRadar from "~/components/TotalSummaryRadarChart";
import LineChart from "~/components/LineChart.vue";
import TotalBarChart from "~/components/TotalBarChart.vue";
import PieChart from "~/components/PieChart.vue";
import Map from "@/components/Map";
import pmoCases from "../resources/pmoCases.json";
import pmoPatients from "../resources/pmoPatients.json";
import _groupBy from "lodash/groupBy";
import _map from "lodash/map";
import _orderBy from "lodash/orderBy";
import _filter from "lodash/filter";
import _reject from "lodash/reject";
import _forEach from "lodash/forEach";
import _sortedUniqBy from "lodash/sortedUniqBy";
import _uniqBy from "lodash/uniqBy";
import _find from "lodash/find";
// import administrativeZoneDataAll from "../resources/ethiopia_administrative_zones_full.json";
import MomentTimezone from "moment-timezone";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(MomentTimezone);

function roundValue(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function createNewRegionRecord(data) {
  var name = data.properties.NAME_3;
  var adminRegion1Id = data.properties.ID_1;
  var adminRegion1Name = data.properties.NAME_1;
  var adminRegion3Id = data.properties.ID_3;

  if (data.properties.NAME_3.includes("WEREDA ") === true) {
    name = data.properties.NAME_1;
  }

  return {
    adminRegion1Id: adminRegion1Id,
    adminRegion1Name: adminRegion1Name,
    adminRegion3Id: adminRegion3Id,
    name: name,
    totalCases: 0,
    totalRecovered: 0,
    totalHospitalized: 0,
    totalIsolated: 0,
    totalDeceased: 0,
    firstCase: null
  };
}

var progress = [
  { duration: 120, dateAdded: "2017-03-02T15:45:31.315Z" },
  { duration: 120, dateAdded: "2017-03-02T15:47:32.150Z" },
  { duration: 120, dateAdded: "2017-03-02T12:45:32.150Z" },
  { duration: 120, dateAdded: "2017-03-02T12:47:32.150Z" },
  { duration: 120, dateAdded: "2017-03-02T10:45:32.150Z" }
];

function createHourlyGroupedRecords(records) {
  let hash = Object.create(null);
  let grouped = [];
  _forEach(records, record => {
    var key = record.date_time_announced.slice(0, 13);
    if (!hash[key]) {
      hash[key] = { cases: 1, time: key + ":00:00.000Z" };
      grouped.push(hash[key]);
    }
    hash[key].cases += 1;
  });

  return grouped;
}

function createDailyGroupedRecords(records) {
  let hash = Object.create(null);
  let grouped = [];
  _forEach(records, record => {
    var key = record.date_time_announced.slice(0, 10);
    if (!hash[key]) {
      hash[key] = { cases: 1, time: key + "T00:00:00.000Z" };
      grouped.push(hash[key]);
    }
    hash[key].cases += 1;
  });

  return grouped;
}

function createMonthlyGroupedRecords(records) {
  let hash = Object.create(null);
  let grouped = [];
  _forEach(records, record => {
    var key = record.date_time_announced.slice(0, 7);
    if (!hash[key]) {
      hash[key] = { cases: 1, time: key + "-01T00:00:00.000Z" };
      grouped.push(hash[key]);
    }
    hash[key].cases += 1;
  });

  return grouped;
}

function sortRecordsByTime(groupedRecords) {
  return groupedRecords.sort(function(a, b) {
    return b.time.localeCompare(a.time);
  });
}

function timeOneDay() {
  var time = [];
  var hoursPerDay = 24;
  var formattedTime;

  var i;
  for (i = 0; i < hoursPerDay; i++) {
    //fill in all of the hours
    formattedTime = moment()
      .startOf("hour")
      .tz("Africa/Addis_Ababa")
      .subtract(i, "hours")
      .toISOString(); //give the time in format X AM/PM
    time.unshift(formattedTime); //add to beginning of array
  }
  return time; //do this for all 24 hours
}

export default {
  components: {
    HourlyCasesLineChart,
    MonthlyCasesLineChart,
    MiniStatistics,
    TotalRadar,
    TimeSeriesChart,
    DailyCasesLineChart,
    TotalDoghnut,
    TotalBarChart,
    LineChart,
    PieChart,
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
      },
      hospitalizedPercentage: null,
      icuPercentage: null,
      finalOutcomePercentage: null,
      administrativeZoneDataAll: null,
      regionRecords: [],
      woredaCasesChartData: {
        series: [
          {
            name: "Cases",
            data: []
          }
        ],
        labels: []
      }
    };
  },
  computed: {
    // ...mapGetters("stats", { findStatStore: "getAllStats" }),

    findStatStore() {
      return this.$store.state.stats.allstats;
    },
    getTotalStats() {
      let totalCaseObj = pmoCases[0];
      let totalHospitalized = totalCaseObj.stable + totalCaseObj.critical;
      return {
        series: [
          [totalCaseObj.confirmed, totalCaseObj.deceased],
          [totalHospitalized, totalCaseObj.critical],
          [totalCaseObj.recovered],
          [totalCaseObj.tested]
        ]
      };
    },
    getTop20Regions() {
      let uniqueRegions = _uniqBy(this.regionRecords, "name");
      let woredaByTotalCases = _map(uniqueRegions, regionRecord => {
        return {
          country: regionRecord.name,
          count: regionRecord.totalCases
        };
      });

      let top10Woredas = _orderBy(
        woredaByTotalCases,
        ["count"],
        ["desc"]
      ).slice(0, 20);
      let top10WoredasLabels = _map(top10Woredas, "country");
      let top10WoredasCounts = _map(top10Woredas, "count");

      const chartdata = {
        series: [
          {
            name: "cases",
            data: top10WoredasCounts
          }
        ],
        labels: top10WoredasLabels
      };

      return chartdata;
    },

    getTotalByTravelSeries() {
      let patients = pmoPatients.results;
      let patientsWithTravelHistory = _reject(patients, [
        "recent_travel_to",
        "No Travel History"
      ]);
      let groupedPatients = _groupBy(
        patientsWithTravelHistory,
        "recent_travel_to"
      );
      let labels = Object.keys(groupedPatients);

      let countriesByTotal = _map(labels, label => {
        return {
          country: label,
          count: groupedPatients[label].length
        };
      });

      let top10Countries = _orderBy(
        countriesByTotal,
        ["count"],
        ["desc"]
      ).slice(0, 10);
      let top10CountriesLabels = _map(top10Countries, "country");
      let top10CountriesCounts = _map(top10Countries, "count");

      const chartdata = {
        series: [
          {
            name: this.$t("covid_stages.confirmed"),
            data: top10CountriesCounts
          }
        ],
        labels: top10CountriesLabels
      };

      // console.log("top 10 travel")
      // console.log(top10Countries)
      // console.log(top10CountriesLabels)
      // console.log(top10CountriesCounts)
      // console.log(chartData)

      return chartdata;
    },
    getTotalByRegionSeries() {
      const whatapigives = {
        confirmed: [4, 3, 3, 6, 17, 25, 6, 11, 34, 4, 24],
        recovored: [2, 1, 3, 3, 6, 19, 0, 1, 22, 1, 3],
        dead: [0, 0, 3, 1, 1, 4, 4, 1,1, 4, 14],
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
      var d = { series: [] };

      let patients = pmoPatients.results;
      let groupedHourlyRecords = createHourlyGroupedRecords(patients);
      let sortedGroupedHourlyRecords = sortRecordsByTime(groupedHourlyRecords);

      let last24hours = timeOneDay();
      let last24hoursOrdered = _orderBy(last24hours, hourStr => {
        return new moment(hourStr);
      }).reverse();

      var casesPerHour = [];
      _forEach(last24hoursOrdered, hour => {
        let matchingHourRecord = _find(sortedGroupedHourlyRecords, record => {
          return record.time === hour;
        });

        if (matchingHourRecord) {
          casesPerHour.push(matchingHourRecord.cases);
        } else {
          casesPerHour.push(0);
        }
      });

      var xAxisLabels = last24hours;
      xAxisLabels = _map(last24hours, hourIsoStr => {
        return moment(hourIsoStr).format("h:mmA");
      });

      const xaxis = {
        categories: xAxisLabels,
        title: {
          text: this.$t("calendar.hours")
        }
      };

      const series = [
        {
          name: this.$t("Cases"),
          data: casesPerHour
        }
      ];

      d = { series, xaxis, labels: xAxisLabels };
      return d;
    },

    getWeekStats() {
      let patients = pmoPatients.results;
      let groupedDailyRecords = createDailyGroupedRecords(patients);
      let sortedGroupedDailyRecords = sortRecordsByTime(groupedDailyRecords);

      const range = moment.range(
        moment()
          .startOf("day")
          .subtract(7, "day"),
        moment().startOf("day")
      );
      let lastWeek = Array.from(range.by("day"));
      let lastWeekOrdered = _orderBy(lastWeek, dayStr => {
        return new moment(dayStr);
      }).reverse();

      var casesPerDay = [];
      _forEach(lastWeek, day => {
        let matchingHourRecord = _find(sortedGroupedDailyRecords, record => {
          return record.time.slice(0, 10) === day.toISOString().slice(0, 10);
        });

        if (matchingHourRecord) {
          casesPerDay.push(matchingHourRecord.cases);
        } else {
          casesPerDay.push(0);
        }
      });

      let weekLabels = _map(lastWeek, day => {
        return day.format("M/DD");
      });

      return {
        yaxis: [
          {
            title: {
              text: "Cases"
            }
          }
        ],
        stroke: {
          width: [3, 3, 3, 0],
          dashArray: [0, 4, 0, 0]
        },
        labels: weekLabels,
        series: [
          {
            name: "Cases",
            type: "line",
            data: casesPerDay
          }
        ]
      };
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
      let patients = pmoPatients.results;
      let groupedMonthlyRecords = createMonthlyGroupedRecords(patients);
      let sortedGroupedMonthlyRecords = sortRecordsByTime(
        groupedMonthlyRecords
      );

      const range = moment.range(
        moment().startOf("year"),
        moment().endOf("year")
      );
      let lastYearMonths = Array.from(range.by("month"));
      let lastYearMonthsOrdered = _orderBy(lastYearMonths, dayStr => {
        return new moment(dayStr);
      }).reverse();

      var casesPerMonth = [];
      _forEach(lastYearMonths, day => {
        let matchingHourRecord = _find(sortedGroupedMonthlyRecords, record => {
          return record.time.slice(0, 7) === day.toISOString().slice(0, 7);
        });

        if (matchingHourRecord) {
          casesPerMonth.push(matchingHourRecord.cases);
        } else {
          casesPerMonth.push(0);
        }
      });

      let monthLabels = _map(lastYearMonths, day => {
        return day.format("MMM");
      });

      const series = [
        {
          name: this.$t("covid_stages.confirmed"),
          data: casesPerMonth
        }
      ];

      return {
        series,
        xaxis: {
          categories: monthLabels,
          title: {
            text: this.$t("calendar.month")
          }
        }
      };
    },

    getLast30DayStats() {
      let patients = pmoPatients.results;
      let groupedDailyRecords = createDailyGroupedRecords(patients);
      let sortedGroupedDailyRecords = sortRecordsByTime(groupedDailyRecords);

      const range = moment.range(
        moment()
          .startOf("day")
          .subtract(30, "day"),
        moment().startOf("day")
      );
      let lastMonth = Array.from(range.by("day"));
      let lastMonthOrdered = _orderBy(lastMonth, dayStr => {
        return new moment(dayStr);
      }).reverse();

      var casesPerDay = [];
      _forEach(lastMonth, day => {
        let matchingHourRecord = _find(sortedGroupedDailyRecords, record => {
          return record.time.slice(0, 10) === day.toISOString().slice(0, 10);
        });

        if (matchingHourRecord) {
          casesPerDay.push(matchingHourRecord.cases);
        } else {
          casesPerDay.push(0);
        }
      });

      let weekLabels = _map(lastMonth, day => {
        return day.format("M/DD");
      });

      return {
        yaxis: [
          {
            title: {
              text: "Cases"
            }
          }
        ],
        stroke: {
          width: [3, 3, 3, 0],
          dashArray: [0, 4, 0, 0]
        },
        labels: weekLabels,
        series: [
          {
            name: "Cases",
            type: "line",
            data: casesPerDay
          }
        ]
      };
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
    getHospitalizationStats() {
      let totalCaseObj = pmoCases[0];
      let total = totalCaseObj.confirmed;
      let totalHospitalized = totalCaseObj.stable + totalCaseObj.critical;

      let totalNonHospitalized = total - totalHospitalized;
      let totalIcu = totalCaseObj.critical;
      let totalNonIcu = totalCaseObj.stable;

      let dataset = [
        {
          backgroundColor: ["#41B883", "#E46651", "#ff8000"],
          data: [totalNonHospitalized, totalIcu, totalNonIcu]
        }
      ];

      this.hospitalizedPercentage = roundValue(totalIcu / total, 3) * 100;
      return dataset;
    },

    getIcuStats() {
      const all = this.findStatStore;
      if (all && all.data && all.data.length > 0) {
        // let totalIcu = all.data[0].total.data[4]
        // let totalNonIcu =  all.data[0].total.data[3] - all.data[0].total.data[4]
        // let total = totalIcu + totalNonIcu
        let totalCaseObj = pmoCases[0];
        let totalIcu = totalCaseObj.critical;
        let totalNonIcu = totalCaseObj.stable;
        let total = totalIcu + totalNonIcu;

        let dataset = [
          {
            backgroundColor: ["#41B883", "#E46651"],
            data: [totalNonIcu, totalIcu]
          }
        ];

        this.icuPercentage = roundValue(totalIcu / total, 3) * 100;
        return dataset;
      }
    },

    getFinalOutcomeStats() {
      let totalCaseObj = pmoCases[0];
      let totalRecovered = totalCaseObj.recovered;
      let totalDeceased = totalCaseObj.deceased;
      let total = totalDeceased + totalRecovered;

      let dataset = [
        {
          backgroundColor: ["#41B883", "#E46651"],
          data: [totalRecovered, totalDeceased]
        }
      ];

      let ratioDeceased = roundValue(totalDeceased / total, 3);
      let percentDeceased = roundValue(ratioDeceased, 2) * 100;

      return dataset;
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
    ...mapActions("auth", { getApiToken: "getApiToken" }),
    ...mapActions("communities", {
      getAllCommunities: "getAllCommunities",
      getCommunity: "getCommunity"
    }),
    ...mapActions("pmoStats", {
      getCases: "getCases",
      getPatients: "getPatients"
    }),
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
    },
    getRegionRecords() {
      this.regionRecords = [];
      let patients = pmoPatients.results;
      _forEach(this.administrativeZoneDataAll[0].features, data => {
        let regionRecord = createNewRegionRecord(data);
        regionRecord.totalCases = _filter(patients, patient => {
          return patient.location === regionRecord.adminRegion1Name;
        }).length;
        this.regionRecords.push(regionRecord);
      });
    }
  },
  async mounted() {
    this.getStats();
    // this.getRegionRecords();
    // this.getApiToken().then(() => {
    //   this.getAllCommunities().then(() => {
    //     // set up community related panels
    //     // get model by id
    //     // let record = this.getCommunity( { id: { id: "INSERT_ID_HERE" } } )
    //   });
    // });

    // this.getCases()
    // this.getPatients()
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,100;0,400;0,600;0,700;0,800;0,900;1,100&family=Barlow:wght@100;300;400;500;600;700;800;900&display=swap");
* {
    font-family: 'Barlow Semi Condensed', sans-serif;
    font-weight: 500;
}
.index__pie_chart_percentage_label {
  color: red;
  font-size: 16px;
  padding-left: 10px;
  line-height: 20px;
}
</style>

