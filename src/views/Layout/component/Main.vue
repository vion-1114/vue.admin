<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
#main-wrap {
  height: 100vh;
  // position: fixed;
  // left: 200px;
  // top: 75px;
  // right: 0;
  // bottom: 0;
  // background: white;
  // border: 30px solid #f7f7f7;
  // border-bottom: none;
  // -webkit-box-sizing: border;
  // box-sizing: border-box;
}
.main-content {
  width: 100%;
  height: 100%;
  padding-top: $layoutHeader + 30;
  padding-left: $navMenu + 30;
  padding-right: 30px;
  @include webkit(transition, all 0.3s ease 0s);
  @include webkit(box-sizing, border-box);
}
.open {
  .main-content {
    padding-left: $navMenu + 30;
  }
}
.close {
  .main-content {
    padding-left: $navMenuMin + 30;
  }
}
.content {
  width: 100%;
  height: 100%;
  padding: 30px 30px 0 30px;
  @include webkit(box-sizing, border-box);
  box-sizing: border-box;
  background: #fff;
}
</style>
