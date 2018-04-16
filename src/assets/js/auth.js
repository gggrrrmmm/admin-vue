/*
自定义业务函数模块 封装auto 封装和用户授权相关的函数
*/
const userInfoKey = 'user-info'
// 保存登录信息到本地存储
// @param {Object} userInfo 用户登录成功的信息对象
// @return {undefined}  无返回值
// 保存登录信息到本地存储
export function saveUserInfo (userInfo = {}) {
  window.localStorage.setItem(userInfoKey, JSON.stringify(userInfo))
}
// 从本地存储获取当前登录用户用户信息
// @return {string} 得到的是登录用户信息对象的字符串
export function getUserInfo () {
  return window.localStorage.getItem(userInfoKey)
}
/* 获取本地存储用户信息的token令牌
  @return {string} 用户的token 身份令牌
*/
export function getToken () {
  return JSON.parse(getUserInfo()).token
}
/**
 *  删除本地存储中的用户登录信息
 * @return {undefined} 无返回值
 */
export function removeUserInfo () {
  window.localStorage.removeItem(userInfoKey)
}
