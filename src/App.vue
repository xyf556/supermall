<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <!-- 旅游业跳转页面时会把前面的页面销毁，加上keep-alive让页面不用销毁再重新建立 -->
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar></main-tab-bar>
  </div>
</template>

<script>  
  import MainTabBar from 'components/content/mainTabbar/MainTabBar'

  export default {
    name: 'App',
    components: {
      MainTabBar
    }
  }
</script>

<style scoped>
  @import "assets/css/base.css";
</style>