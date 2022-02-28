import { createRouter, createWebHistory } from 'vue-router'
import Remote from '@/views/Remote.vue'
import AdminRemote from '@/views/AdminRemote.vue'
import ProtubeScreen from '@/views/ProtubeScreen.vue'
import AdminProtubeScreen from '@/views/AdminProtubeScreen.vue'

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
    name: 'Screen',
    component: ProtubeScreen
  },
  {
    path: '/screen/admin',
    name: 'Admin Screen',
    component: AdminProtubeScreen
  }

]
const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes
})
export default router