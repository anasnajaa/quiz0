import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import UUID from 'vue-uuid';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
 
Vue.use(UUID);
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
