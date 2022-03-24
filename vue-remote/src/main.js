import { createApp } from 'vue'

import App from './App.vue'

import { eventBus } from '@/js/eventbus'
import { onYouTubeIframeAPIReady, youtubePlayerReady } from '@/js/screen_socket'

import './assets/tailwind.css'

import router from './router/index.js'

const app = createApp(App);
app.config.globalProperties.eventBus = eventBus;
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
window.youtubePlayerReady = youtubePlayerReady;
app.use(router);
app.mount('#app');
