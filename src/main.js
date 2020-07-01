import Vue from 'vue'
import App from './App.vue'
import { Button, Field, Form, Toast } from 'vant'
import 'amfe-flexible'
import './styles/common.less'
import './styles/iconfont.less'
import router from './router'
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'

Vue.use(Button)
Vue.use(Field)
Vue.use(Form)
Vue.use(Toast)

Vue.config.productionTip = false

Vue.component('hm-header', HmHeader)
Vue.component('HmLogo', HmLogo)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
