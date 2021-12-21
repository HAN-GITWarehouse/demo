import Vue from 'vue'
import App from '../App.vue'
import router from '../router/index'
import '../assets/iconfont/iconfont.css'
import '../utils/rem'
import VueI18n from 'vue-i18n'
import cn from '../i18n/cn'
import en from '../i18n/en'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'cn',
  messages: {
    cn,
    en
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
