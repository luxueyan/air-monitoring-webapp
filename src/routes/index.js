export default [{
  name: 'app',
  path: '/app',
  redirect: 'app/index',
  component: resolve => require(['../app.vue'], resolve),
  children: [{
    path: 'index',
    name: 'index',
    component: resolve => require(['../views/index.vue'], resolve),
    meta: {
      title: '地图选站',
      needLogin: true,
      hasRightMenu: true
    }
  }, {
    path: 'station',
    name: 'station',
    component: resolve => require(['../views/station.vue'], resolve),
    meta: {
      title: '我的监测站',
      needLogin: true
    }
  }, {
    path: 'chart',
    name: 'chart',
    component: resolve => require(['../views/chart.vue'], resolve),
    meta: {
      title: '数据曲线分析',
      needLogin: true,
      hasRightMenu: true
    }
  }]
}, {
  path: 'login',
  name: 'login',
  component: resolve => require(['../views/login.vue'], resolve),
  meta: {
    title: '登录',
    needLogin: false
  }
}, {
  path: '*',
  redirect: 'app/index'
}]
