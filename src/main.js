import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 将加入购物车显示的弹窗作为插件来加载
import toast from 'components/common/toast'

// fastclick插件
import FastClick from 'fastclick'
// 图片懒加载
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

// 将Vue实例作为事件总线，给home和gooditem之间传递事件监听，图片加载是否完成那块
Vue.prototype.$bus = new Vue()
// 插件就需要安装,安装插件相当于执行插件里面的install函数
Vue.use(toast)

// 解决移动端300ms延迟
FastClick.attach(document.body)

// 使用懒加载插件
Vue.use(VueLazyLoad, {
  // 占位图，懒加载图片还没加载出来的时候显示的
  loading: require('./assets/img/common/placeholder.png')
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
