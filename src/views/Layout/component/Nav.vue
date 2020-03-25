<template>
  <div id="nav-wrap">
    <h1 class="logo">
      <img src="~@/images/logo.png" />
    </h1>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#344a5f"
      text-color="white"
      active-text-color="white"
      router
    >
      <template v-for="(item, index) in routers">
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index + ''">
          <!-- 一级菜单 -->
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
            <span slot="title">{{ item.meta.name }}</span>
          </template>
          <!-- 子级菜单 -->
          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.id"
            :index="subItem.path"
            >{{ subItem.meta.name }}</el-menu-item
          >
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
import {
  reactive,
  isRef,
  ref,
  toRefs,
  onMounted,
  computed
} from '@vue/composition-api'
import icons from '@/icons'

export default {
  name: 'nav-wrap',
  setup(props, { root }) {
    //data数据
    //控制菜单放大缩小的样式
    const isCollapse = computed(() => root.$store.state.app.isCollapse)
    //循环显示路由内容
    const routers = reactive(root.$router.options.routes)

    // 函数

    return {
      isCollapse,

      routers
    }
  }
}
</script>
<style lang="scss" scoped>
.logo {
  text-align: center;
  img {
    margin: 28px auto 23px;
    width: 90px;
    @include webkit(transition, all 0.3s ease 0s);
  }
}
#nav-wrap {
  width: 200px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #344a5f;
  @include webkit(transition, all 0.3s ease 0s);
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}
.open {
  #nav-wrap {
    width: $navMenu;
  }
}
.close {
  #nav-wrap {
    width: $navMenuMin;
  }
  .logo {
    img {
      width: 40px;
    }
  }
}
</style>
