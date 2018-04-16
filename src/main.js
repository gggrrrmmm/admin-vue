// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import httpPlugin from './assets/js/http.js'

import './assets/css/style.css'
Vue.use(ElementUI)
// 加载httpPlugin插件（封装自axios）我们在该插件中vue原型对象扩展了一个成员$http
Vue.use(httpPlugin)
Vue.config.productionTip = false
// 为Vue.prototype动态添加成员 所有组件都是Vue实例 所有组件中的this都可以访问原型prototype中的成员
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
