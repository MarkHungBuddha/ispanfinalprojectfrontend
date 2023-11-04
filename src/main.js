import { createApp } from 'vue';
import axios from 'axios';  // 引入 Axios
import './assets/main.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import store from './store';  // 引入 Vuex store

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import router from './router';
import App from './App.vue';
import sidebar from "@/components/sidebar.vue";
import Home from "@/views/Home.vue";
import productPage from "@/views/productPage.vue";
import navbar from "@/components/navbar.vue";
import '@mdi/font/css/materialdesignicons.css'


// import 'vuetify/dist/vuetify.min.css';
// 設定 Axios
axios.defaults.withCredentials = true;

const app = createApp(App);

const vuetify = createVuetify({
    theme: {
        dark: false,
    },
    components,
    directives,
});
axios.interceptors.response.use(
    response => {
        store.dispatch('updateApiCallStatus', true);
        return response;
    },
    error => {
        store.dispatch('updateApiCallStatus', true);  // 也可以在此處設置
        return Promise.reject(error);
    }
);

app.component('sidebar', sidebar);
app.component('Home', Home);
app.component('productPage', productPage);
app.component('navbar', navbar);

app.config.globalProperties.$axios = axios;

app.use(vuetify).use(router).use(store).mount('#app');  // 加入 .use(store)
