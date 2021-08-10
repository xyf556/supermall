<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <!-- 在这里添加另一个tab-control达到吸顶效果 -->
    <tab-control :title="['流行', '新款', '精选']" 
                @tabClick="tabClick"
                ref="tabControl1"
                class="tab-control"
                v-show="isTabFixed"></tab-control>

    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load= "true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :title="['流行', '新款', '精选']" 
                @tabClick="tabClick"
                ref="tabControl2"
                ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- 想监听组件的点击需要加上native -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
      
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper.vue'
  import RecommendView from './childComps/RecommendView.vue'
  import FeatureView from './childComps/FeatureView.vue'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl.vue'
  import GoodsList from 'components/content/goods/GoodList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import { getHomeMultidata, getHomeGoods } from "network/home.js"
  import { debounce } from 'common/utils.js'
  import { backTopMixin } from 'common/mixin.js'
  // 轮播图组件有两个，将两个组件一起导入到index.js中，再集中导出，方便
  // import {Swiper, SwiperItem} from 'components/common/swiper/index.js'

  export default {
    name: 'Home',
    components: {
      // Swiper,
      // SwiperItem
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,

    },
    mixins: [backTopMixin],
    data () {
      return {
        // 根据获取到的数据内容，将数据分出来
        banners: [],
        recommends: [],
        // 首页里面那些衣服数据
        goods:{
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        // 是否显示小箭头返回顶部，设置v-show，传递的布尔值最好用变量存储,放到mixin.js里面混入
        // isShowBackTop: false,
        
        // tab-control栏距离顶部的距离,设置洗点效果,获取它的offsettop
        tabOffsetTop: 0,
        // 默认不吸顶
        isTabFixed: false,
        saveY:0,
        // itemImgListener: null
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
        console.log(this.goods[this.currentType].list);
      }
    },
    destroyed () {
      // 页面跳转时页面会销毁，通过在使用组件时加上keep-alive解决
      console.log('home destroyed');
    },
    activated() {
      // 进入页面时触发的函数
      // console.log('activated');
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      // 回到页面的滚动位置后最好做一次刷新
      this.$refs.scroll.refresh()
    },
    deactivated () {
      // 离开页面时触发的函数
      // console.log('deactivated');
      // 1.保存y值
      this.saveY = this.$refs.scroll.getScrollY()
      // console.log(this.saveY);

      // 2.取消全局事件的监听，使用事件总线的$off
      // this.$bus.$off('itemImageLoad', refresh())
    },
    // 创建生命周期函数
    created() {
      // 只写主要逻辑最好
      // 1.请求多个数据
      this.getHomeMultidata()
    
      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
      
    },
    mounted() {
      // 在created里面拿到的$refs.scroll或者通过document.querySelect拿到的是没有值的，下面这个在created里面拿得到值是因为回调了
      // 所以在mounted里面获取最好

      // 3.监听Goodsitem中图片加载完成
      // refresh是一个高频触发的函数,需要防抖函数处理
      const refresh = debounce(this.$refs.scroll.refresh, 200)
      
      this.$bus.$on('itemImageLoad', () => {
        // 将这个放到防抖函数里面处理
        // this.$refs.scroll.refresh()
        refresh()
      }) 

      
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      // 放进混入
      // backClick() {
      //   // 通过$refs来获取scroll组件里面的scroll这个属性
      //   // better-scroll里面的scrollTo方法可以设置返回顶部，参数为x，y,可以传入第三个参数来设置返回顶部的时间
      //   this.$refs.scroll.scrollTo(0, 0, 500)
      // },
      contentScroll(position) {
        // 1.判断BackTop是否显示，返回顶部按钮
        // this.isShowBackTop = (-position.y) > 1000
        // 通过混入的方法使用
        this.listenShowBackTop(position)


        // 2.决定tabControl是否吸顶（position：fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      // 上拉加载部分
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        // 轮播图片加载完毕后
        // 获取tabControl的offsetTop
        // 所组件都有一个属性$el：用获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        // console.log(this.$refs.tabControl2.$el.offsetTop);
      },



      /**
       * 网络请求相关方法
       */
      // 将数据请求方法也封装分离出来
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
      })
      },
      // 首页下面流行，精选，新款数据的获取方法
      getHomeGoods(type) {
        // 每一次调用可以动态获取配置
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          const goods = res.data.list;
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1;

          // 拉取数据需要执行上拉加载方法，上拉加载每次结束后，需要执行finishPullUp方法来进行下一次
          this.$refs.scroll.finishPullUp()
      })
      }
    }
  }
</script>



<style scoped>
  #home {
    /* padding-top: 44px; */
    /* 设置home高度，避免设置滚动时被撑开*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* 导航栏没有在better-scroll里面，bscroll可以实现局部滚动，这个滚动不会影响到导航栏 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }
  
  /* 下面的tab-control */
  /* 在没设置better-scroll滚动时有效 ,是tab-contral组件的*/
  /* .tab-control { */
    /* 根据设置的值，在滚轮移动到这个值时，将position属性改为了fixed。实现这个组件不随滚动条 滚动，固定在页面上*/
    /* position: sticky; */
    /* top: 44px; */
    /* z-index: 9; */
  /* } */

  /* 上面的 */
  .tab-control {
    position: relative;
    z-index: 9;
    /* top: 1px; */
  }

  .content {
    /* height: 300px; */
    overflow: hidden;
    
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /* .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */
</style>