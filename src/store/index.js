import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'
// 1.安装插件
Vue.use(Vuex)

// 2.创建store对象
const state = {
  // 放商品
  cartList: []
}
const store = new Vuex.Store({
  state,
  mutations,
  // 一般异步操作放在action里面，比较复杂的函数也放进去
  actions,
  getters
})

// 3.挂载Vue实例上
export default store