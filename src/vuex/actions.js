import { router } from '../router.js'

export default {
  updateUser: function(context, user = {}) {
    window.localStorage.user = JSON.stringify(user)
    context.commit('updateUser', user)
  },
  logout(context) {
    window.localStorage.user = '{}'
    context.commit('updateUser', {})
    router.push({
      name: 'login'
    })
  }
}
