<template>
  <swiper>
      <swiper-item v-for="item in banners">
        <a :href="item.link">
          <img :src="item.image" @load="imageLoad">
        </a>
      </swiper-item>
    </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper/index.js'
  
  export default {  
    name: 'HomeSwiper',
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        isLoad: false
        // 记录是否已经发出事件了
      }
    },
    components: {
      SwiperItem,
      Swiper
    },
    methods: {
      imageLoad() {
        if (!this.isLoad) {
          // 轮播图片的的加载速度会影响到Home组件中获取tab-control中offsetTop的高度
          this.$emit('swiperImageLoad');
          // 事件已经发出去了，只发送一次就行
          this.isLoad = true
        }
      }
    }

  }
</script>

<style>

</style>