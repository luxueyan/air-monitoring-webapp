<template lang="jade">
.main
  mt-header(:title='$route.meta.title' fixed, v-if='$route.name !== "login" ')
    .left(slot='left')
      i.icon-air.icon-menu(@click='toggleLeftMenu()')
    .right(slot='right')
      i.icon-air.icon-site(v-show='$route.meta.hasRightMenu', @click='toggleRightMenu()')
  .mask(v-show='leftMenuVisible || rightMenuVisible', @click='hideMenu()')
  aside.left(ref='leftMenu', :class='{open: leftMenuVisible}', @click='hideMenu()')
    .avator
      i.icon-air.icon-info
      span.username {{user.username}}
      button.logout(@click.stop='logout()') 退出登录
    nav
      router-link(:to='{name: "station"}', @click.stop='') 我的监测站
        i.icon-air.icon-arrow-right
      router-link(:to='{name: "index"}', @click.stop='') 地图选站
        i.icon-air.icon-arrow-right
      router-link(:to='{name: "chart"}', @click.stop='') 数据曲线分析
        i.icon-air.icon-arrow-right
  aside.right(ref='rightMenu', :class='{open: rightMenuVisible}', @click='hideMenu()')
    .right-head
      .icons
        .icon-air.icon-arrow-left
      .confirm(@click.stop='confirmSite()') 确定
    .right-body(ref='rightBody')
      ul.s1-menu
        li(v-for='s1 in sons')
          .name
            i.icon-air.icon-site
            | {{s1.areaname}}
          ul.s2-menu
            li(v-for='s2 in s1.sons')
              .name {{s2.areaname}}
              .items
                .checkbox(v-for='s3 in s2.sons', @click.stop='')
                  input(type='checkbox', v-model='selectedSites', :value='s3', :name='"site-"+s3.areacode', :id='"site-"+s3.areacode')
                  label.item(:for='"site-"+s3.areacode') {{s3.areaname}}
                    i.icon-air.icon-ok

  router-view
</template>

<script>
import {
  sites
} from './common/resources.js'
import {
  Header
} from 'mint-ui'
import {
  mapGetters,
  mapActions
} from 'vuex'
import commonMixins from './views/mixins.js'
import Event from './classes/Event.js'
import Hammer from 'hammerjs'

export default {
  mixins: [commonMixins],
  components: {
    mtHeader: Header
  },

  async mounted() {
    this.$refs.rightBody.style.height = (window.innerHeight - 45) + 'px'
    this.showLoading()

    let data = await sites.save({
      token: this.user.token
    }).then(res => res.json())

    if (data.issuccess) {
      this.pruneDirtyData(data)
      this.sons = data.sons
      this.updateData(data)
      Event.fireEvent('dataUpdate', data)
    } else {
      this.showToast({
        message: data.errormsg || '获取地图数据失败'
      })
    }
    this.hideLoading()

    // hammer
    let leftMenuMc = new Hammer.Manager(this.$refs.leftMenu, {
      recognizers: [
        [Hammer.Swipe, {
          direction: Hammer.DIRECTION_LEFT
        }]
      ]
    })

    let rightMenuMc = new Hammer.Manager(this.$refs.rightMenu, {
      recognizers: [
        [Hammer.Swipe, {
          direction: Hammer.DIRECTION_RIGHT
        }]
      ]
    })

    leftMenuMc.on('swipeleft', e => {
      this.leftMenuVisible = false
    })

    rightMenuMc.on('swiperight', e => {
      this.rightMenuVisible = false
    })
  },

  watch: {
    $route() {
      this.leftMenuVisible = false
      this.rightMenuVisible = false
    },
    'selectedSites' () {
      if (this.$route.name === 'index' && this.selectedSites.length > 1) {
        this.selectedSites.shift()
      } else if (this.$route.name === 'chart' && this.selectedSites.length > 3) {
        this.selectedSites.shift()
        this.showToast({
          message: '最多选择三个'
        })
      }
    },
    'rightMenuVisible' () {
      if (this.rightMenuVisible) {
        Event.fireEvent('rightMenuOpen')
      }
    }
  },

  methods: {
    ...mapActions(['updateUser', 'logout', 'updateData']),

    toggleLeftMenu() {
      this.leftMenuVisible = !this.leftMenuVisible
    },

    toggleRightMenu() {
      this.rightMenuVisible = !this.rightMenuVisible
    },

    hideMenu() {
      this.leftMenuVisible = false
      this.rightMenuVisible = false
    },

    confirmSite() {
      if (this.$route.name === 'index') {
        Event.fireEvent('index.siteSelected', this.selectedSites)
      } else if (this.$route.name === 'chart') {
        Event.fireEvent('chart.siteSelected', this.selectedSites)
      }
      this.rightMenuVisible = false
    }
  },

  computed: {
    ...mapGetters(['user'])
  },

  data() {
    return {
      selectedSites: [],
      sons: [],
      leftMenuVisible: false,
      rightMenuVisible: false
    }
  }
}
</script>

