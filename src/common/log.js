import { log } from './resources'
import Utils from './utils'

export default function(logObj) {
  let params = {
    anchor: Utils.toQueryString(logObj)
  }

  return log.get(params)
}
