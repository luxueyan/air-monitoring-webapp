<template lang="jade">
#chart(ref='chart')
  mt-navbar(v-model='tab', ref='navbar')
    mt-tab-item#1 负(氧)离子
    mt-tab-item#2 PM2.5
    mt-tab-item#3 温度
    mt-tab-item#4 湿度
  .filters(ref='filters')
    span 日期
    input(@click='openStartPicker()', :value="moment(model.userstartdatetime).format('YYYY年MM月DD日')", readonly)
    span 至
    input(@click='openEndPicker()', :value="moment(model.userenddatetime).format('YYYY年MM月DD日')", readonly)
    span 间隔
    select(v-model='model.timeinterval')
      option(v-for='item in timeIntervalList', :value='item.value') {{item.name}}
  mt-tab-container(v-model='tab', :swipeable='true', ref='tabContainer')
    mt-tab-container-item#1
      line-chart(:data='charts.fylz', :options='chart.options', :height='chart.height', :width='chart.width')
    mt-tab-container-item#2
      line-chart(:data='charts.pm25', :options='chart.options', :height='chart.height', :width='chart.width')
    mt-tab-container-item#3
      line-chart(:data='charts.wd', :options='chart.options', :height='chart.height', :width='chart.width')
    mt-tab-container-item#4
      line-chart(:data='charts.sd', :options='chart.options', :height='chart.height', :width='chart.width')
  mt-datetime-picker(ref='startPicker', v-model='model.userstartdatetime', type='date', year-format='{value} 年', month-format='{value} 月', date-format='{value} 日', @confirm='startPickerChange')
  mt-datetime-picker(ref='endPicker', v-model='model.userenddatetime', type='date', year-format='{value} 年', month-format='{value} 月', date-format='{value} 日', @confirm='endPickerChange')
</template>

