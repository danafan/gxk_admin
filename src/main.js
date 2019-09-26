import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueClipboards from 'vue-clipboards';

Vue.use(ElementUI);
Vue.use(VueClipboards);
Vue.prototype.captcha = `${location.origin}/admin/admin/captcha`;		//获取验证码前缀
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
