import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录用户，一个对象，包含token信息
    user: null
  },
  mutations: {
    setUser (state, data) {
      state.user = data
    }
  },
  actions: {},
  modules: {}
})
