import Vue from 'vue'
import _ from 'lodash'
import store from '../vuex/store.js'
import Indicator from 'mint-ui'
const CACHE_URLS = ['GetAreaAndStationList.ashx', 'GetOneStation.ashx', 'GetLineDatas.ashx']

export default [
  function(request, next) {
    let timeout
    if (request._timeout) {
      timeout = setTimeout(() => {
        if (request.onTimeout) request.onTimeout(request)
        request.abort()
      }, request._timeout)
    }

    next(res => {
      clearTimeout(timeout)
    })
  },
  function(request, next) {
    let key = Vue.url(request.url, request.body)

    request.cache = _.includes(CACHE_URLS, key.split('?')[0])

    if (!request.params.no_cache && sessionStorage.getItem(key)) {
      next({
        status: 200,
        ok: true,
        headers: {},
        statusText: 'OK',
        data: sessionStorage.getItem(key) || '{}',
        body: sessionStorage.getItem(key) || '{}',
        json() {
          return Promise.resolve(JSON.parse(sessionStorage.getItem(key) || '{}'))
        }
      })
    } else {
      next()
    }
  },
  function(request, next) {
    next((res) => {
      if (res.status !== 200) {
        Indicator.close()
        console.error('服务器出错了!')
      } else if (res.status === 200) {
        res.json().then(data => {
          if (!data.issuccess && data.errormsg.indexOf('token') > -1) {
            store.dispatch('logout', {})
          } else if (data.issuccess && request.cache) {
            let key = Vue.url(request.url, request.params) + '?' + request.body
            let body = _.isObject(data) ? JSON.stringify(data) : data
            sessionStorage.setItem(key, body)
          }
        })
      }
    })
  }
]
