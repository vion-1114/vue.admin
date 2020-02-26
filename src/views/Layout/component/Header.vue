<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenuState">
      <svg-icon iconClass="menu" className="menu" />
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <div class="user-head"><img src="~@/images/header.jpg" /></div>
        {{ username }}
      </div>
      <div class="header-icon pull-left" @click="exit">
        <svg-icon iconClass="close" className="close" />
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from '@vue/composition-api'

export default {
  name: 'header-wrap',
  setup(props, { root }) {
    const navMenuState = () => {
      root.$store.commit('app/SET_COLLAPSE')
    }

    const username = computed(() => root.$store.state.login.userName)
    const exit = () => {
      console.log(2222)
      root.$store.dispatch('login/exit').then(() => {
        root.$router.push({
          name: 'Login'
        })
      })
    }
    return {
      navMenuState,
      username,
      exit
    }
  }
}
</script>
<style lang="scss" scoped>
#header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  height: 75px;
  background: #fff;
  line-height: 75px;
  @include webkit(transition, all 0.3s ease 0s);
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
}
.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
}
.header-icon {
  padding: 0 32px;
  svg {
    margin-bottom: -8px;
    font-size: 25px;
    cursor: pointer;
    fill: currentColor;
  }
}
.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header-icon {
    padding: 0 28px;
  }
}
.user-info .user-head {
  width: 40px;
  height: 40px;
  padding: 15px 15px;
  float: left;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
</style>
