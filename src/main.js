import { createApp } from 'vue'
import './assets/main.css'
import 'vuetify/styles'
import{ createVuetify } from 'vuetify';
// import Vuetify from 'vuetify';

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// import 'bootstrap-icons/font/bootstrap-icons.css'
// import '@/assets/bootstrap.min.css'
// import '@/assets/bootstrap.min.js'
import router from './router'
import App from './App.vue'
import sidebar from "@/components/sidebar.vue";
import Home from "@/views/Home.vue";
import productPage from "@/views/productPage.vue";


const app = createApp(App)

const vuetify = createVuetify({
    theme: {
        dark: false,
    },
    components,
    directives,
})

app.component('sidebar', sidebar);
app.component('Home', Home);
app.component('productPage', productPage);

app.use(vuetify).use(router).mount('#app');

