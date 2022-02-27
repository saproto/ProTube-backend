import { createRouter, createWebHistory } from 'vue-router'
import Remote from '@/views/Remote.vue'
import AdminRemote from '@/views/AdminRemote.vue'
import ProtubeScreen from '@/views/ProtubeScreen.vue'

const routes = [
  {
    path: '/remote',
    name: 'Home',
    component: Remote
  },
  {
    path: '/remote/admin',
    name: 'Admin Remote',
    component: AdminRemote
  },
  {
    path: '/screen',
    name: 'Protube Screen',
    component: ProtubeScreen
  }
]
const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes
})
export default router