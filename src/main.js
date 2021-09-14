import Vue from 'vue';
import Button from 'ant-design-vue/lib/button';
import App from './App.vue';
import Antd from 'ant-design-vue';
Vue.config.productionTip = false;

import './style/themes/dark.less';

Vue.use(Antd);

Vue.component(Button.name, Button);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
