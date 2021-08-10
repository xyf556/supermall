import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutaion-types' 

export default {
  // mutations唯一目的就是修改state中的状态
  // mutations中的每一个方法尽可能完成的事情比较单一一点
  
  // 为了做跟踪
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    // 商品添加进购物车是默认选中，需要在模型即存放商品这里添加这个属性，模型改变再让页面改变
    payload.checked = true

    state.cartList.push(payload)
  }
}