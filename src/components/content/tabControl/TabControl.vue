<template>
  <div class="tab-control">
    <div v-for="(item, index) in title" 
      class="tab-control-item"
      :class="{active: index === currentIndex}"
      @click="itemClick(index)">
      <span>{{item}}</span>
      </div>
  </div>
</template>

<script> 
export default {
  name: 'TabControl',
  props: {
    title: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // 记录title中哪个文字被选中
      // 用于动态绑定class，进行判断
      currentIndex: 0
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      // 将内部点击事件传递到外面，让外面的组件切换数据
      this.$emit('tabClick', index)
    }
  }
}
</script>

<style scoped>
  .tab-control {
    display: flex;
    text-align: center;
    font-size: 15px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
  }

  .tab-control-item {
    flex: 1;
  }

  .tab-control-item span {
    padding: 3px;
  }

  .active {
    color: var(--color-height-text);
  }

  .active span {
    border-bottom: 3px solid var(--color-tint);
  }
</style>