import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import login from './modules/login'
import app from './modules/app'

export default new Vuex.Store({
    modules: {
        app,
        login
    }
})