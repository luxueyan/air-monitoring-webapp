<template lang="jade">
#station(ref='station')
  swiper(:options='swiperOptions' ref='swiper')
    swiper-slide(v-for='s1 in data.sons')
      .head
        h2 {{s1.areaname}}
        .date {{moment(s1.nowdatetime).format('YYYY年M月D日 HH:mm')}}
        .quality(:class='getQualityLevel(s1)') {{getQuality(s1)}}
        p 空气质量

    .swiper-button-prev(slot='button-prev')
    .swiper-button-next(slot='button-next')
  .detail(v-if='activeS1')
    .cell(v-for='s2 in activeS1.sons', @click='toggleOpen(s2)', :class='{open: s2.cellOpen}')
      .title
        .left
          i.icon-air.icon-site.va-m.mr5
          span {{s2.areaname}}
        .right
          i.icon-air.icon-arrow-right
      //- .sub-cell(v-if='s2.sons && !s2.sons.length', v-show='s2.cellOpen')
      //-   .title 无数据
      .sub-cell(v-for='(s3, s3i) in s2.sons', v-show='s2.cellOpen', :class='"index" + s3i')
        .title
          {{s3.areaname}}
        .quality-detail
          .item
            .left 负(氧)离子：
            .mid
              mt-progress(:value='getProgess(s3.nowfylz, 5000)', :bar-height='10')
            .right
              span {{s3.nowfylz}}个/cm
                sup 3
          .item
            .left PM2.5：
            .mid
              mt-progress(:value='getProgess(s3.nowpm25, 500)', :bar-height='10')
            .right
              span {{s3.nowpm25}}ug/cm
                sup 3
          .item
            .left 温度：
            .mid
              mt-progress(:value='s3.nowwd*2', :bar-height='10')
            .right
              span {{s3.nowwd}}°C
          .item
            .left 湿度：
            .mid
              mt-progress(:value='s3.nowsd', :bar-height='10')
            .right
              span {{s3.nowsd}}%
</template>

<script>
import {
  Progress
} from 'mint-ui'
// import {
//   sites
// } from '../common/resources.js'
import {
  swiper,
  swiperSlide
} from 'vue-awesome-swiper'
import {
  mapActions,
  mapGetters
} from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import commonMixins from './mixins.js'

export default {
  mixins: [commonMixins],
  components: {
    mtProgress: Progress,
    swiper,
    swiperSlide
  },

  async mounted() {
    this.$refs.station.style.height = (window.innerHeight - 45) + 'px'
      /*this.$parent.showLoading()

      let data = await sites.save({
        token: this.$parent.user.token
      }).then(res => res.json())

      if (data.issuccess) {
        this.pruneDirtyData(data)
        this.sons = data.sons
        this.activeS1 = data.sons[0]
        this.updateData(data.sons)
      } else {
        this.$parent.showToast({
          message: data.errormsg || '获取地图数据失败'
        })
      }
      this.$parent.hideLoading()*/
  },

  methods: {
    ...mapActions(['updateData']),
    moment,
    getProgess(value, max) {
      if (value > max) return 100
      return _.round(value / max * 100)
    },

    toggleOpen(s2) {
      s2.cellOpen = !s2.cellOpen
    },

    getQuality(s1) {
      let child = s1.sons[0].sons[0] || {}
      let grade = [-1, 99.9, 299.9, 499.9, 1199.9, 2999.9]
      let gradeText = ['差', '低', '偏低', '中', '良', '优']
      return gradeText[_.sortedIndex(grade, child.nowfylz) - 1]
    },

    getQualityLevel(s1) {
      let child = s1.sons[0].sons[0] || {}
      let grade = [-1, 99.9, 299.9, 499.9, 1199.9, 2999.9]
      let gradeText = ['l6', 'l5', 'l4', 'l3', 'l2', 'l1']
      return gradeText[_.sortedIndex(grade, child.nowfylz) - 1]
    }
  },

  computed: {
    ...mapGetters(['data']),
    activeS1() {
      return this.data.sons[this.activeSlideIndex]
    }
  },

  data() {
    return {
      activeSlideIndex: 0,
      swiperOptions: {
        name: 'swiper',
        slidesPerView: 1,
        spaceBetween: 0,
        onSlideChangeEnd: function(swiper) {
          this.$refs.station.scrollTop = 0
          this.activeSlideIndex = swiper.activeIndex
        }.bind(this),
        // autoHeight: true,
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next'
      }
    }
  }
}
</script>

<style lang="scss">
#station {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  height: 100%;
  background: linear-gradient(to right, #8e9cb9, #c5c5cf);
  color: white;
  .mt-progress-progress {
    background: #4fc1e9;
  }
  .head {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  h2 {
    font-size: 0.966184rem; //120px
    margin: 0.322061rem 0; //40px
  }
  .quality {
    margin: 0.322061rem 0; //40px
    font-size: 0.966184rem; //120px
    width: 2.57649rem;
    height: 2.57649rem; //300px
    line-height: 2.57649rem; //300px
    border-radius: 50%;
    border: 0.563607rem solid #e64c65; //70px
    &.l1 {
      border-color: #3ce63c;
    }
    &.l2 {
      border-color: #4fc1e9;
    }
    &.l3 {
      border-color: rgb(210, 197, 26);
    }
    &.l4 {
      border-color: darken(red, 10%);
    }
    &.l5 {
      border-color: darken(red, 20%);
    }
    &.l6 {
      border-color: darken(red, 30%);
    }
  }
  .detail {
    margin: 0.322061rem 0;
  }
  .quality-detail {
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.5em;
    }
    .mid {
      flex: 1;
    }
    .left {
      text-align: right;
      width: 7em;
    }
    .right {
      padding-left: 5px;
      text-align: left;
      width: 7em;
    }
  }
  .swiper-button-prev {
    height: 0.805153rem; //60px
    top: 4.669887rem;
    background: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'><path d='M0,22L22,0l2.1,2.1L4.2,22l19.9,19.9L22,44L0,22L0,22L0,22z' fill='#ffffff'/></svg>") no-repeat;
    background-size: contain;
    background-position: center;
  }
  .swiper-button-next {
    height: 0.805153rem; //60px
    top: 4.669887rem;
    background: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'><path d='M27,22L27,22L5,44l-2.1-2.1L22.8,22L2.9,2.1L5,0L27,22L27,22z' fill='#ffffff'/></svg>") no-repeat;
    background-size: contain;
    background-position: center;
  }
}
</style>
