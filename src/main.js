import { createApp } from 'vue';
import axios from 'axios';
import './assets/main.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import store from './store';

// 其他组件导入...
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import router from './router';
import App from './App.vue';

// 你的自定义组件导入...
import sidebar from "@/components/sidebar.vue";
// 其他自定义组件导入...
import '@mdi/font/css/materialdesignicons.css';

// 设置 Axios
axios.defaults.withCredentials = true;

// 创建 Vue 应用
const app = createApp(App);

// 创建 Vuetify 实例，这里不需要单独导入 VListItemContent，
// 因为它已经在 components 中包含了
const vuetify = createVuetify({
    theme: {
        dark: false,
    },
    components,
    directives,
});

// 设置 Axios 响应拦截器
axios.interceptors.response.use(
    response => {
        store.dispatch('updateApiCallStatus', true);
        return response;
    },
    error => {
        store.dispatch('updateApiCallStatus', false);
        return Promise.reject(error);
    }
);

// 注册你的 Vue 组件
app.component('sidebar', sidebar);
// 注册其他自定义组件...

// 添加 Axios 到 Vue 的全局属性
app.config.globalProperties.$axios = axios;

// 使用 Vuetify、router 和 store
app.use(vuetify).use(router).use(store).mount('#app');
