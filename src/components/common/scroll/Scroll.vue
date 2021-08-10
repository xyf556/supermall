<template>
<!-- ref/children 子组件哪里 -->
  <div class="wrapper" ref="wrapper">
    <div  class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      // 有些组件只用时不需要监听滚动，设置成动态的，避免浪费空间
      probeType: {
        type: Number,
        default: 0
      },
      // 同上，上拉加载不一定所有使用这个组件的父组件都需要
      pullUpLoad: {
        type: Boolean,
        default :false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted () {
      // 1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        // 监听除button按钮外其他元素的点击需要设置
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })
      
      // 2.监听滚动位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          this.$emit('scroll', position)

        })
      }

      // 3.监听上拉加载，监听滚动到底部加载
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      // 防止首页create执行时，这边的mounted还没挂载上去，没有scroll属性，加一层判断：this.scroll && 后面是下面方法里面执行的语句
      // 前面为真时，才能执行后面语句

      // 小箭头回到顶部的方法
      scrollTo(x, y, time=300) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      refresh() {
        // console.log("----");
        this.scroll && this.scroll.refresh()
      },
      // 执行finshPullUp这个方法后才能继续执行上拉加载的方法去拿数据
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      // 获取离开页面时的滚动的y值，方便回来时定位
      getScrollY() {
        // console.log(this.scroll.y);
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>