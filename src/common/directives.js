export default {
  install: function(Vue, options) {
    Vue.directive('touch-stop', {
      bind(el) {
        el.addEventListener('touchstart', e => {
          e.preventDefault()
          return false
        })
      },
      unbind(el) {
        el.removeEventListener('touchstart')
      }
    })
  }
}
