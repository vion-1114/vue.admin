import Vue from 'vue'
import svgIcon from './svgIcon'
//组件 属性1为组件使用名，属性2为组件实现的vue页面
Vue.component('svg-icon', svgIcon)

//svg文件解析 1.解析目录 2.是否遍历子级目录 3.解析文件后缀
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
    return requireContext.keys().map(requireContext)
}
requireAll(req)