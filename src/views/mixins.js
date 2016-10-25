import _ from 'lodash'

export default {
  methods: {
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
