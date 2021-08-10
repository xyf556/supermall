<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content"
       ref="scroll" 
       @scroll="contentScroll"
       :probeType="3">
       <!-- 那边默认传过来是0，就无法获取scroll里面的position了 -->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-buttom-bar @addCart="addToCart"></detail-buttom-bar>
      <!-- 想监听组件的点击需要加上native -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  
    <!-- <toast :message="message" :show="show"></toast> -->
  </div>

</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar.vue'
  import DetailSwiper from './childComps/DetailSwiper.vue'
  import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
  import DetailShopInfo from './childComps/DetailShopInfo.vue'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
  import DetailParamInfo from './childComps/DetailParamInfo.vue'
  import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
  import DetailButtomBar from './childComps/DetailButtomBar.vue'

  // 引入better-scroll
  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodList'
  import BackTop from 'components/content/backTop/BackTop'
  // import Toast from 'components/common/toast/Toast'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'

  import {debounce} from 'common/utils.js'
  import {backTopMixin} from 'common/mixin.js'

  import {mapActions} from 'vuex'

  export default {
    name: 'Detail',
    data() {
      return {
        iid: null,
        // 存放详情页轮播图片
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        // 主题跳转防抖函数
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false

      }
    },
    mixins: [backTopMixin],
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailButtomBar,
      BackTop,
      // Toast,

      Scroll,
      GoodsList
    },
    created() {
      // 获取详情页的数据，进行展示

      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情页数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部的图片轮播数据
        // console.log(res);
        // 数据里面的result存放着其他数据
        const data = res.result
        this.topImages = data.itemInfo.topImages
      
        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      
        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品详细信息
        this.detailInfo = data.detailInfo

        // 5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.取出评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]

        // 注意：拿到数据后，需要进行渲染，才能更新DOM,回回调$nextTick这个函数,
        // 使用this.$nextTick() => {},保证渲染更新完，才能取到$el,组件里面的元素的值
        // this.$nextTick(() => {
        //   // 根据最新的数据，对应DOM是已经被渲染出来的
        //   // 但是图片依旧是没有加载完成（目前获取到的offsetTop不包含其中的图片）
        //   // offsetTop值不对时。都是因为图片的问题

        //   // 先赋空，下次回调重新塞数据
        //   this.themeTopYs = []

        //   this.themeTopYs.push(0);
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // }) 
        }
      })
      
      // 3.请求推荐数据
      getRecommend().then(res => {
        console.log(res);
        this.recommends = res.data.list
      }) 

      // 4.给getThemeTopY通过防抖函数赋值,再将这个函数传递给imageLoad，图片加载结束后执行
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // js中的最大值，拿来判断
        this.themeTopYs.push(Number.MAX_VALUE)
        
        console.log(this.themeTopYs);
      }, 100)
    
    }, 
    methods: {
      // 将vuex中的actions里面的方法映射过来
      ...mapActions(['addCart']),

      imageLoad() {
        this.$refs.scroll.refresh()

        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // console.log(position);
        // 1.获取y值
        const positionY = -position.y

        // 2.positionY和主题中值进行对比
        // [0, 20312, 21595, 21814] 例
        // positionY 在 0 到 20312 之间， index = 0
        // positionY 在 20312 到 21595 之间， index = 1
        // positionY 在 21595 到 21841 之间， index = 2

        // positionY 超过21841 的值，index = 3
        let length = this.themeTopYs.length;
      
      // 第一种方式
      //   for (let i= 0; i < length; i++) {
      //     // 第一种方式
      //     if (this.currentIndex !== i && (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i])) {
      //       this.currentIndex = i;
      //       console.log(this.currentIndex);
      //       this.$refs.nav.currentIndex = this.currentIndex
      //     }
      //   }

      // 第二种方式
       // 第二种方式，在positionY 21841 和非常大的值之间，index = 3
      for (let i = 0; i < length -1; i++) {
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      // 3.是否显示返回顶部
      this.listenShowBackTop(position) 
      },
      addToCart() {
        // 1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.newPrice;
        product.iid = this.iid;

        // 2.将商品添加进购物车里
        // this.$store.commit('addCart', product)
        this.$store.dispatch('addCart', product).then(res => {
          // console.log(res);
          // this.show = true;
          // this.message = res;

          // setTimeout(() => {
          //   this.show = false;
          //   this.message = ''
          // }, 1000)

          this.$toast.show(res, 1000)
        })

        // 将actions里面的addCart映射过来之后，上面的方法可以写为
        // this.addCart(product).then(res => {
        //   console.log(res);
        // })
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    background: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
    overflow: hidden;
  }
</style>