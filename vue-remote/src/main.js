import { createApp } from 'vue'

import App from './App.vue'

import { eventBus } from './eventbus'

import './assets/tailwind.css'

import router from './router/index.js'

const app = createApp(App);
app.config.globalProperties.eventBus = eventBus;
app.use(router);
app.mount('#app')
