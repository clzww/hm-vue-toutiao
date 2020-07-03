import Vue from 'vue'
import App from './App.vue'
import { Button, Field, Form, Toast } from 'vant'
// amfe-flexible：移动端适配
import 'amfe-flexible'
import './styles/common.less'
import './styles/iconfont.less'
import router from './router'
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import HmNavBar from './components/HmNavBar.vue'
import moment from 'moment'
import axios from 'axios'

Vue.prototype.$axios = axios

axios.defaults.baseURL = 'http://localhost:3000'
// 给axios配置请求拦截器
axios.interceptors.request.use(function(config) {
  // 浏览器发送的ajax请求的所有的配置信息
  // 给所有的请求添加token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
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

Vue.use(Button)
Vue.use(Field)
Vue.use(Form)
Vue.use(Toast)

Vue.component('hm-header', HmHeader)
Vue.component('HmLogo', HmLogo)
Vue.component('hm-navbar', HmNavBar)

Vue.filter('time', function(input) {
  return moment(input).format('YYYY-MM-DD')
})

// 它会显示你生产模式的消息
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
