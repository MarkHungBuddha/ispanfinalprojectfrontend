import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import 'vuetify/styles'; // All of Vuetify's styles
import 'material-design-icons-iconfont/dist/material-design-icons.css'; // Ensure you are using css-loader
import '@mdi/font/css/materialdesignicons.css';

// Set up Axios
axios.defaults.withCredentials = true;

// Create a new instance of Vuetify
const vuetify = createVuetify({
  components,
  directives,
  // Any additional Vuetify options
});

// Create a new Vue instance
const app = createApp(App);

// Set axios as a global property
app.config.globalProperties.$axios = axios;

// Use Vuetify, Router, and Store
app.use(vuetify).use(router).use(store).mount('#app');
