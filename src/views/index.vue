<template lang="jade">
  #map(ref='map')
</template>

<script>
// import {
//   sites
// } from '../common/resources.js'
import _ from 'lodash'
import commonMixins from './mixins.js'
import Event from '../classes/Event.js'
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  mixins: [commonMixins],
  components: {

  },
  async mounted() {
    this.$refs.map.style.height = (window.innerHeight - 45) + 'px'
      /*this.$parent.showLoading()

      let data = await sites.save({
        token: this.$parent.user.token
      }).then(res => {
        return this.loadBaiduMap(res.json())
      })

      if (data.issuccess) {
        this.data = this.pruneDirtyData(data)
        this.initMap()
        this.updateData(data)
      } else {
        this.$parent.showToast({
          message: data.errormsg || '获取地图数据失败'
        })
      }

      this.$parent.hideLoading()*/

    // 定位用户选择的节点
    Event.addEvent('index.siteSelected', e => {
      let d = e.data[0]
      let p = new window.BMap.Point(d.jd, d.wd)
      this.map.centerAndZoom(p, 11)
    })

    Event.addEvent('index.dataUpdate', e => {
      this.baiduMapPromise.then(() => {
        this.addMarkers()
      })
    })

    this.updateSelectedSites([]) // 清空位置选择状态

    this.baiduMapPromise = this.loadBaiduMap().then(() => {
      this.initMap()
    })
  },
  methods: {
    ...mapActions(['updateData']),
    // 异步加载地图
    updateSelectedSites(selectedSites) {
      this.$parent.selectedSites = selectedSites
    },
    loadBaiduMap(data) {
      return new Promise((resolve, reject) => {
        if (Window.BMap) {
          resolve(data)
        } else {
          let t = window.BMap_loadScriptTime = (new Date()).getTime()
          let ak = '9GAFRCIPZxujQefnQYeutyAcK0U6x7Q0'
          let script = document.createElement('script')
          script.type = 'text/javascript'
          script.src = `http://api.map.baidu.com/getscript?v=2.0&ak=${ak}&services=&t=${t}`
          document.body.appendChild(script)

          script.onload = function() {
            resolve(data)
          }
        }
      })
    },
    // 初始化地图
    initMap() {
      let BMap = window.BMap
      let geoCtrl = new BMap.GeolocationControl()
      let map = this.map = new BMap.Map('map')

      geoCtrl.addEventListener('locationSuccess', (e) => {
        map.centerAndZoom(e.point, 11)
      })

      geoCtrl.location() // 获取位置

      // 可缩放 拖拽
      map.enableScrollWheelZoom(true)
      map.enableDragging()

      // 左上角，添加比例尺 定位
      map.addControl(new BMap.NavigationControl())
      map.addControl(geoCtrl)
        // map.addControl(new BMap.ScaleControl({
        //   anchor: window.BMAP_ANCHOR_BOTTOM_LEFT
        // }))

      // 创建标注
      this.addMarkers()
    },

    // 创建标注
    addMarkers() {
      let BMap = window.BMap
      let icon = require('../assets/images/location-small.png')
      let myIcon = new BMap.Icon(icon, new BMap.Size(62, 80))
      myIcon.setImageSize(new BMap.Size(31, 40))

      // 扁平化所有点
      let markers = _.flattenDeep(_.map(this.data.sons, s1 => {
        return _.map(s1.sons, s2 => {
          return _.map(s2.sons, s3 => {
            s3.fullname = `${s1.areaname}-${s2.areaname}-${s3.areaname}`
            return s3
          })
        })
      }))

      _.each(markers, m => {
        let pt = new BMap.Point(m.jd, m.wd)
        let label = new BMap.Label(m.fullname, {
          offset: new BMap.Size(30, -10)
        })
        label.setStyle({
          color: '#4fc1e9',
          borderWidth: '0px'
        })

        let marker = new BMap.Marker(pt, {
          icon: myIcon
        })
        marker.setLabel(label)
        marker.addEventListener('click', e => {
          this.$router.push({
            name: 'chart',
            query: {
              areacode: m.areacode
            }
          })
        })

        this.map.addOverlay(marker)
      })
    }
  },

  computed: {
    ...mapGetters(['data'])
  },

  data() {
    return {
      map: null
    }
  },

  beforeDestroy() {
    Event.removeEvent('index.dataUpdate').removeEvent('index.siteSelected')
  }
}
</script>

<style lang="scss" scoped>
#map {
  height: 100%;
}
</style>
