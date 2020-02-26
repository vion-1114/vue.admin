import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
    // 引入布局组件
import Layout from '@/views/Layout'
const routes = [{
        path: '/',
        redirect: 'login',
        meta: {
            name: '主页'
        },
        hidden: true
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../views/Login/index.vue'),
        meta: {
            name: '登录'
        },
        hidden: true
    },
    {
        path: '/backstage',
        name: 'Backstage',
        redirect: 'console',
        meta: {
            name: '控制台',
            icon: 'console'
        },
        component: Layout,
        // layout存放组装的结构 layout中的index.vue为整合结构
        children: [{
            path: '/console',
            name: 'Console',
            component: () =>
                import ('../views/Console/index.vue'),
            meta: {
                name: '首页'
            }
        }]
    },
    {
        path: '/info',
        name: 'Info',
        meta: {
            name: '信息管理',
            icon: 'info'
        },

        component: Layout,
        // layout存放组装的结构 layout中的index.vue为整合结构
        children: [{
                path: '/infoIndex',
                name: 'InfoIndex',
                component: () =>
                    import ('../views/Info/index.vue'),
                meta: {
                    name: '信息列表'
                }
            },
            {
                path: '/infoCategory',
                name: 'InfoCategory',
                component: () =>
                    import ('../views/Info/category.vue'),
                meta: {
                    name: '信息分类'
                }
            }
        ]
    },
    {
        path: '/user',
        name: 'User',
        meta: {
            name: '用户管理',
            icon: 'user'
        },
        component: Layout,
        // layout存放组装的结构 layout中的index.vue为整合结构
        children: [{
            path: '/userIndex',
            name: 'UserIndex',
            component: () =>
                import ('../views/User/index.vue'),
            meta: {
                name: '用户列表'
            }
        }]
    }
]
const router = new VueRouter({
    routes
})
export default router