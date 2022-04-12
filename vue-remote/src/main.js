import { createApp } from 'vue'

import App from './App.vue'

import { eventBus } from '@/js/eventbus'
import { onYouTubeIframeAPIReady, youtubePlayerReady } from '@/js/screen_socket'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faPause, faBackward, faForward } from "@fortawesome/free-solid-svg-icons";

library.add([faPlay, faPause, faBackward, faForward]);

import './assets/tailwind.css'

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import router from './router/index.js'

const app = createApp(App);
app.config.globalProperties.eventBus = eventBus;
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
window.youtubePlayerReady = youtubePlayerReady;
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount('#app');