<script>
import moment from 'moment'
import LineChart from '../components/line-chart.vue'
import commonMixins from './mixins.js'
import {
  chartData
} from '../common/resources.js'
import {
  Cell,
  Navbar,
  TabItem,
  TabContainer,
  TabContainerItem,
  DatetimePicker
} from 'mint-ui'
import {
  mapGetters
  // mapActions
} from 'vuex'
import _ from 'lodash'
import Event from '../classes/Event.js'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default {
  mixins: [commonMixins],
  components: {
    LineChart,
    mtCell: Cell,
    mtNavbar: Navbar,
    mtTabItem: TabItem,
    mtTabContainer: TabContainer,
    mtTabContainerItem: TabContainerItem,
    mtDatetimePicker: DatetimePicker
  },
  mounted() {
    // console.log(window.Chart)
    this.$refs.chart.style.height = (window.innerHeight - 45) + 'px'

    /*this.showLoading()
    let data = await sites.save({
      token: this.$parent.user.token
    }).then(res => res.json())
    this.hideLoading()

    if (data.issuccess) {
      this.pruneDirtyData(data)
      this.updateChart({
        arrareas: [data.sons[0].sons[0].sons[0].areacode],
        ...this.$route.query
      })
    } else {
      this.showToast({
        message: data.errormsg || '获取地图数据失败'
      })
    }*/

    let navbarH = this.$refs.navbar.$el.getBoundingClientRect().height
    let filtersH = this.$refs.filters.getBoundingClientRect().height

    this.chart.height = window.innerHeight - 45 - navbarH - filtersH
    this.$refs.tabContainer.$el.style.height = (window.innerHeight - 45 - navbarH - filtersH) + 'px'

    // 初始化chart
    let initChart = function() {
      if (this.$route.query.areacode) {
        this.model.arrareas = [this.$route.query.areacode]
        this.updateChart()

        // 扁平化所有点
        let sons = _.flattenDeep(_.map(this.data.sons, s1 => {
          return _.map(s1.sons, s2 => {
            return _.map(s2.sons, s3 => {
              s3.fullname = `${s1.areaname}-${s2.areaname}-${s3.areaname}`
              return s3
            })
          })
        }))

        let selectedSite = _.find(sons, v => {
          return v.areacode === this.$route.query.areacode
        })

        // 设置默认勾选项
        this.updateSelectedSites([selectedSite])
      } else {
        let defaultSite = this.data.sons[0].sons[0].sons[0]
        this.updateSelectedSites([defaultSite])
        this.model.arrareas = [defaultSite.areacode]
        this.updateChart()
      }
    }.bind(this)

    if (this.data.sons.length) {
      initChart()
    } else {
      Event.addEvent('chart.dataUpdate', (e) => {
        initChart()
      })
    }

    Event.addEvent('chart.siteSelected', (e) => {
      this.model.arrareas = _.map(e.data, 'areacode')
      this.updateChart()
    })
  },
  methods: {
    // ...mapActions(['updateSelectedSites']),
    moment,
    updateSelectedSites(selectedSites) {
      this.$parent.selectedSites = selectedSites
    },
    async updateChart(options = {}) {
      if (!options.arrareas && !this.model.arrareas.length) return // 如果无arrareas 则不加载数据

      this.$parent.showLoading()
      let model = _.cloneDeep(this.model)
      model.userstartdatetime = moment(model.userstartdatetime).format(DATE_FORMAT)
      model.userenddatetime = moment(model.userenddatetime).format(DATE_FORMAT)

      let data = await chartData.save({
        token: this.$parent.user.token,
        ...model,
        ...options
      }).then(res => res.json())

      if (data.issuccess) {
        this.datamodel = data.datamodel
        let chartColors = ['#87cefa', '#da70d6', '#32cd32', '#6495ed']

        _.each(data.datamodel[0].lines, (v, i) => {
          this.charts[v.linename] = {
            labels: _.map(v.points, 'x'), // 横轴
            datasets: _.map(data.datamodel, (s, si) => {
              return {
                borderWidth: 0,
                fill: false,
                borderColor: chartColors[si],
                backgroundColor: chartColors[si],
                label: s.areaname, // 系列名称
                data: _.map(s.lines[i].points, 'y') //数据
              }
            })
          }
        })
      } else {
        this.$parent.showToast({
          message: data.errormsg || '获取地图数据失败'
        })
      }
      this.$parent.hideLoading()
    },

    openStartPicker() {
      this.$refs.startPicker.open()
    },

    startPickerChange(date) {
      this.updateChart({
        userstartdatetime: moment(date).format(DATE_FORMAT)
      })
    },

    endPickerChange(date) {
      this.updateChart({
        userendatetime: moment(date).format(DATE_FORMAT)
      })
    }
  },

  watch: {
    'model.timeinterval' () {
      this.updateChart()
    }
  },

  computed: {
    ...mapGetters(['data'])
  },

  data() {
    return {
      chart: {
        options: {
          responsive: true,
          tooltips: {
            mode: 'x-axis'
              // intersect: false
          }
        },
        height: 500,
        width: window.innerWidth
      },
      model: {
        arrareas: [],
        arrusercheckeddevicetypes: ['fylz', 'pm25', 'wd', 'sd'],
        userstartdatetime: moment().subtract(1, 'months').format(DATE_FORMAT),
        userenddatetime: moment().format(DATE_FORMAT),
        timeinterval: 'day1'
      },
      tab: '1',
      timeIntervalList: [{
        value: 'minute1',
        name: '1分'
      }, {
        value: 'minute10',
        name: '10分'
      }, {
        value: 'hours1',
        name: '1小时'
      }, {
        value: 'day1',
        name: '1日'
      }, {
        value: 'week1',
        name: '1周'
      }, {
        value: 'months1',
        name: '1月'
      }, {
        value: 'year1',
        name: '1年'
      }],
      datamodel: [],
      charts: {
        fylz: {},
        pm25: {},
        wd: {},
        sd: {}
      }
      // chart: {
      //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      //   datasets: [{
      //     label: '',
      //     backgroundColor: '#f87979',
      //     data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
      //   }]
      // }
    }
  },

  beforeDestroy() {
    Event.removeEvent('chart.dataUpdate').removeEvent('chart.siteSelected')
  }
}
</script>

<style lang="scss">
#chart {
  background-color: #eff1f8;
  .mint-navbar {
    .mint-tab-item-label {
      font-size: 0.386473rem; //48px
    }
    .mint-tab-item.is-selected {
      border-bottom: 1px solid #45c7f4;
      color: #45c7f4;
      margin-bottom: 0;
    }
  }
  .mint-tab-container-wrap{
    height: 100%;
  }
  .mint-tab-container-item {
    height: 100%;
    background: white;
  }
  .filters {
    font-size: 0.322061rem; //40px
    display: flex;
    justify-content: center;
    align-items: center;
    height: 0.966184rem; //120px
    // line-height: 0.966184rem; //120px
    background-color: white;
    margin: 0.161031rem 0; //20px;
    // padding: 0 0.402576rem; //50px
    white-space: nowrap;
    text-align: center;
    span {
      margin: 0 5px;
    }
    select,
    input {
      border: 0;
      // display: inline-block;
      width: auto;
      // padding: 0 5px;
      border-radius: 5px;
      text-align: center;
      height: 1.5em;
      background-color: #e5e7ea;
    }
    input {
      width: 9em;
    }
  }
}
</style>
