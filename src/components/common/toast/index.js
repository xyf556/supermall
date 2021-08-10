import Toast from './Toast.vue'

const obj = {}

// 默认会传入Vue
obj.install = function(Vue) {
  // Vue.prototype.$toast = 对象，令这个对象是Toast组件，就可使用里面的函数传递参数
  
  // 1.创建组件构造器
  const toastContrustor = Vue.extend(Toast)

  // 2.new的方法，根据组件构造器，可以创建出来一个组件对象
  const toast = new toastContrustor()

  // 3.将组件对象，手动挂载到某个元素上
  toast.$mount(document.createElement('div'))

  // 4.toast.$el对应就是div，将组件里面的模板加载到html里面
  document.body.appendChild(toast.$el)


  Vue.prototype.$toast = toast;
}

export default obj