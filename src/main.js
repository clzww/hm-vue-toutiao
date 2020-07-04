import Vue from 'vue'
import App from './App.vue'
// amfe-flexible：移动端适配
import 'amfe-flexible'
import './styles/common.less'
import './styles/iconfont.less'
import router from './router'
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import HmNavBar from './components/HmNavBar.vue'
import moment from 'moment'
import './vant'
// 虽然前边引入了vant.js，但是里边的组件只能在VUE的组件里边使用，不能在main.js中使用，要用还得单独引入
import { Toast } from 'vant'
import axios from 'axios'

Vue.prototype.$axios = axios

axios.defaults.baseURL = 'http://localhost:3000'
// 给axios配置请求拦截器
axios.interceptors.request.use(function(req) {
  // 浏览器发送的ajax请求的所有的配置信息
  // 给所有的请求添加token
  const token = localStorage.getItem('token')
  if (token) {
    req.headers.Authorization = token
  }
  return req
})
// 响应拦截器
axios.interceptors.response.use(function(res) {
  const { statusCode, message } = res.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    // token失效导致
    Toast.fail(message)
    // 跳转到登录页面
    router.push('/login')
    // 删除过期的token
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }
  return res
})

Vue.component('hm-header', HmHeader)
Vue.component('HmLogo', HmLogo)
Vue.component('hm-navbar', HmNavBar)

Vue.filter('time', function(value) {
  return moment(value).format('YYYY-MM-DD')
})

// 它会显示你生产模式的消息
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
