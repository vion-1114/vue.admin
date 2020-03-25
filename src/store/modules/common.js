import { GetCategory, GetCategoryAll } from '@/api/news'
const actions = {
    //vuex 获取分类接口
    GetCategory({ commit }, requestData) {
        return new Promise((resolve, reject) => {
            //接口
            GetCategory({}).then(response => {
                    let data = response.data.data.data
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    GetCategoryAll({ commit }, requestData) {
        return new Promise((resolve, reject) => {
            //接口
            GetCategoryAll({}).then(response => {
                    let data = response.data.data
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}
export default { namespaced: true, actions }