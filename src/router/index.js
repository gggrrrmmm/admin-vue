import Vue from 'vue'
import Router from 'vue-router'
import {getUserInfo} from '@/assets/js/auth'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue' // @是src路径的别名，webpack配置的
import UserList from '@/components/user-list/user-list.vue'
import RoleList from '@/components/role-list/role-list.vue'
import RightsList from '@/components/rights-list/rights-list.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    }, {
      name: 'home',
      path: '/',
      component: Home,
      // 可以通过配置子路由的方式让某个组件渲染到父路由
      // 1 在父路由组件中添加<router-view></router-view>
      // 2 在父路由中通过children 来声明路由
      // children 是一个数组
      // children 数组中配置一个一个子路由对象
      // 当访问user-list 组件的时候，则路由会先渲染它的父组件
      // 然后将user-list 组件渲染到父路由的router-view
      children: [
        {
          name: 'user-list',
          path: '/users',
          component: UserList
        }, {
          name: 'role-list',
          path: '/roles',
          component: RoleList
        }, {
          name: 'rights-list',
          path: '/rights',
          component: RightsList
        }
      ]
    }
  ]
})
// 1 添加路由拦截器（导航钩子，守卫）
// to 我要去哪里
// from 我从哪来的
// next 用来放行
router.beforeEach((to, from, next) => { // 1 添加全局路由导航守卫
  // 2 拿到当前请求的视图路径标识
  // 如果是登录组件，则直接放行通过
  // 有令牌 则过去  没有就去登录
  if (to.name === 'login') {
    next()
  } else {
    // 检查登录状态令牌
    // const token = window.localStorage.getItem('admin-token')
    if (!getUserInfo()) { // 无令牌，则去登录
      next({
        name: 'login'
      })
    } else { // 有令牌则通过
      next()
    }
  }
})
export default router
