<template lang="jade">
#map(ref='map')
</template>

<script>
import {
  sites
} from '../common/resources.js'

export default {
  components: {

  },
  async mounted() {
    this.$refs.map.style.height = (window.innerHeight - 40) + 'px'

    let data = await sites.save({
      token: this.$parent.user.token
    }).then(res => {
      return this.loadBaiduMap(res.json())
    })

    if (data.issuccess) {
      this.initMap(data)
    } else {
      this.showToast({
        message: data.errormsg || '获取地图数据失败'
      })
    }

    // this.loadBaiduMap().then(() => {
    //   this.initMap()
    // })
  },
  methods: {
    // 异步加载地图
    loadBaiduMap(data) {
      return new Promise((resolve, reject) => {
        let t = window.BMap_loadScriptTime = (new Date()).getTime()
        let ak = '9GAFRCIPZxujQefnQYeutyAcK0U6x7Q0'
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `http://api.map.baidu.com/getscript?v=2.0&ak=${ak}&services=&t=${t}`
        document.body.appendChild(script)

        script.onload = function() {
          resolve(data)
        }
      })
    },
    // 初始化地图
    initMap() {
      let BMap = window.BMap
      let geoCtrl = new BMap.GeolocationControl()
      let map = new BMap.Map('map')

      geoCtrl.addEventListener('locationSuccess', (e) => {
        map.centerAndZoom(e.point, 12)
      })

      geoCtrl.location()

      // 可缩放 拖拽
      map.enableScrollWheelZoom(true)
      map.enableDragging()

      // 左上角，添加比例尺 定位
      map.addControl(new BMap.NavigationControl())
      map.addControl(geoCtrl)
      map.addControl(new BMap.ScaleControl({
        anchor: window.BMAP_ANCHOR_BOTTOM_LEFT
      }))

      //创建小狐狸
      let pt = new BMap.Point(116.417, 39.909)
      let myIcon = new BMap.Icon(require('../assets/images/location-small.png'), new BMap.Size(62, 80))
      myIcon.setImageSize(new BMap.Size(31, 40))

      // 创建标注
      let marker = new BMap.Marker(pt, {
        icon: myIcon
      })

      map.addOverlay(marker)
    }
  }
}
</script>

<style lang="scss" scoped>
#map {
  height: 100%;
}
</style>
