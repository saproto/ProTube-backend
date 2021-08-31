import { createApp } from 'vue'

import App from './App.vue'

import { eventBus } from './socket'

import './assets/tailwind.css'

const app = createApp(App);
app.config.globalProperties.eventBus = eventBus;
app.mount('#app')
