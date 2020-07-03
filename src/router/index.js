import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 这里的name用于注册页面注册成功后，参数回传到登录页面
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' }
  ]
})

export default router
