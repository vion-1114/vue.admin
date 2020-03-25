import service from "@/utils/request"

/**
 * 列表
 */
/**
 * 新增
 */
/**
 * 编辑
 */
/**
 * 删除
 */
//添加一级分类
export function AddFirstCategory(data) {
    return service.request({
        method: 'post',
        url: '/news/addFirstCategory/',
        data: data
    })
}
//获取分类

export function GetCategory() {
    return service.request({
        method: 'post',
        url: '/news/getCategory/'
    })
}
//获取分类+子分类
export function GetCategoryAll() {
    return service.request({
        method: 'post',
        url: '/news/getCategoryAll/'
    })
}
//删除分类
export function delCategory(data) {
    return service.request({
        method: 'post',
        url: '/news/deleteCategory/',
        data: data
    })
}
//修改分类
export function updateCategory(data) {
    return service.request({
        method: 'post',
        url: '/news/editCategory/',
        data: data
    })
}

//添加分类
export function addCategory(data) {
    return service.request({
        method: 'post',
        url: '/news/add/',
        data: data
    })
}
//添加自己分类
export function addChildCategory(data) {
    return service.request({
        method: 'post',
        url: '/news/addChildrenCategory/',
        data: data
    })
}

//获取信息列表	
export function getinfoList(data) {
    return service.request({
        method: 'post',
        url: '/news/getList/',
        data: data
    })
}
//删除信息	
export function delInfo(data) {
    return service.request({
        method: 'post',
        url: '/news/deleteInfo/',
        data: data
    })
}

//编辑信息	
export function editNewInfo(data) {
    return service.request({
        method: 'post',
        url: '/news/editInfo/',
        data: data
    })
}