import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import App from './app.vue'
import store from './vuex/store.js'

Vue.use(VueRouter)

let router = new VueRouter({
  mode: 'history',
  base: __dirname,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (!(from.path.indexOf('/about') > -1 && to.path.indexOf('/about') > -1)) { // 非关于页面间的跳转
      return { x: 0, y: 0 }
    }
  },
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title || document.title
  document.body.setAttribute('page', to.name)

  // hack ios title not update bug
  /*let iframe = document.createElement('iframe')
  iframe.classList.add('dn')
  iframe.src = require('./assets/logo.png')
  document.body.appendChild(iframe)
  iframe.onload = () => {
    setTimeout(() => {
      iframe.onload = null
      document.body.removeChild(iframe)
    }, 10)
  }*/
})

router.beforeEach((to, from, next) => {
  let user = JSON.parse(window.localStorage.user || '{}')

  if (to.meta.needLogin && !user.token) {
    next({ name: 'login' })
  }
  next()
})

export default {
  run() {
    new Vue({
      router,
      store,
      template: '<router-view></router-view>',
      components: {
        App
      }
    }).$mount('#app')
  }
}

export { router }
