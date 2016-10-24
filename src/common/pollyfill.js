export default {
  setup: function() { // 写成function 否则格式化代码有问题
    this._startWidth()
    this._requestAnimation()
  },

  _startWidth() {
    if (!String.prototype.startsWith) {
      /*eslint no-extend-native: ["error", { "exceptions": ["String"] }]*/
      String.prototype.startsWith = function(searchString, position) { // 不能用箭头函数，注意this指针的问题
        position = position || 0
        return this.substr(position, searchString.length) === searchString
      }
    }
  },

  _requestAnimation() {
    let lastTime = 0
    let vendors = ['ms', 'moz', 'webkit', 'o']

    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        let currTime = new Date().getTime()
        let timeToCall = Math.max(0, 16 - (currTime - lastTime))
        let id = window.setTimeout(function() { callback(currTime + timeToCall) },
          timeToCall)
        lastTime = currTime + timeToCall
        return id
      }
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id)
      }
    }
  }
}
