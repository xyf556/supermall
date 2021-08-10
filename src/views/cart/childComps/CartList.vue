<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList" 
                      :key="index" 
                      :item-info="item">
                      </cart-list-item>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  
  import CartListItem from './CartListItem.vue'

  import { mapGetters } from 'vuex'

  export default {
    name: 'CartList',
    computed: {
      ...mapGetters(['cartList']),
    },
    components: {
      Scroll,
      CartListItem
    },
    activated() {
      // 获取要添加进购物车的数据后，需要对页面进行刷新，获取数据进来后的高度才能滚动
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart-list {
    /* position: relative; */
    height: calc(100vh - 44px - 49px - 40px);
  }
  .content {
    height: 100%;
    overflow: hidden;
  }
</style>