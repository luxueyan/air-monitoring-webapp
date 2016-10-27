import moment from 'moment'

export default {
  install(Vue, options) {
    Vue.filter('date', (date, format) => {
      return moment(date).format(format)
    })
  }
}
