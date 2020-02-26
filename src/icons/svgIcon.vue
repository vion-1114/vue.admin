<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script>
import { ref, computed } from '@vue/composition-api'

export default {
  name: 'svgIcon',
  //props 父组件传参接收
  props: {
    iconClass: {
      type: String,
      default: '' //默认值
    },
    className: {
      type: String,
      default: '' //默认值
    }
  },
  setup(props) {
    //计算属性 得出最终结果 并返回
    const iconName = computed(() => `#icon-${props.iconClass}`)
    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${props.className}`
      } else {
        return 'svg-icon'
      }
    })
    return {
      iconName,
      svgClass
    }
    /**
     * computed 监听变量的变化，并计算属性
     */
    // const count = ref(10)
    // const pl = computed(() => {
    //   return count.value + 1
    // })
  }
}
</script>
<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
