<script>
import { Bubble } from "vue-chartjs";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  extends: Bubble,
  props: {
    // chartdata: {
    //   type: Object,
    //   default: null
    // },
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.renderChart(this.getAllCases?.data);
  },
  methods: {
    // Query for past appointments
    queryPast(last28d, last7d, last24h) {
      const DAY_MS = 24 * 60 * 60 * 1000;

      return last28d
        ? { date: { $lt: new Date() - DAY_MS * 28 } }
        : last7d
        ? { date: { $lt: new Date() - DAY_MS * 7 } }
        : last24h
        ? { date: { $lt: new Date() - DAY_MS } }
        : {};
    },

    parseData(d) {
      const labels = [];
      const values = [];
    }
  },
  computed: {
    ...mapState("cases", { isLoading: "isFindPending" }),
    ...mapGetters("cases", { findCases: "find" }),
    // Query for future appointments
    getAllCases() {
      return this.findCases(this.queryPast(false, false, false));
    },

    getLast28d() {
      return this.findCases(this.queryPast(true, false, false));
    },

    getLast7d() {
      return this.findCases(this.queryPast(false, true, false));
    },

    getLast24h() {
      return this.findCases(this.queryPast(false, false, true));
    }
  }
};
</script>
