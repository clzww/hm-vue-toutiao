import Vue from 'vue'
import {
  Button,
  Field,
  Form,
  Toast,
  Dialog,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Uploader,
  List,
  Tab,
  Tabs,
  PullRefresh,
  Sticky
} from 'vant'

Vue.use(Button)
Vue.use(Field)
Vue.use(Form)
// 会给vue的原型上添加一个 $toast,所有的组件都可以通过 this.$toast
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Uploader)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(PullRefresh)
Vue.use(Sticky)
