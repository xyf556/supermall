<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list></cart-list>

    <!-- 底部汇总 -->
    <cart-buttom-bar></cart-buttom-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  
  import CartList from './childComps/CartList.vue'
  import CartButtomBar from './childComps/CartButtomBar.vue'
  // vuex的一种用法，mapGetters辅助函数，将store中的getter映射到局部计算属性
  import { mapGetters } from 'vuex'

  export default {
    name: 'Cart',
    components: {
      NavBar,
      CartList,
      CartButtomBar
    },
    computed: {
      // 两种用法
      // 第一种，直接导入
      // ...mapGetters(['cartLength', 'cartList']),
      // 第二种，可以改别名
     ...mapGetters({
        length: 'cartLength',
        list: 'cartList'
      })
      },
  }
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>