<template>
  <div class="goods-item" @click="itemClick">
    <!-- @load,vue封装好的监听图片加载完成 -->
    <img v-lazy="showImage" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      goodsItem: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      showImage() {
        return this.goodsItem.image || this.goodsItem.show.img
      }
    },
    methods: {
      imageLoad() {
        // console.log('imageLoad');
        // 通过事件总线的方式发送事件给Home
        // this.$bus.$emit('itemImageLoad')

        // 现在首页和详情页里面的图片加载完成，都会向外发送事件,将首页刷新，但是详情页的数据不能加载完就把首页刷新，所以需要区分开啦
        // 第一种解决方法
        if (this.$route.path.indexOf('./home')) {
          this.$bus.$emit('itemImageLoad')
        } else if (this.$route.path.indexOf('./detail')) {
          this.$bus.$emit('itemImageLoad')
        }
      },
      itemClick() {
        // 路由跳转，跳珠到详情页面
        this.$router.push('/detail/' + this.goodsItem.iid)
      }
    },
    
  }
</script>

<style scoped>
  .goods-item {
    padding-bottom: 40px;
    position: relative;

    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>