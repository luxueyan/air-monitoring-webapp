import _ from 'lodash'

let Event = {
  _listeners: {},
  // 添加
  addEvent(type, fn) {
    if (typeof this._listeners[type] === 'undefined') {
      this._listeners[type] = []
    }
    if (typeof fn === 'function') {
      this._listeners[type].push(fn)
    }
    return this
  },
  // 触发
  fireEvent(type, data) {
    _.each(this._listeners, (v, k) => {
      if (_.includes(k.split('.'), type) || k === type) {
        let arrayEvent = v
        if (arrayEvent instanceof Array) {
          for (let i = 0, length = arrayEvent.length; i < length; i += 1) {
            if (typeof arrayEvent[i] === 'function') {
              arrayEvent[i]({ type: type, data: data })
            }
          }
        }
      }
    })

    return this
  },
  // 删除
  removeEvent(type, fn) {
    let arrayEvent = this._listeners[type]
    if (typeof type === 'string' && arrayEvent instanceof Array) {
      if (typeof fn === 'function') {
        // 清除当前type类型事件下对应fn方法
        for (let i = 0, length = arrayEvent.length; i < length; i += 1) {
          if (arrayEvent[i] === fn) {
            this._listeners[type].splice(i, 1)
            break
          }
        }
      } else {
        // 如果仅仅参数type, 或参数fn邪魔外道，则所有type类型事件清除
        delete this._listeners[type]
      }
    }
    return this
  }
}

export default Event
