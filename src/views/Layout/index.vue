<template>
  <div id="layout" :class="[menuState ? 'close' : 'open']">
    <LayoutHeader />
    <LayoutNav />
    <LayoutMain />
  </div>
</template>
<script>
import LayoutHeader from './component/Header'
import LayoutNav from './component/Nav'
import LayoutMain from './component/Main'
import {
  reactive,
  isRef,
  ref,
  toRefs,
  onMounted,
  computed
} from '@vue/composition-api'
export default {
  name: 'layout',
  components: { LayoutHeader, LayoutNav, LayoutMain },
  setup(props, { root }) {
    //监听菜单按钮状态
    const menuState = computed(() => root.$store.state.app.isCollapse)

    return {
      menuState
    }
  }
}
</script>
<style lang="scss" scoped></style>
