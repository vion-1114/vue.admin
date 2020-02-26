const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false
}
const getters = {
    //对值操作
}
const mutations = {
    //同步 commit触发
    SET_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
    }
}
const actions = {}
export default {
    namespaced: true, //命名空间
    state,
    getters,
    mutations,
    actions
}