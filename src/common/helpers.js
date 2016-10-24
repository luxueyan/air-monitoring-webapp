import _ from 'lodash'

export function pruneParams(params, visible) {
  var newParams = _.cloneDeep(params)
  _.each(newParams, (v, i) => {
    if (newParams[i] === '' || _.isNull(newParams[i]) || (_.isPlainObject(visible) && visible[i] === false)) {
      delete newParams[i]
    }
  })
  return newParams
}