<style lang="scss">
@import '~normalize.css';
@import './assets/scss/base.scss';
@import './assets/scss/common.scss';
@import './assets/scss/layout.scss';
@import './assets/scss/form.scss';
@import './assets/scss/animation.scss';
@import './assets/scss/transition.scss';
@import './assets/fonts/style.css';
.main {
  font-size: 0.354267rem; //44px
  padding-top: 45px;
  .mint-header {
    background-color: #45c7f4;
    height: 45px;
    font-size: 0.354267rem;
    line-height: 45px;
    font-weight: bolder;
    .icon-menu {
      padding: 15px 15px 15px 0;
    }
    .icon-site {
      padding: 15px 0 15px 15px;
    }
  }
}

.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .1);
  z-index: 9;
}

aside {
  padding-top: 0.402576rem; //50px
  position: fixed;
  width: 50%;
  top: 0;
  bottom: 0;
  z-index: 19;
  transition: transform .3s ease;
  color: white;
  &.left {
    left: 0;
    transform: translateX(-100%);
    background: #4fc1e9;
    .avator {
      padding: 0.322061rem; // 40px
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .icon-info {
      font-size: 1.288245rem;
      margin: 0.161031rem 0;
    }
    .username {
      margin: 0.161031rem 0;
    }
    .logout {
      height: 0.724638rem; //90px
      line-height: 0.724638rem; //90px
      width: auto;
      padding: 0 1em;
      background: white;
      color: #4fc1e9;
      &:active {
        background: darken(white, 10%);
      }
    }
    nav {
      margin-top: 0.402576rem; //50px
      padding: 0.322061rem; //40px
      a {
        display: block;
        height: 0.805153rem; //100px
        line-height: 0.805153rem; //100px
        color: white;
        border-bottom: 1px solid white;
        position: relative;
        &:active,
        &.router-link-active {
          color: #f5c942;
        }
      }
      .icon-air {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        font-size: 0.241546rem;
      }
    }
  }
  &.right {
    width: 60%;
    padding: 0 0.322061rem; //40px
    right: 0;
    transform: translateX(100%);
    background: #f8f9fb;
    color: #727171;
    height: 100%;
    .right-head {
      height: 45px;
      line-height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #c9caca;
      .confirm {
        flex: 1;
        text-align: right;
        color: #45c7f4;
      }
      .icons {
        flex: 1;
        text-align: left;
      }
    }
    .right-body {
      -webkit-overflow-scrolling: touch;
      overflow-y: scroll;
    }
    .s1-menu {
      li {
        line-height: 0.805153rem;
        border-bottom: 1px solid #c9caca;
        &:last-of-type {
          border: 0;
        }
      }
    }
    .s2-menu {
      padding-left: 0.362319rem; //45px
      .items {
        padding-left: 0.362319rem; //45px
        overflow: hidden;
      }
      .checkbox {
        float: left;
        line-height: 1em;
        margin-right: 10px;
        margin-bottom: 0.241546rem; //30px
      }
      input[type="checkbox"]:checked + .item {
        border: 1px solid #45c7f4;
        .icon-ok {
          display: block;
        }
      }
      .item {
        border-radius: 3px;
        border: 1px solid #c9caca;
        padding: 5px 20px;
        position: relative;
        overflow: hidden;
        display: inline-block;
        .icon-ok {
          display: none;
          background: #45c7f4;
          padding: 10px 10px 10px 0;
          color: white;
          font-size: 10px;
          position: absolute;
          transform: rotate(45deg);
          right: -8px;
          bottom: -14px;
          &:before {
            transform: rotate(-45deg);
            display: inline-block;
          }
        }
      }
    }
  }
  &.open {
    transform: translateX(0);
  }
}
</style>
