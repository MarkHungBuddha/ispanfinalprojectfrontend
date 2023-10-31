import { createApp } from 'vue';
import axios from 'axios';  // 引入 Axios
import './assets/main.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import router from './router';
import App from './App.vue';
import sidebar from "@/components/sidebar.vue";
import Home from "@/views/Home.vue";
import productPage from "@/views/productPage.vue";

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

app.component('sidebar', sidebar);
app.component('Home', Home);
app.component('productPage', productPage);

// （可選）將 Axios 設定為全局屬性，這樣您可以在任何組件中使用 this.$axios 進行請求
app.config.globalProperties.$axios = axios;

app.use(vuetify).use(router).mount('#app');