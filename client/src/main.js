import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import vueTruncate from 'vue-truncate-filter';
import vueMoment from 'vue-moment';
import GSignInButton from 'vue-google-signin-button'
import truncate from 'vue-truncate-collapsed'

Vue.use(GSignInButton)
Vue.use(ElementUI);
Vue.use(vueMoment)
Vue.use(vueTruncate)
Vue.use(truncate)

new Vue({
  el: '#app',
  components: {
    truncate
  },
  render: h => h(App)
});