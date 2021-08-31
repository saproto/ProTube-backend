import { createApp } from 'vue'
import vuetify from './plugins/vuetify'

import App from './App.vue'

import { eventBus } from './socket'

const app = createApp(App);
app.config.globalProperties.eventBus = eventBus;
app.use(vuetify).mount('#app')
