import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutaion-types' 

export default {
  // 需要通过context来获取state
  addCart(context, payload) {
    // 该方法在详情页面添加购物车时使用，用dispatch来使用，可以返回一个promise
   
    return new Promise((resolve, reject) => {
    // 1.查找之前数组中是否有该商品
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

    // 2.判断oldProduct
    if (oldProduct) {
      // oldProuduct.count += 1
      context.commit(ADD_COUNTER, oldProduct)
      resolve('当前商品数量+1')
    } else {
      payload.count = 1
      // context.state.cartList.push(payload)
      context.commit( ADD_TO_CART, payload)
      resolve('添加新的商品')
    }
   })
  }
}