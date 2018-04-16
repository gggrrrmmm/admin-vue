import axios from 'axios'
import {getToken} from './auth.js'
const http = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1'
})
// 添加请求拦截器（拦截器的本身就是一个方法，该方法什么时候执行？拦截器接收一个参数config,config就是你当前请求配置对象）
http.interceptors.request.use(function (config) {
// 如果本次请求的不是 /login接口，则们就加入请求头
  if (config.url !== '/login') {
    config.headers['Authorization'] = getToken()
  }
  return config
  // return config就如next() 允许通过 通过之后才会真正发送请求
}, function (error) {
  return Promise.reject(error)
})
// 通过定义插件的配置来扩展vue本身
// 1 定义一个插件对象
const httpPlugin = {}
// 2 为插件对象添加一个成员：install
// install是一个函数 该函数有两个参数：vue，options
httpPlugin.install = function (Vue, options) {
// 3 添加实例方法
  // Vue.prototype.$http = axios.create({
  //   baseURL: 'http://localhost:8888/api/private/v1'
  // })
  Vue.prototype.$http = http
}
// 4 导出插件对象
export default httpPlugin
// 5在入门文件模块 mian.js中加载使插件生效
// Vue.use(httpPlugin)
