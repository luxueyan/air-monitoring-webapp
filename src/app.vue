<template lang="jade">
.main
  mt-header(:title='$route.meta.title' fixed, v-if='$route.name !== "login" ')
    .left(slot='left')
      i.icon-air.icon-menu(@click='toggleMenu()')
    .right(slot='right')
      i.icon-air.icon-site
  .mask(v-show='menuVisible', @click='hideMenu()')
  aside(:class='{open: menuVisible}', @click='hideMenu()')
    .avator
      i.icon-air.icon-info
      span.username {{user.username}}
      button.logout(@click.stop='logout()') 退出登录
    nav
      router-link(to='/station', @click.stop='') 我的监测站
        i.icon-air.icon-arrow-right
      router-link(to='/index', @click.stop='') 地图选站
        i.icon-air.icon-arrow-right
      router-link(to='/chart', @click.stop='') 数据曲线分析
        i.icon-air.icon-arrow-right
  router-view
</template>

<script>
import {
  Toast,
  Indicator,
  Header
} from 'mint-ui'
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  components: {
    mtHeader: Header
  },
  watch: {
    $route() {
      this.menuVisible = false
    }
  },
  methods: {
    ...mapActions(['updateUser', 'logout']),
    showLoading(opt = {}) {
      Indicator.open(opt)
    },
    hideLoading() {
      Indicator.close()
    },
    showToast(opt) {
      Toast({
        duration: 1000,
        ...opt
      })
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible
    },
    hideMenu() {
      this.menuVisible = false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  data() {
    return {
      menuVisible: false
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
  padding-top: 40px;
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
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 19;
  transform: translateX(-100%);
  background: #4fc1e9;
  transition: transform .3s ease;
  color: white;
  &.open {
    transform: translateX(0);
  }
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
</style>
