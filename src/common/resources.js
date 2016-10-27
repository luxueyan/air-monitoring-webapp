// import Vue from 'vue'

let login, sites, register, checkUser, siteDetail, chartData

// let previousRequestMap = {}
let commonOpts = {
  /*before(request) {
    let key = Vue.url(request.url, request.body)

    if (previousRequestMap[key]) {
      previousRequestMap[key].abort()
    }

    previousRequestMap[key] = request
  },*/
  emulateJSON: true
}

export default function setResources(resource) {
  login = resource('Login.ashx', {}, {}, commonOpts)
  register = resource('AddUser.ashx', {}, {}, commonOpts) // 添加账户
  checkUser = resource('CheckUserNameExist.ashx', {}, {}, commonOpts) // 检查用户
  sites = resource('GetAreaAndStationList.ashx', {}, {}, commonOpts) // 站点列表
  siteDetail = resource('GetOneStation.ashx', {}, {}, commonOpts) // 单个站点数据
  chartData = resource('GetLineDatas.ashx', {}, {}, commonOpts) // 图表数据
}

export {
  login,
  register,
  checkUser,
  sites,
  siteDetail,
  chartData
}
