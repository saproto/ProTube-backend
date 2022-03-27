import { createRouter, createWebHistory } from 'vue-router'
import Remote from '@/views/Remote.vue'
import AdminRemote from '@/views/AdminRemote.vue'
import ProtubeScreen from '@/views/ProtubeScreen.vue'
import AdminProtubeScreen from '@/views/AdminProtubeScreen.vue'
import ErrorPage from '@/views/ErrorPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import { socketDetails } from '@/js/authenticator'

const routes = [
  {
    path: '/',
    redirect: '/remote',
  },
  {
    path: '/login',
    name: 'Login',
    props: true,
    meta: {
      transition: 'fade'
    },
    component: LoginPage
  },
  {
    path: '/remote',
    name: 'Remote',
    component: Remote,
    meta: {
      'auth': true,
      'adminAuth': false
    }
  },
  {
    path: '/remote/admin',
    name: 'Admin Remote',
    component: AdminRemote,
    meta: {
      'adminAuth': true
    }
  },
  {
    path: '/screen',
    name: 'Screen',
    component: ProtubeScreen,
    meta: {
      'auth': true,
      'adminAuth': false
    }
  },
  {
    path: '/screen/admin',
    name: 'Admin Screen',
    component: AdminProtubeScreen,
    meta: {
      'adminAuth': true
    }
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: "Page not found!",
    component: ErrorPage 
  }

]
const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes
})

// authentication middleware
router.beforeEach((to, from, next) => {
  let socketdetails = socketDetails();
  // prevent login route looping
  if(to.name == 'Login' || to.name == 'Page not found!') return next();
  // user is authenticated for the requested path
  if(   (to.meta.adminAuth && socketdetails.admin_socket.connected) 
    ||  (to.meta.auth && socketdetails.user_socket.connected)) return next();
 
  // requested path is admin and the user had no admin socket
  else if(to.meta.adminAuth || to.meta.auth){
    return next({ name: 'Login' , params: {
      targetPath: to.name,
      requests_admin: to.meta.adminAuth
    }});
    //  authenticator
  }
});

export default router