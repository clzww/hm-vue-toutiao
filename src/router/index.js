import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import UserEdit from '../views/UserEdit.vue'
import User from '../views/User.vue'
import MyComment from '../views/MyComment.vue'
import MyFollow from '../views/MyFollow.vue'
import MyStar from '../views/MyStar.vue'
import Home from '../views/Home.vue'
import PostDetail from '../views/PostDetail.vue'
import Manage from '../views/Manage.vue'
import Search from '../views/Search.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 这里的name用于注册页面注册成功后，参数回传到登录页面
    { path: '/', component: Home, name: 'home' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
    { path: '/user', component: User, name: 'user' },
    { path: '/user-edit', component: UserEdit, name: 'user-edit' },
    { path: '/mycomment', component: MyComment },
    { path: '/myfollow', component: MyFollow },
    { path: '/mystar', component: MyStar },
    { path: '/post-detail/:id', component: PostDetail },
    { path: '/manage', component: Manage },
    { path: '/search', component: Search }
  ]
})
// 全局的导航守卫（路由的钩子函数）
// to: 到哪去
// from: 从哪来
// next():代表放行
const pages = ['/user', '/user-edit', '/myfollow', '/mystar', '/mycomment']
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

// 第十四天笔记，原因：重复的跳转到同一个路由
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
