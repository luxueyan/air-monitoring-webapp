<template lang="jade">
div.login-form
  h2 大气监测
  h3 Air Monitoring
  form(@submit.prevent='login($event)')
    .form-group
      .input.withicon
        i.icon-air.icon-user
        input(type='text' placeholder='用户名' v-model='user.username')
        .right
          i.mintui.mintui-field-error(@click='clearInput("username")' v-show='user.username')
    .form-group
      .input.withicon
        i.icon-air.icon-lock
        input(type='password' placeholder='密码' v-model='user.pwd')
        .right
          i.mintui.mintui-field-error(@click='clearInput("pwd")' v-show='user.pwd')
    .form-group
      button 登 录
</template>

<script>
import {
  Field
} from 'mint-ui'
import {
  login
} from '../common/resources.js'
import {
  mapActions
} from 'vuex'
import commonMixins from './mixins.js'

export default {
  mixins: [commonMixins],
  components: {
    mtField: Field
  },
  methods: {
    ...mapActions(['updateUser']),
    clearInput(input) {
      this.user[input] = ''
    },

    async login() {
      if (!this.user.username || !this.user.pwd) {
        this.showToast({
          message: '用户名密码不能为空'
        })
      } else {
        this.showLoading()
        let data = await login.save(this.user).then(res => res.json())

        this.hideLoading()
        if (data.issuccess) {
          let user = {
            ...this.user,
            token: data.token
          }

          this.updateUser(user)

          // 避免键盘没有收起导致 index 高度计算错误
          setTimeout(() => {
            this.$router.push({
              name: 'index'
            })
          }, 500)
        } else {
          this.showToast({
            message: data.errormsg || '登录失败'
          })
        }
      }
    }
  },

  data() {
    let user = JSON.parse(window.localStorage.user || '{}')
    return {
      user: {
        username: user.username,
        pwd: ''
      }
    }
  }
}
</script>

<style lang="scss">
.form-group {
  display: flex;
  label {
    width: 0.241546rem;
  }
  .input,
  button {
    flex: 1;
    display: block;
  }
}

.login-form {
  // background: white;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0.402576rem; //40px
  right: 0.402576rem; //40px
  color: white;
  input {
    height: auto;
  }
  form {
    border-radius: 0.040258rem; // 5px
    padding: 0.402576rem; // 40px
  }
  h2 {
    font-size: 0.644122rem; //80px
  }
  h3 {
    font-size: 0.805153rem; //100px
    margin-top: 0.161031rem; //20px
    margin-bottom: 0.402576rem; //50px
    padding-left: 1em;
  }
}
</style>
