export default {
  install(Vue, options) {
    Vue.transition('fade', {
      stagger(index) {
        return Math.min(300, index * 50)
      }
    })
  }
}
