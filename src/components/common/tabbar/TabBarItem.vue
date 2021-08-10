<template>
  <div class="tab-bar-item" @click="itemClick">
    <!-- 在插槽外面嵌套一层div，防止里面设置属性不生效 -->
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <!-- 在插槽前面嵌套一个div，设置的类就可以被使用 -->
    <!-- 动态绑定style，将要设置属性写入计算属性里面 -->
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name: 'TabBarItem',
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  data() {
    return {
      // isActive: true,
    }
  },
  computed: {
    isActive() {
      // 动态决定这个值为true还是false
      // 获取活跃路由的path，检索现在路由的路径，匹配失败会返回-1,可以来决定该值为true还是false
      return this.$route.path.indexOf(this.path) !== -1
    },
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {}
    }
  },
  methods: {
    itemClick() {
      // push和replace会跳转到指定的url，第一个方法会向history栈添加一个记录，点击可以回退上个页面
      // replace方法不会向history里面添加新记录，点击返回，没法跳转
      this.$router.replace(this.path)
    }
  }
}
</script>

<style scoped>
  .tab-bar-item {
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }
  .tab-bar-item img {
    width: 24px;
    height: 24px;
    margin-top: 3px;
    /* 去掉图片下面多出来的3px */
    vertical-align: middle;
    margin-bottom: 2px;
  }

</style>