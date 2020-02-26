import Vue from 'vue'
import Vuex from 'vuex'
import cookie from 'cookie_js'
import { Login } from '@/api/login'
import {
    setToken,
    setUsername,
    getUsername,
    removeToken,
    removeUsername
} from '@/utils/login'
Vue.use(Vuex)
const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    token: '',
    userName: cookie.get('userName') || ''
}
const getters = {
    //对值操作
}
const mutations = {
    //同步 commit触发
    SET_TOKEN(state, value) {
        state.token = value
    },
    SET_USERNAME(state, value) {
        state.userName = value
    }
}
const actions = {
    //异步同步 dispatch 触发  可带参数 SET_COLLAPSE(content,data)
    /**
     * content.state content.getters content.mutations
     */

    login({ commit }, requestData) {
        return new Promise((resolve, reject) => {
            //接口
            Login(requestData)
                .then(response => {
                    let data = response.data.data
                    commit('SET_TOKEN', data.token)
                    commit('SET_USERNAME', data.username)
                    setToken(data.token)
                    setUsername(data.username)
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    exit({ commit }) {
        console.log(11111)
        return new Promise((resolve, reject) => {
            removeToken()
            removeUsername()
            commit('SET_TOKEN', '')
            commit('SET_USERNAME', '')
            resolve()
        })
    }
}
export default { namespaced: true, state, getters, mutations, actions }