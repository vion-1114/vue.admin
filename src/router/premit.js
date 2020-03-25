import router from './index'
import { getToken, removeUsername, removeToken } from '@/utils/login'
import store from '../store/index'
const whiteRouter = ['/login']

router.beforeEach((to, from, next) => {
    if (getToken()) {
        //路由动态添加，分配菜单，不同角色分配不同菜单
        console.log('存在')
        if (to.path === '/login') {
            removeToken()
            removeUsername()
            store.commit('SET_TOKEN', '')
            store.commit('SET_USERNAME', '')
            next()
        } else {
            next()
        }
    } else {
        if (whiteRouter.indexOf(to.path) !== -1) {
            //存在/login
            next() //跳转但不触发此函数
        } else {
            //不存在/login强制跳转index，触发本函数返回login页面
            next('/login')
        }

        /**
         * 1.直接进入index时，to.path为index，触发路由指向，就会跑beforeeach
         * 2.再一次next指向login，跑本函数，to。path为login
         * 3.白名单存在，则指向next()，因为无参，不会进入beforeeach，造成死循环
         */
    }
})