import Vue from 'vue'



import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './permission' // permission control

const { mockXHR } = require('../mock')
mockXHR()

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false
var _hmt = _hmt || [];
window._hmt = _hmt; // 将_hmt挂载到window下
 (function () {
       var hm = document.createElement("script");
       hm.src = "https://hm.baidu.com/hm.js?"+ process.env.VUE_APP_BAIDU_ANA_ID;
       var s = document.getElementsByTagName("script")[0];
       s.parentNode.insertBefore(hm, s);
  })();
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
