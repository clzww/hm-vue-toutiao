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
import axios from 'axios'

Vue.prototype.$axios = axios

axios.defaults.baseURL = 'http://localhost:3000'

Vue.use(Button)
Vue.use(Field)
Vue.use(Form)
Vue.use(Toast)

Vue.component('hm-header', HmHeader)
Vue.component('HmLogo', HmLogo)

// 它会显示你生产模式的消息
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
