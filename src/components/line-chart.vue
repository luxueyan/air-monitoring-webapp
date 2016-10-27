<script>
import {
  Line
} from 'vue-chartjs'
import _ from 'lodash'

export default Line.extend({
  props: ['data', 'options'],
  methods: {
    destroy() {
      this._chart && this._chart.destroy()
    }
  },
  watch: {
    'data' () {
      if (_.isEmpty(this.data)) return
      this.destroy()
      this.renderChart(this.data, this.options)
    }
  }
})
</script>
