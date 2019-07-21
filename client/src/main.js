import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import vueTruncate from 'vue-truncate-filter';
import vueMoment from 'vue-moment';
import GSignInButton from 'vue-google-signin-button'

Vue.use(GSignInButton)
Vue.use(ElementUI);
Vue.use(vueMoment)
Vue.use(vueTruncate)

new Vue({
  el: '#app',
  render: h => h(App)
});