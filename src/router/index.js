import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import UserEdit from '../views/UserEdit.vue'
import User from '../views/User.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 这里的name用于注册页面注册成功后，参数回传到登录页面
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
    { path: '/user', component: User, name: 'user' },
    { path: '/user-edit', component: UserEdit, name: 'user-edit' }
  ]
})
// 全局的导航守卫（路由的钩子函数）
// to: 到哪去
// from: 从哪来
// next():代表放行
const pages = ['/user', '/user-edit']
router.beforeEach(function(to, from, next) {
  const token = localStorage.getItem('token')
  if (pages.includes(to.path)) {
    if (token) {
      next()
    } else {
      router.push('/login')
    }
  } else {
    next()
  }
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
