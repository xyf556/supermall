import BackTop from 'components/content/backTop/BackTop'

export const backTopMixin = {
  components: {
    BackTop
  },
  data () {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      // 通过$refs来获取scroll组件里面的scroll这个属性
      // better-scroll里面的scrollTo方法可以设置返回顶部，参数为x，y,可以传入第三个参数来设置返回顶部的时间
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    listenShowBackTop(position) {
      return this.isShowBackTop = (-position.y) > 1000
    }
  }
}