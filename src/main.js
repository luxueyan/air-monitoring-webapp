import router from './router'
import Pollyfill from './common/pollyfill'
import setResources from './common/resources'
import interceptors from './common/interceptors'
import VueResource from 'vue-resource'
import Vue from 'vue'
import Directories from './common/directives.js'

Vue.use(VueResource)
Vue.use(Directories)

// http初始化
Vue.http.options.root = '/DCXXService'
Vue.http.headers.common['Authorization'] = window.localStorage.token || ''

// 拦截器统一注入
interceptors.forEach((v) => {
  Vue.http.interceptors.push(v)
})

// 统一管理resource
setResources(Vue.resource)

Pollyfill.setup()

// 激活ios设备上面css的active效果
document.body.addEventListener('touchstart', () => {})

// 启动路由
router.run()
