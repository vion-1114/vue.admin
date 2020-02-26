import cookie from 'cookie_js'

const adminToken = 'adminToken'
const userName = 'userName'
export function getToken() {
    return cookie.get(adminToken)
}
export function setToken(token) {
    return cookie.set(adminToken, token)
}
export function removeToken() {
    return cookie.remove(adminToken)
}
export function getUsername() {
    return cookie.get(userName)
}
export function setUsername(value) {
    return cookie.set(userName, value)
}
export function removeUsername() {
    return cookie.remove(userName)
}