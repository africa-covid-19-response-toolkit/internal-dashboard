<script>
import { Pie } from "vue-chartjs";
import 'chartjs-plugin-style';

export default {
  extends: Pie,
  props: ['labels', 'datasets'],
  mounted () {
    this.renderChart({
      labels: this.labels,
      datasets: this.datasets,
    }, {
      cutoutPercentage: 60, 
      responsive: true, 
      maintainAspectRatio: false, 
      })
  }
}
</script>