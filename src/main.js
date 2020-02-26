import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './router/premit'
Vue.use(ElementUI)
Vue.use(VueCompositionApi)
Vue.config.productionTip = false

//路由守卫

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')