import _ from 'lodash'
import Utils from '../common/utils.js'
import {
  Toast,
  Indicator
} from 'mint-ui'

export default {
  methods: {
    showLoading(opt = {}) {
      Indicator.open(opt)
    },

    hideLoading() {
      Indicator.close()
    },

    showToast(opt) {
      Toast({
        duration: Utils.getReadTime(opt.message),
        ...opt
      })
    },
    pruneDirtyData(data) {
      _.each(data.sons, s1 => {
        _.remove(s1.sons, s2 => {
          s2.cellOpen = false
          return !s2.sons || !s2.sons.length
        })
      })

      _.remove(data.sons, s1 => {
        return !s1.sons || !s1.sons.length
      })

      return data
    }
  }
}
